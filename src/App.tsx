import React, { useState, useEffect, useMemo } from 'react';
import { SimulationInput, CalculationResult } from './types';
import { fetchSelicMonthlyRates, fetchMultiStockFactors } from './services/apiService';
import { runSimulation, getMonthsForWindow } from './services/calculator';
import { Navbar } from './components/Navbar';
import { InputPanel } from './components/InputPanel';
import { SummaryCards } from './components/SummaryCards';
import { ComparisonChart } from './components/ComparisonChart';
import { DetailedMetrics } from './components/DetailedMetrics';
import { AcademicDisclaimer } from './components/AcademicDisclaimer';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';

export function App() {
  const [input, setInput] = useState<SimulationInput>({
    selectedTickers: ['PETR4', 'VALE3', 'WEGE3'],
    timeWindow: '5y',
    initialAmount: 10000,
    monthlyContribution: 500,
    reinvestDividends: true,
    applyTaxes: true,
  });

  const [selicRates, setSelicRates] = useState<number[]>([]);
  const [multiStockFactors, setMultiStockFactors] = useState<Record<string, number[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      const monthsNeeded = getMonthsForWindow(input.timeWindow);

      const [selicData, stockFactorsMap] = await Promise.all([
        fetchSelicMonthlyRates(monthsNeeded),
        fetchMultiStockFactors(input.selectedTickers, monthsNeeded),
      ]);

      if (isMounted) {
        setSelicRates(selicData);
        setMultiStockFactors(stockFactorsMap);
        setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [input.timeWindow, JSON.stringify(input.selectedTickers)]);

  const result: CalculationResult = useMemo(() => {
    return runSimulation(input, selicRates, multiStockFactors);
  }, [input, selicRates, multiStockFactors]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Prominent Academic & Legal Disclaimer Banner */}
        <AcademicDisclaimer />

        {/* Multi-Stock & Game Simulation Control Box */}
        <InputPanel input={input} onChange={setInput} isLoading={isLoading} />

        {/* Dynamic Loading State or Dashboard */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <span className="text-sm font-semibold text-slate-300">
              Carregando cotações históricas da B3 e Banco Central do Brasil...
            </span>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Top Casino/Game HUD Stat Cards */}
            <SummaryCards result={result} />

            {/* Portfolio vs Selic Evolution Chart */}
            <ComparisonChart result={result} />

            {/* Detailed Multi-Stock Breakdown & Table */}
            <DetailedMetrics result={result} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
