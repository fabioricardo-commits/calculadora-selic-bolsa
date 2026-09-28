import React, { useState, useEffect, useMemo } from 'react';
import { SimulationInput, CalculationResult } from './types';
import { fetchSelicMonthlyRates, fetchStockMonthlyFactors } from './services/apiService';
import { runSimulation, getMonthsForWindow } from './services/calculator';
import { Navbar } from './components/Navbar';
import { InputPanel } from './components/InputPanel';
import { SummaryCards } from './components/SummaryCards';
import { ComparisonChart } from './components/ComparisonChart';
import { DetailedMetrics } from './components/DetailedMetrics';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';

export function App() {
  // Default values required by user prompt:
  // - Stock selection (default PETR4)
  // - Time window (1y, 2y, 5y, 10y)
  // - Initial amount default R$ 10,000
  // - Monthly contribution default R$ 500
  const [input, setInput] = useState<SimulationInput>({
    ticker: 'PETR4',
    timeWindow: '5y',
    initialAmount: 10000,
    monthlyContribution: 500,
    reinvestDividends: true,
    applyTaxes: true,
  });

  const [selicRates, setSelicRates] = useState<number[]>([]);
  const [stockFactors, setStockFactors] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load historical data whenever window or ticker changes
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      const monthsNeeded = getMonthsForWindow(input.timeWindow);

      const [selicData, stockData] = await Promise.all([
        fetchSelicMonthlyRates(monthsNeeded),
        fetchStockMonthlyFactors(input.ticker, monthsNeeded),
      ]);

      if (isMounted) {
        setSelicRates(selicData);
        setStockFactors(stockData);
        setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [input.timeWindow, input.ticker]);

  // Calculate results dynamically based on inputs and fetched series
  const result: CalculationResult = useMemo(() => {
    return runSimulation(input, selicRates, stockFactors);
  }, [input, selicRates, stockFactors]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Input Control Box */}
        <InputPanel input={input} onChange={setInput} isLoading={isLoading} />

        {/* Dynamic Loading or Main Results */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            <span className="text-sm font-medium">Carregando dados históricos do Banco Central e da B3...</span>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Top KPI Cards */}
            <SummaryCards result={result} />

            {/* Monthly Evolution Interactive Chart */}
            <ComparisonChart result={result} />

            {/* Detailed Table & Breakdown */}
            <DetailedMetrics result={result} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
