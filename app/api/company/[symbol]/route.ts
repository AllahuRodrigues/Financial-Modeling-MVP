import { NextResponse } from 'next/server';

const key = process.env.FMP_KEY;
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function POST(request: Request) {
  const { symbols } = await request.json();
  
  if (!symbols || !Array.isArray(symbols)) {
    return NextResponse.json({ error: 'symbols array required' }, { status: 400 });
  }

  const results: any = {};
  
  for (const symbol of symbols) {
    const cached = cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      results[symbol] = { ...cached.data, fromCache: true };
    } else {
      results[symbol] = null;
    }
  }

  return NextResponse.json(results);
}

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;

  const cached = cache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json({ ...cached.data, fromCache: true });
  }

  if (!key) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const [incomeRes, balanceRes, profileRes, metricsRes] = await Promise.all([
      fetchWithTimeout(`https://financialmodelingprep.com/stable/income-statement?symbol=${symbol}&apikey=${key}`),
      fetchWithTimeout(`https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${symbol}&apikey=${key}`),
      fetchWithTimeout(`https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${key}`),
      fetchWithTimeout(`https://financialmodelingprep.com/api/v3/key-metrics?symbol=${symbol}&apikey=${key}`)
    ]);

    const income = await incomeRes.json();
    const balance = await balanceRes.json();
    const profile = await profileRes.json();
    const metrics = await metricsRes.json();

    // trying multiple sources because fmp doesnt always return shares in same field
    let shares = 
      profile[0]?.sharesOutstanding || 
      metrics[0]?.sharesOutstanding ||
      income[0]?.weightedAverageShsOut ||
      income[0]?.weightedAverageShsOutDil ||
      (profile[0]?.mktCap && profile[0]?.price ? profile[0].mktCap / profile[0].price : null);

    if (!shares || shares < 1e6) {
      return NextResponse.json({ 
        error: 'Invalid share count from API',
        symbol 
      }, { status: 500 });
    }

    const data = {
      symbol,
      name: profile[0]?.companyName || symbol,
      revenue: income[0]?.revenue || 0,
      shares: shares,
      cash: balance[0]?.cashAndCashEquivalents || 0,
      debt: balance[0]?.totalDebt || 0,
    };

    cache.set(symbol, { data, timestamp: Date.now() });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ 
      error: 'API request failed',
      symbol 
    }, { status: 500 });
  }
}
