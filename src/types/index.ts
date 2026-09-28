export type TimeWindow = '1y' | '2y' | '5y' | '10y';

export interface StockOption {
  ticker: string;
  name: string;
  sector: string;
  color: string;
  annualYieldEstimate?: number; // fallback estimate
}

export interface SimulationInput {
  ticker: string;
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
  
  selicRateMonth: number; // monthly % e.g. 0.85%
  selicGrossBalance: number;
  selicGrossProfit: number;
  selicNetBalance: number;
  
  stockPrice: number;
  stockMonthlyReturn: number; // % return this month
  stockGrossBalance: number;
  stockGrossProfit: number;
  stockNetBalance: number;
  accumulatedShares: number;
}

export interface CalculationResult {
  timeWindow: TimeWindow;
  monthsCount: number;
  totalInvested: number;
  startDate: string;
  endDate: string;
  
  // Selic metrics
  selicGrossBalance: number;
  selicGrossProfit: number;
  selicIrTax: number;
  selicNetBalance: number;
  selicNetProfit: number;
  selicNetReturnPercent: number;
  selicCagrPercent: number;
  
  // Stock metrics
  stockTicker: string;
  stockName: string;
  stockGrossBalance: number;
  stockGrossProfit: number;
  stockIrTax: number;
  stockNetBalance: number;
  stockNetProfit: number;
  stockNetReturnPercent: number;
  stockCagrPercent: number;
  
  // Comparative
  winner: 'selic' | 'stock' | 'tie';
  differenceAmount: number;
  differencePercent: number;

  monthlyData: MonthlyRecord[];
}
