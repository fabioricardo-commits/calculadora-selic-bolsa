export type TimeWindow = '1y' | '2y' | '5y' | '10y';

export interface StockOption {
  ticker: string;
  name: string;
  sector: string;
  color: string;
  volatilityLevel: 'Baixa' | 'Média' | 'Alta' | 'Extrema';
}

export interface SimulationInput {
  selectedTickers: string[]; // Multi-stock selection
  timeWindow: TimeWindow;
  initialAmount: number;
  monthlyContribution: number;
  reinvestDividends: boolean;
  applyTaxes: boolean;
}

export interface MonthlyRecord {
  monthIndex: number;
  dateStr: string;
  totalInvested: number;
  monthlyDeposit: number;
  
  selicRateMonth: number;
  selicGrossBalance: number;
  selicNetBalance: number;

  // Individual stock balances
  stockBalances: Record<string, number>; // ticker -> net balance
  portfolioNetBalance: number; // Combined equal-weighted portfolio balance
}

export interface StockResultMetric {
  ticker: string;
  name: string;
  color: string;
  grossBalance: number;
  grossProfit: number;
  irTax: number;
  netBalance: number;
  netProfit: number;
  netReturnPercent: number;
  cagrPercent: number;
  multiplier: number; // e.g. 1.85x
  maxDrawdownPercent: number;
}

export interface CalculationResult {
  timeWindow: TimeWindow;
  monthsCount: number;
  totalInvested: number;
  startDate: string;
  endDate: string;
  
  // Selic metrics (The House / Banco Central)
  selicGrossBalance: number;
  selicGrossProfit: number;
  selicIrTax: number;
  selicNetBalance: number;
  selicNetProfit: number;
  selicNetReturnPercent: number;
  selicCagrPercent: number;
  selicMultiplier: number;

  // Selected stocks results
  stockResults: StockResultMetric[];

  // Aggregated Portfolio Metrics
  portfolioNetBalance: number;
  portfolioNetProfit: number;
  portfolioNetReturnPercent: number;
  portfolioCagrPercent: number;
  portfolioMultiplier: number;
  
  // Comparative
  winner: 'selic' | 'portfolio' | string; // ticker or selic or portfolio
  winnerName: string;
  bestMultiplier: number;
  differenceAmount: number;
  differencePercent: number;

  monthlyData: MonthlyRecord[];
}
