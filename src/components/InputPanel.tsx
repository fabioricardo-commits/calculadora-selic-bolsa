import React, { useState } from 'react';
import { SimulationInput, TimeWindow } from '../types';
import { POPULAR_STOCKS } from '../data/stocks';
import { Calendar, Search, Coins, Percent, Dices, Check, Plus } from 'lucide-react';

interface InputPanelProps {
  input: SimulationInput;
  onChange: (newInput: SimulationInput) => void;
  isLoading?: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ input, onChange }) => {
  const [customTicker, setCustomTicker] = useState('');

  const toggleStockTicker = (ticker: string) => {
    const current = input.selectedTickers;
    let updated: string[];

    if (current.includes(ticker)) {
      if (current.length === 1) return; // Keep at least 1 stock selected
      updated = current.filter(t => t !== ticker);
    } else {
      updated = [...current, ticker];
    }
    onChange({ ...input, selectedTickers: updated });
  };

  const handleCustomTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTicker.trim()) {
      const formatted = customTicker.trim().toUpperCase();
      if (!input.selectedTickers.includes(formatted)) {
        onChange({ ...input, selectedTickers: [...input.selectedTickers, formatted] });
      }
      setCustomTicker('');
    }
  };

  const selectAllStocks = () => {
    onChange({ ...input, selectedTickers: POPULAR_STOCKS.map(s => s.ticker) });
  };

  const selectSingleStock = (ticker: string) => {
    onChange({ ...input, selectedTickers: [ticker] });
  };

  const timeWindowOptions: { id: TimeWindow; label: string; sub: string }[] = [
    { id: '1y', label: '1 Ano', sub: '12 meses' },
    { id: '2y', label: '2 Anos', sub: '24 meses' },
    { id: '5y', label: '5 Anos', sub: '60 meses' },
    { id: '10y', label: '10 Anos', sub: '120 meses' },
  ];

  return (
    <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 md:p-6 shadow-2xl shadow-purple-950/40 backdrop-blur-md space-y-6 relative overflow-hidden">
      {/* Glow effect header bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-purple-500 to-amber-500 animate-pulse"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
            <Dices className="w-5 h-5 text-emerald-400 animate-spin-slow" />
            <span>Arena de Apostas & Simulação (Multi-Ações)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Selecione uma ou mais ações para formar sua carteira contra a Selic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 px-3 rounded-xl border border-purple-500/40 text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              Descontar IR?
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...input, applyTaxes: !input.applyTaxes })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                input.applyTaxes ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  input.applyTaxes ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Multi-Stock Selector Section (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Escolha as Ações da Carteira</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {input.selectedTickers.length} Selecionada(s)
              </span>
            </label>
            <button
              type="button"
              onClick={selectAllStocks}
              className="text-[11px] text-emerald-400 hover:underline font-semibold"
            >
              + Selecionar Todas
            </button>
          </div>

          {/* Stock Chips */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
            {POPULAR_STOCKS.map((stock) => {
              const isSelected = input.selectedTickers.includes(stock.ticker);
              return (
                <button
                  key={stock.ticker}
                  type="button"
                  onClick={() => toggleStockTicker(stock.ticker)}
                  onDoubleClick={() => selectSingleStock(stock.ticker)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all relative ${
                    isSelected
                      ? 'bg-purple-950/90 border-purple-500 text-white shadow-lg shadow-purple-500/30 ring-1 ring-purple-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-1 right-1 p-0.5 rounded-full bg-purple-500 text-slate-950">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                  <span className="font-extrabold text-xs tracking-wider">{stock.ticker}</span>
                  <span className="text-[9px] text-slate-400 truncate max-w-full">{stock.name}</span>
                  <span className={`text-[8px] font-semibold mt-0.5 ${
                    stock.volatilityLevel === 'Extrema' ? 'text-rose-400' :
                    stock.volatilityLevel === 'Alta' ? 'text-amber-400' :
                    stock.volatilityLevel === 'Média' ? 'text-sky-400' : 'text-emerald-400'
                  }`}>
                    Risco {stock.volatilityLevel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Ticker Input */}
          <form onSubmit={handleCustomTickerSubmit} className="flex gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Adicionar outro ticker (ex: KLBN11, AURE3)..."
                value={customTicker}
                onChange={(e) => setCustomTicker(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar
            </button>
          </form>
        </div>

        {/* Financial Values (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <label className="block text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
            2. Valores de Aposta & Aportes
          </label>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 flex items-center justify-between">
              <span>Aplicação Inicial</span>
              <span className="text-[10px] text-slate-500">Padrão R$ 10.000</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-extrabold text-emerald-400">R$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={input.initialAmount}
                onChange={(e) => onChange({ ...input, initialAmount: Math.max(0, Number(e.target.value)) })}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-black text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 flex items-center justify-between">
              <span>Aporte Mensal</span>
              <span className="text-[10px] text-slate-500">Padrão R$ 500</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-extrabold text-emerald-400">R$</span>
              <input
                type="number"
                min="0"
                step="50"
                value={input.monthlyContribution}
                onChange={(e) => onChange({ ...input, monthlyContribution: Math.max(0, Number(e.target.value)) })}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-black text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-300 font-medium">Reinvestir Dividendos?</span>
            <input
              type="checkbox"
              checked={input.reinvestDividends}
              onChange={(e) => onChange({ ...input, reinvestDividends: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Time Window (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <label className="block text-xs font-extrabold text-amber-400 uppercase tracking-wider">
            3. Período da Rodada
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {timeWindowOptions.map((opt) => {
              const isSelected = input.timeWindow === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ ...input, timeWindow: opt.id })}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-amber-950/80 border-amber-500 text-white shadow-lg shadow-amber-500/20 ring-1 ring-amber-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="font-bold text-xs">{opt.label}</span>
                  </div>
                  <span className={`text-[10px] ${isSelected ? 'text-amber-300 font-semibold' : 'text-slate-500'}`}>
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
