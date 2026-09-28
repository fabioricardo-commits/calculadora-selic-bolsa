import { CalculationResult, MonthlyRecord, SimulationInput, StockResultMetric, TimeWindow } from '../types';
import { POPULAR_STOCKS } from '../data/stocks';

export function getMonthsForWindow(window: TimeWindow): number {
  switch (window) {
    case '1y': return 12;
    case '2y': return 24;
    case '5y': return 60;
    case '10y': return 120;
    default: return 12;
  }
}

export function getSelicIrTaxRate(holdingMonths: number): number {
  if (holdingMonths <= 6) return 0.225; // 22.5%
  if (holdingMonths <= 12) return 0.20;  // 20.0%
  if (holdingMonths <= 24) return 0.175; // 17.5%
  return 0.15; // 15.0%
}

export function getStockIrTaxRate(): number {
  return 0.15; // 15.0%
}

export function runSimulation(
  input: SimulationInput,
  selicMonthlyRates: number[],
  multiStockFactors: Record<string, number[]>
): CalculationResult {
  const monthsCount = getMonthsForWindow(input.timeWindow);
  const { initialAmount, monthlyContribution, applyTaxes, reinvestDividends } = input;
  const selectedTickers = input.selectedTickers.length > 0 ? input.selectedTickers : ['PETR4'];

  const monthlyRecords: MonthlyRecord[] = [];
  
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - monthsCount);

  let totalInvested = initialAmount;
  let selicGrossBalance = initialAmount;

  // Individual stock state tracking
  // Per stock: share price, accumulated shares, peak balance (for drawdown calculation)
  const initialPerStockAmount = initialAmount / selectedTickers.length;
  const monthlyPerStockContribution = monthlyContribution / selectedTickers.length;

  const stockStates: Record<string, {
    ticker: string;
    sharePrice: number;
    totalShares: number;
    peakBalance: number;
    maxDrawdown: number;
  }> = {};

  selectedTickers.forEach(ticker => {
    stockStates[ticker] = {
      ticker,
      sharePrice: 100.0,
      totalShares: initialPerStockAmount / 100.0,
      peakBalance: initialPerStockAmount,
      maxDrawdown: 0.0,
    };
  });

  const dividendBonus = reinvestDividends ? 0.004 : 0.0;

  for (let m = 0; m < monthsCount; m++) {
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + m + 1, 1);
    const dateStr = currentDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');

    const currentContribution = m === 0 ? 0 : monthlyContribution;
    if (m > 0) {
      totalInvested += monthlyContribution;
    }

    // 1. Selic
    const selicRate = selicMonthlyRates[m] ?? 0.85;
    selicGrossBalance = (selicGrossBalance + currentContribution) * (1 + selicRate / 100);

    const selicTaxRate = applyTaxes ? getSelicIrTaxRate(monthsCount - m) : 0;
    const selicGrossProfit = Math.max(0, selicGrossBalance - totalInvested);
    const selicNetProfit = selicGrossProfit * (1 - selicTaxRate);
    const selicNetBalance = totalInvested + selicNetProfit;

    // 2. Individual Stocks
    const monthlyStockNetBalances: Record<string, number> = {};
    let portfolioGrossBalanceSum = 0;

    selectedTickers.forEach(ticker => {
      const state = stockStates[ticker];
      const factors = multiStockFactors[ticker] || [];
      const rawReturn = factors[m] ?? 0.01;
      const stockReturn = rawReturn + dividendBonus;

      state.sharePrice = Math.max(1, state.sharePrice * (1 + stockReturn));

      if (m > 0 && monthlyPerStockContribution > 0) {
        state.totalShares += monthlyPerStockContribution / state.sharePrice;
      }

      const grossBalance = state.totalShares * state.sharePrice;
      portfolioGrossBalanceSum += grossBalance;

      // Drawdown check
      if (grossBalance > state.peakBalance) {
        state.peakBalance = grossBalance;
      } else {
        const drawdown = (state.peakBalance - grossBalance) / state.peakBalance;
        if (drawdown > state.maxDrawdown) {
          state.maxDrawdown = drawdown;
        }
      }

      const stockInvested = totalInvested / selectedTickers.length;
      const stockGrossProfit = Math.max(0, grossBalance - stockInvested);
      const stockTaxRate = applyTaxes ? getStockIrTaxRate() : 0;
      const stockNetProfit = stockGrossProfit * (1 - stockTaxRate);
      const stockNetBalance = stockInvested + stockNetProfit;

      monthlyStockNetBalances[ticker] = Math.round(stockNetBalance * 100) / 100;
    });

    const portfolioGrossProfit = Math.max(0, portfolioGrossBalanceSum - totalInvested);
    const portfolioTaxRate = applyTaxes ? getStockIrTaxRate() : 0;
    const portfolioNetProfit = portfolioGrossProfit * (1 - portfolioTaxRate);
    const portfolioNetBalance = totalInvested + portfolioNetProfit;

    monthlyRecords.push({
      monthIndex: m + 1,
      dateStr: dateStr.toUpperCase(),
      totalInvested: Math.round(totalInvested * 100) / 100,
      monthlyDeposit: currentContribution,
      selicRateMonth: selicRate,
      selicGrossBalance: Math.round(selicGrossBalance * 100) / 100,
      selicNetBalance: Math.round(selicNetBalance * 100) / 100,
      stockBalances: monthlyStockNetBalances,
      portfolioNetBalance: Math.round(portfolioNetBalance * 100) / 100,
    });
  }

  const lastRecord = monthlyRecords[monthlyRecords.length - 1];
  const years = monthsCount / 12;

  // Final Selic
  const finalSelicTaxRate = applyTaxes ? getSelicIrTaxRate(monthsCount) : 0;
  const selicGrossProfit = Math.max(0, lastRecord.selicGrossBalance - totalInvested);
  const selicIrTax = selicGrossProfit * finalSelicTaxRate;
  const selicNetBalance = lastRecord.selicGrossBalance - selicIrTax;
  const selicNetProfit = selicNetBalance - totalInvested;
  const selicNetReturnPercent = totalInvested > 0 ? (selicNetProfit / totalInvested) * 100 : 0;
  const selicCagrPercent = totalInvested > 0 ? (Math.pow(selicNetBalance / totalInvested, 1 / years) - 1) * 100 : 0;
  const selicMultiplier = totalInvested > 0 ? selicNetBalance / totalInvested : 1;

  // Final Individual Stocks
  const stockResults: StockResultMetric[] = selectedTickers.map(ticker => {
    const stockInfo = POPULAR_STOCKS.find(s => s.ticker === ticker) || {
      ticker,
      name: ticker,
      color: '#bc13fe',
      sector: 'Ação B3',
      volatilityLevel: 'Média' as const
    };
    const state = stockStates[ticker];
    const stockInvested = totalInvested / selectedTickers.length;
    const grossBalance = state.totalShares * state.sharePrice;
    const grossProfit = Math.max(0, grossBalance - stockInvested);
    const taxRate = applyTaxes ? getStockIrTaxRate() : 0;
    const irTax = grossProfit * taxRate;
    const netBalance = grossBalance - irTax;
    const netProfit = netBalance - stockInvested;
    const netReturnPercent = stockInvested > 0 ? (netProfit / stockInvested) * 100 : 0;
    const cagrPercent = stockInvested > 0 ? (Math.pow(netBalance / stockInvested, 1 / years) - 1) * 100 : 0;
    const multiplier = stockInvested > 0 ? netBalance / stockInvested : 1;

    return {
      ticker,
      name: stockInfo.name,
      color: stockInfo.color,
      grossBalance: Math.round(grossBalance * 100) / 100,
      grossProfit: Math.round(grossProfit * 100) / 100,
      irTax: Math.round(irTax * 100) / 100,
      netBalance: Math.round(netBalance * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      netReturnPercent: Math.round(netReturnPercent * 100) / 100,
      cagrPercent: Math.round(cagrPercent * 100) / 100,
      multiplier: Math.round(multiplier * 100) / 100,
      maxDrawdownPercent: Math.round(state.maxDrawdown * 10000) / 100,
    };
  });

  // Aggregated Portfolio Metrics
  const portfolioGrossBalanceSum = stockResults.reduce((acc, s) => acc + s.grossBalance, 0);
  const portfolioGrossProfit = Math.max(0, portfolioGrossBalanceSum - totalInvested);
  const portfolioIrTax = portfolioGrossProfit * (applyTaxes ? getStockIrTaxRate() : 0);
  const portfolioNetBalance = portfolioGrossBalanceSum - portfolioIrTax;
  const portfolioNetProfit = portfolioNetBalance - totalInvested;
  const portfolioNetReturnPercent = totalInvested > 0 ? (portfolioNetProfit / totalInvested) * 100 : 0;
  const portfolioCagrPercent = totalInvested > 0 ? (Math.pow(portfolioNetBalance / totalInvested, 1 / years) - 1) * 100 : 0;
  const portfolioMultiplier = totalInvested > 0 ? portfolioNetBalance / totalInvested : 1;

  // Determine Winner
  let winner = 'selic';
  let winnerName = 'Tesouro Selic';
  let bestNetBalance = selicNetBalance;

  if (portfolioNetBalance > bestNetBalance) {
    winner = 'portfolio';
    winnerName = selectedTickers.length === 1 ? selectedTickers[0] : 'Carteira de Ações';
    bestNetBalance = portfolioNetBalance;
  }

  // Check if an individual stock beat the portfolio/selic
  stockResults.forEach(s => {
    if (s.netBalance > bestNetBalance) {
      winner = s.ticker;
      winnerName = `${s.ticker} (${s.name})`;
      bestNetBalance = s.netBalance;
    }
  });

  const bestMultiplier = totalInvested > 0 ? bestNetBalance / totalInvested : 1;
  const diff = Math.abs(portfolioNetBalance - selicNetBalance);
  const diffPercent = selicNetBalance > 0 ? (diff / selicNetBalance) * 100 : 0;

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
    selicMultiplier: Math.round(selicMultiplier * 100) / 100,

    stockResults,

    portfolioNetBalance: Math.round(portfolioNetBalance * 100) / 100,
    portfolioNetProfit: Math.round(portfolioNetProfit * 100) / 100,
    portfolioNetReturnPercent: Math.round(portfolioNetReturnPercent * 100) / 100,
    portfolioCagrPercent: Math.round(portfolioCagrPercent * 100) / 100,
    portfolioMultiplier: Math.round(portfolioMultiplier * 100) / 100,

    winner,
    winnerName,
    bestMultiplier: Math.round(bestMultiplier * 100) / 100,
    differenceAmount: Math.round(diff * 100) / 100,
    differencePercent: Math.round(diffPercent * 100) / 100,
    monthlyData: monthlyRecords,
  };
}
