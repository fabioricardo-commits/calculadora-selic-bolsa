import { CalculationResult, MonthlyRecord, SimulationInput, TimeWindow } from '../types';
import { POPULAR_STOCKS } from '../data/stocks';

// Convert TimeWindow to month count
export function getMonthsForWindow(window: TimeWindow): number {
  switch (window) {
    case '1y': return 12;
    case '2y': return 24;
    case '5y': return 60;
    case '10y': return 120;
    default: return 12;
  }
}

// Calculate IR Tax Rate for Renda Fixa (Selic) based on holding period (months)
export function getSelicIrTaxRate(holdingMonths: number): number {
  if (holdingMonths <= 6) return 0.225; // 22.5%
  if (holdingMonths <= 12) return 0.20;  // 20.0%
  if (holdingMonths <= 24) return 0.175; // 17.5%
  return 0.15; // 15.0%
}

// Calculate Stock IR Tax Rate (15% on capital gains)
export function getStockIrTaxRate(): number {
  return 0.15; // 15.0%
}

export function runSimulation(
  input: SimulationInput,
  selicMonthlyRates: number[],
  stockReturnFactors: number[]
): CalculationResult {
  const monthsCount = getMonthsForWindow(input.timeWindow);
  const { initialAmount, monthlyContribution, applyTaxes, reinvestDividends } = input;

  // Find stock info
  const stockInfo = POPULAR_STOCKS.find(s => s.ticker === input.ticker) || {
    ticker: input.ticker.toUpperCase(),
    name: input.ticker.toUpperCase(),
    sector: 'Ação B3',
    color: '#a855f7'
  };

  const monthlyRecords: MonthlyRecord[] = [];
  
  // Date setup
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - monthsCount);

  let totalInvested = initialAmount;
  
  // Selic tracking variables
  let selicGrossBalance = initialAmount;
  
  // Stock tracking variables
  let currentStockPrice = 100.0; // Normalized starting share price
  let totalShares = initialAmount / currentStockPrice;
  
  // Dividend yield bonus factor if dividend reinvestment is enabled (approx 0.4% monthly extra return)
  const dividendBonus = reinvestDividends ? 0.004 : 0.0;

  for (let m = 0; m < monthsCount; m++) {
    // Current date string (e.g. "Jan/2024")
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + m + 1, 1);
    const dateStr = currentDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');

    // Add monthly contribution if m > 0 (or at end of month)
    const currentContribution = m === 0 ? 0 : monthlyContribution;
    if (m > 0) {
      totalInvested += monthlyContribution;
    }

    // 1. Update Selic
    const selicRate = selicMonthlyRates[m] ?? 0.85; // percentage e.g. 0.85%
    selicGrossBalance = (selicGrossBalance + currentContribution) * (1 + selicRate / 100);
    const selicGrossProfit = Math.max(0, selicGrossBalance - totalInvested);

    // Estimate Selic IR tax for cumulative balance
    const selicTaxRate = applyTaxes ? getSelicIrTaxRate(monthsCount - m) : 0;
    const selicNetProfit = selicGrossProfit * (1 - selicTaxRate);
    const selicNetBalance = totalInvested + selicNetProfit;

    // 2. Update Stock
    const rawStockReturn = stockReturnFactors[m] ?? 0.01;
    const stockReturn = rawStockReturn + dividendBonus;
    currentStockPrice = Math.max(1, currentStockPrice * (1 + stockReturn));
    
    // Buy shares with monthly contribution
    if (m > 0 && monthlyContribution > 0) {
      const newShares = monthlyContribution / currentStockPrice;
      totalShares += newShares;
    }

    const stockGrossBalance = totalShares * currentStockPrice;
    const stockGrossProfit = Math.max(0, stockGrossBalance - totalInvested);
    
    const stockTaxRate = applyTaxes ? getStockIrTaxRate() : 0;
    const stockNetProfit = stockGrossProfit * (1 - stockTaxRate);
    const stockNetBalance = totalInvested + stockNetProfit;

    monthlyRecords.push({
      monthIndex: m + 1,
      dateStr: dateStr.toUpperCase(),
      totalInvested: Math.round(totalInvested * 100) / 100,
      monthlyDeposit: currentContribution,
      selicRateMonth: selicRate,
      selicGrossBalance: Math.round(selicGrossBalance * 100) / 100,
      selicGrossProfit: Math.round(selicGrossProfit * 100) / 100,
      selicNetBalance: Math.round(selicNetBalance * 100) / 100,
      stockPrice: Math.round(currentStockPrice * 100) / 100,
      stockMonthlyReturn: Math.round(stockReturn * 10000) / 100,
      stockGrossBalance: Math.round(stockGrossBalance * 100) / 100,
      stockGrossProfit: Math.round(stockGrossProfit * 100) / 100,
      stockNetBalance: Math.round(stockNetBalance * 100) / 100,
      accumulatedShares: Math.round(totalShares * 100) / 100,
    });
  }

  // Final summary calculation
  const lastRecord = monthlyRecords[monthlyRecords.length - 1];

  // Selic Final IR
  const finalSelicTaxRate = applyTaxes ? getSelicIrTaxRate(monthsCount) : 0;
  const selicGrossProfit = Math.max(0, lastRecord.selicGrossBalance - totalInvested);
  const selicIrTax = selicGrossProfit * finalSelicTaxRate;
  const selicNetBalance = lastRecord.selicGrossBalance - selicIrTax;
  const selicNetProfit = selicNetBalance - totalInvested;
  const selicNetReturnPercent = totalInvested > 0 ? (selicNetProfit / totalInvested) * 100 : 0;
  
  const years = monthsCount / 12;
  const selicCagrPercent = totalInvested > 0 ? (Math.pow(selicNetBalance / totalInvested, 1 / years) - 1) * 100 : 0;

  // Stock Final IR
  const finalStockTaxRate = applyTaxes ? getStockIrTaxRate() : 0;
  const stockGrossProfit = Math.max(0, lastRecord.stockGrossBalance - totalInvested);
  const stockIrTax = stockGrossProfit * finalStockTaxRate;
  const stockNetBalance = lastRecord.stockGrossBalance - stockIrTax;
  const stockNetProfit = stockNetBalance - totalInvested;
  const stockNetReturnPercent = totalInvested > 0 ? (stockNetProfit / totalInvested) * 100 : 0;
  const stockCagrPercent = totalInvested > 0 ? (Math.pow(stockNetBalance / totalInvested, 1 / years) - 1) * 100 : 0;

  // Winner calculation
  let winner: 'selic' | 'stock' | 'tie' = 'tie';
  const diff = Math.abs(stockNetBalance - selicNetBalance);
  const diffPercent = selicNetBalance > 0 ? (diff / selicNetBalance) * 100 : 0;

  if (stockNetBalance > selicNetBalance + 1) {
    winner = 'stock';
  } else if (selicNetBalance > stockNetBalance + 1) {
    winner = 'selic';
  }

  return {
    timeWindow: input.timeWindow,
    monthsCount,
    totalInvested: Math.round(totalInvested * 100) / 100,
    startDate: startDate.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }),
    endDate: now.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }),
    
    selicGrossBalance: Math.round(lastRecord.selicGrossBalance * 100) / 100,
    selicGrossProfit: Math.round(selicGrossProfit * 100) / 100,
    selicIrTax: Math.round(selicIrTax * 100) / 100,
    selicNetBalance: Math.round(selicNetBalance * 100) / 100,
    selicNetProfit: Math.round(selicNetProfit * 100) / 100,
    selicNetReturnPercent: Math.round(selicNetReturnPercent * 100) / 100,
    selicCagrPercent: Math.round(selicCagrPercent * 100) / 100,

    stockTicker: stockInfo.ticker,
    stockName: stockInfo.name,
    stockGrossBalance: Math.round(lastRecord.stockGrossBalance * 100) / 100,
    stockGrossProfit: Math.round(stockGrossProfit * 100) / 100,
    stockIrTax: Math.round(stockIrTax * 100) / 100,
    stockNetBalance: Math.round(stockNetBalance * 100) / 100,
    stockNetProfit: Math.round(stockNetProfit * 100) / 100,
    stockNetReturnPercent: Math.round(stockNetReturnPercent * 100) / 100,
    stockCagrPercent: Math.round(stockCagrPercent * 100) / 100,

    winner,
    differenceAmount: Math.round(diff * 100) / 100,
    differencePercent: Math.round(diffPercent * 100) / 100,
    monthlyData: monthlyRecords,
  };
}
