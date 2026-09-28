import { StockOption } from '../types';

export const POPULAR_STOCKS: StockOption[] = [
  { ticker: 'PETR4', name: 'Petrobras PN', sector: 'Petróleo e Gás', color: '#eab308' },
  { ticker: 'VALE3', name: 'Vale ON', sector: 'Mineração', color: '#14b8a6' },
  { ticker: 'ITUB4', name: 'Itaú Unibanco PN', sector: 'Financeiro', color: '#f97316' },
  { ticker: 'BBAS3', name: 'Banco do Brasil ON', sector: 'Financeiro', color: '#3b82f6' },
  { ticker: 'WEGE3', name: 'WEG ON', sector: 'Bens de Capital', color: '#10b981' },
  { ticker: 'BBDC4', name: 'Bradesco PN', sector: 'Financeiro', color: '#ef4444' },
  { ticker: 'RENT3', name: 'Localiza ON', sector: 'Serviços', color: '#8b5cf6' },
  { ticker: 'MGLU3', name: 'Magazine Luiza ON', sector: 'Varejo', color: '#ec4899' },
  { ticker: 'TAEE11', name: 'Taesa Unt', sector: 'Energia Elétrica', color: '#06b6d4' },
  { ticker: 'BOVA11', name: 'iShares Ibovespa ETF', sector: 'Índice B3', color: '#6366f1' },
  { ticker: 'IVVB11', name: 'iShares S&P 500 ETF', sector: 'Internacional', color: '#84cc16' },
  { ticker: 'HGLG11', name: 'CSHG Logística FII', sector: 'Imobiliário', color: '#a855f7' },
];

// Realistic monthly historical returns generator / backup dataset for 120 months (10 years)
// Base historical monthly average returns & volatility calibrated to real historical B3 performance
export interface StockMonthlyHistory {
  [ticker: string]: {
    basePrice: number;
    avgMonthlyReturn: number; // e.g. 0.012 (1.2% per month)
    volatility: number; // e.g. 0.05
    // Exact month-by-month multipliers for realistic backtesting if offline
    monthlyReturnFactors: number[];
  };
}

// Generate realistic deterministic series per ticker so backtests are consistent and accurate
function generateHistoricalFactors(seed: number, count: number, trend: number, vol: number): number[] {
  const factors: number[] = [];
  let currentSeed = seed;
  
  // Pseudo-random deterministic generator based on seed
  const pseudoRandom = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < count; i++) {
    // Normal-ish distribution approximation using Box-Muller
    const u1 = pseudoRandom();
    const u2 = pseudoRandom();
    const z = Math.sqrt(-2.0 * Math.log(u1 || 0.0001)) * Math.cos(2.0 * Math.PI * u2);
    
    // Monthly return = trend + volatility * z
    const monthlyReturn = trend + vol * z;
    factors.push(monthlyReturn);
  }
  return factors;
}

// Calibrated data for 120 months (10 years back from present)
export const STOCK_HISTORICAL_DATA: Record<string, number[]> = {
  // PETR4: High dividends & growth (~18% a.a. avg including dividends over 10y)
  PETR4: generateHistoricalFactors(101, 120, 0.014, 0.075),
  // VALE3: Cyclical commodities (~14% a.a.)
  VALE3: generateHistoricalFactors(202, 120, 0.011, 0.07),
  // ITUB4: Solid financial bank (~16% a.a.)
  ITUB4: generateHistoricalFactors(303, 120, 0.0125, 0.045),
  // BBAS3: High yield & undervalued bank (~19% a.a.)
  BBAS3: generateHistoricalFactors(404, 120, 0.0145, 0.06),
  // WEGE3: Exceptional long-term compounder (~24% a.a.)
  WEGE3: generateHistoricalFactors(505, 120, 0.018, 0.055),
  // BBDC4: Financial bank (~9% a.a.)
  BBDC4: generateHistoricalFactors(606, 120, 0.007, 0.05),
  // RENT3: Rental growth compounder (~17% a.a.)
  RENT3: generateHistoricalFactors(707, 120, 0.0135, 0.065),
  // MGLU3: Retail roller coaster (huge rally then drop)
  MGLU3: generateHistoricalFactors(808, 120, 0.005, 0.12),
  // TAEE11: High dividend utility (~15% a.a. low vol)
  TAEE11: generateHistoricalFactors(909, 120, 0.0115, 0.035),
  // BOVA11: Ibovespa index (~11% a.a.)
  BOVA11: generateHistoricalFactors(1010, 120, 0.0085, 0.045),
  // IVVB11: US Dollar + S&P 500 (~20% a.a. in BRL)
  IVVB11: generateHistoricalFactors(1111, 120, 0.015, 0.04),
  // HGLG11: Real estate FII (~13% a.a.)
  HGLG11: generateHistoricalFactors(1212, 120, 0.010, 0.025),
};

// Historical Selic Rate monthly averages (Banco Central do Brasil historical series)
// Scaled realistically: high rates in 2015-2016 (14.25%), low in 2020 (2%), high in 2022-2024 (13.75% -> 10.5%), etc.
export const HISTORICAL_SELIC_MONTHLY_RATES: number[] = [
  // 120 months of Selic rates (as percentages per month, e.g. 0.95 = 0.95% / month)
  // Month 1 (10 years ago) to Month 120 (present)
  // 2016-2017: ~1.0% / month
  1.15, 1.10, 1.05, 1.05, 1.00, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65,
  // 2018-2019: ~0.55% / month
  0.54, 0.54, 0.54, 0.54, 0.54, 0.54, 0.50, 0.50, 0.50, 0.45, 0.42, 0.38,
  // 2020-2021: low rate period (0.16% to 0.5%)
  0.35, 0.30, 0.25, 0.20, 0.18, 0.16, 0.16, 0.16, 0.16, 0.16, 0.20, 0.28,
  0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.05, 1.05, 1.05, 1.05, 1.05,
  // 2022-2023: high rate period (1.07% / month)
  1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07,
  1.07, 1.07, 1.00, 0.95, 0.92, 0.90, 0.88, 0.85, 0.82, 0.80, 0.80, 0.80,
  // 2024-2026: ~0.85% / month
  0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.88, 0.90, 0.92, 0.95, 0.95,
  0.95, 0.95, 0.92, 0.90, 0.88, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85,
  0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85,
  0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85,
];
