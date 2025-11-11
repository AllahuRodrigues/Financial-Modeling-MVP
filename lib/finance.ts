export interface Assumptions {
  revenueGrowth: number;
  ebitMargin: number;
  taxRate: number;
  daPercent: number;
  capexPercent: number;
  nwcPercent: number;
  wacc: number;
  terminalGrowth: number;
}

export interface YearForecast {
  year: number;
  revenue: number;
  ebit: number;
  fcf: number;
  pv: number;
}

export interface DCFResult {
  forecast: YearForecast[];
  terminalValue: number;
  pvTerminal: number;
  enterpriseValue: number;
  equityValue: number;
  pricePerShare: number;
}

export function runDCF(
  baseRevenue: number,
  shares: number,
  cash: number,
  debt: number,
  assumptions: Assumptions
): DCFResult {
  const forecast: YearForecast[] = [];
  
  for (let i = 1; i <= 5; i++) {
    const revenue = baseRevenue * Math.pow(1 + assumptions.revenueGrowth, i);
    const ebit = revenue * assumptions.ebitMargin;
    const da = revenue * assumptions.daPercent;
    const capex = revenue * assumptions.capexPercent;
    const nwcChange = revenue * assumptions.nwcPercent;
    
    const fcf = ebit * (1 - assumptions.taxRate) + da - capex - nwcChange;
    
    // discounting back to today because future cash is worth less
    const pv = fcf / Math.pow(1 + assumptions.wacc, i);
    
    forecast.push({ year: i, revenue, ebit, fcf, pv });
  }
  
  const lastFCF = forecast[4].fcf;
  
  // perpetuity formula because companies dont just die after 5 years
  const terminalValue = (lastFCF * (1 + assumptions.terminalGrowth)) / (assumptions.wacc - assumptions.terminalGrowth);
  const pvTerminal = terminalValue / Math.pow(1 + assumptions.wacc, 5);
  
  const enterpriseValue = forecast.reduce((sum, y) => sum + y.pv, 0) + pvTerminal;
  
  // adjusting for capital structure to get shareholder value
  const equityValue = enterpriseValue - debt + cash;
  const pricePerShare = equityValue / shares;
  
  return {
    forecast,
    terminalValue,
    pvTerminal,
    enterpriseValue,
    equityValue,
    pricePerShare,
  };
}

export const FORMULAS = {
  fcf: 'FCF = EBIT × (1 - Tax) + D&A - CapEx - ΔNWC',
  pv: 'PV = FCF / (1 + WACC)^n',
  terminal: 'TV = FCF₅ × (1 + g) / (WACC - g)',
  ev: 'EV = Σ PV(FCF) + PV(TV)',
  equity: 'Equity = EV - Debt + Cash',
  price: 'Price = Equity / Shares',
};
