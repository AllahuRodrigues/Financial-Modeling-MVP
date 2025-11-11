export interface CompanyData {
  symbol: string;
  name: string;
  revenue: number;
  shares: number;
  cash: number;
  debt: number;
  fromCache?: boolean;
}

const LOCAL_CACHE_DURATION = 10 * 60 * 1000;

export async function getCompanyData(symbol: string): Promise<CompanyData> {
  // checking cache first because we only get 250 api calls per day
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(`company_${symbol}`);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < LOCAL_CACHE_DURATION) {
          return { ...data, fromCache: true };
        }
      } catch (e) {
        // ignore invalid json
      }
    }
  }

  const response = await fetch(`/api/company/${symbol}`);
  const data = await response.json();
  
  // storing for 10 min to avoid rate limits on repeat visits
  if (typeof window !== 'undefined') {
    localStorage.setItem(`company_${symbol}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }
  
  return data;
}

export const FAANG_SYMBOLS = ['AAPL', 'AMZN', 'META', 'NFLX', 'GOOGL'];
