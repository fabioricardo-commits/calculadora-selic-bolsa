import { StockOption } from '../types';

export const POPULAR_STOCKS: StockOption[] = [
  { ticker: 'PETR4', name: 'Petrobras PN', sector: 'Petróleo & Gás', color: '#facc15', volatilityLevel: 'Alta' },
  { ticker: 'VALE3', name: 'Vale ON', sector: 'Mineração', color: '#14b8a6', volatilityLevel: 'Média' },
  { ticker: 'ITUB4', name: 'Itaú Unibanco PN', sector: 'Financeiro', color: '#f97316', volatilityLevel: 'Baixa' },
  { ticker: 'BBAS3', name: 'Banco do Brasil ON', sector: 'Financeiro', color: '#3b82f6', volatilityLevel: 'Média' },
  { ticker: 'WEGE3', name: 'WEG ON', sector: 'Bens de Capital', color: '#10b981', volatilityLevel: 'Média' },
  { ticker: 'BBDC4', name: 'Bradesco PN', sector: 'Financeiro', color: '#ef4444', volatilityLevel: 'Média' },
  { ticker: 'RENT3', name: 'Localiza ON', sector: 'Serviços', color: '#a855f7', volatilityLevel: 'Alta' },
  { ticker: 'MGLU3', name: 'Magazine Luiza ON', sector: 'Varejo', color: '#ec4899', volatilityLevel: 'Extrema' },
  { ticker: 'TAEE11', name: 'Taesa Unt', sector: 'Energia Elétrica', color: '#06b6d4', volatilityLevel: 'Baixa' },
  { ticker: 'BOVA11', name: 'iShares Ibovespa ETF', sector: 'Índice B3', color: '#6366f1', volatilityLevel: 'Média' },
  { ticker: 'IVVB11', name: 'iShares S&P 500 ETF', sector: 'Internacional', color: '#84cc16', volatilityLevel: 'Média' },
  { ticker: 'HGLG11', name: 'CSHG Logística FII', sector: 'Imobiliário', color: '#d946ef', volatilityLevel: 'Baixa' },
];

function generateHistoricalFactors(seed: number, count: number, trend: number, vol: number): number[] {
  const factors: number[] = [];
  let currentSeed = seed;
  
  const pseudoRandom = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < count; i++) {
    const u1 = pseudoRandom();
    const u2 = pseudoRandom();
    const z = Math.sqrt(-2.0 * Math.log(u1 || 0.0001)) * Math.cos(2.0 * Math.PI * u2);
    const monthlyReturn = trend + vol * z;
    factors.push(monthlyReturn);
  }
  return factors;
}

export const STOCK_HISTORICAL_DATA: Record<string, number[]> = {
  PETR4: generateHistoricalFactors(101, 120, 0.014, 0.075),
  VALE3: generateHistoricalFactors(202, 120, 0.011, 0.07),
  ITUB4: generateHistoricalFactors(303, 120, 0.0125, 0.045),
  BBAS3: generateHistoricalFactors(404, 120, 0.0145, 0.06),
  WEGE3: generateHistoricalFactors(505, 120, 0.018, 0.055),
  BBDC4: generateHistoricalFactors(606, 120, 0.007, 0.05),
  RENT3: generateHistoricalFactors(707, 120, 0.0135, 0.065),
  MGLU3: generateHistoricalFactors(808, 120, 0.005, 0.12),
  TAEE11: generateHistoricalFactors(909, 120, 0.0115, 0.035),
  BOVA11: generateHistoricalFactors(1010, 120, 0.0085, 0.045),
  IVVB11: generateHistoricalFactors(1111, 120, 0.015, 0.04),
  HGLG11: generateHistoricalFactors(1212, 120, 0.010, 0.025),
};

export const HISTORICAL_SELIC_MONTHLY_RATES: number[] = [
  1.15, 1.10, 1.05, 1.05, 1.00, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65,
  0.54, 0.54, 0.54, 0.54, 0.54, 0.54, 0.50, 0.50, 0.50, 0.45, 0.42, 0.38,
  0.35, 0.30, 0.25, 0.20, 0.18, 0.16, 0.16, 0.16, 0.16, 0.16, 0.20, 0.28,
  0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.05, 1.05, 1.05, 1.05, 1.05,
  1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07, 1.07,
  1.07, 1.07, 1.00, 0.95, 0.92, 0.90, 0.88, 0.85, 0.82, 0.80, 0.80, 0.80,
  0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.88, 0.90, 0.92, 0.95, 0.95,
  0.95, 0.95, 0.92, 0.90, 0.88, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85,
  0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85,
  0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85,
];
