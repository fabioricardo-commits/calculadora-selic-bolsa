import React, { useState } from 'react';
import { SimulationInput, TimeWindow } from '../types';
import { POPULAR_STOCKS } from '../data/stocks';
import { Calendar, DollarSign, Search, Coins, ArrowRightLeft, Percent } from 'lucide-react';

interface InputPanelProps {
  input: SimulationInput;
  onChange: (newInput: SimulationInput) => void;
  isLoading?: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ input, onChange, isLoading }) => {
  const [customTicker, setCustomTicker] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleTimeWindowChange = (window: TimeWindow) => {
    onChange({ ...input, timeWindow: window });
  };

  const handleStockSelect = (ticker: string) => {
    setIsCustom(false);
    onChange({ ...input, ticker });
  };

  const handleCustomTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTicker.trim()) {
      const formatted = customTicker.trim().toUpperCase();
      setIsCustom(true);
      onChange({ ...input, ticker: formatted });
    }
  };

  const timeWindowOptions: { id: TimeWindow; label: string; sub: string }[] = [
    { id: '1y', label: '1 Ano', sub: '12 meses' },
    { id: '2y', label: '2 Anos', sub: '24 meses' },
    { id: '5y', label: '5 Anos', sub: '60 meses' },
    { id: '10y', label: '10 Anos', sub: '120 meses' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-400" />
            Parâmetros da Simulação
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ajuste o valor inicial, aporte mensal, ação e período desejado.
          </p>
        </div>
        
        {/* IR Tax Toggle */}
        <div className="flex items-center gap-3 bg-slate-950/60 p-1.5 px-3 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-300 font-medium flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-amber-400" />
            Descontar Imposto de Renda (IR)?
          </span>
          <button
            type="button"
            onClick={() => onChange({ ...input, applyTaxes: !input.applyTaxes })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
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

      <div className="grid grid-[#0] lg:grid-cols-12 gap-6">
        {/* Stock Selector Section (5 columns) */}
        <div className="lg:col-span-5 space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            1. Selecione a Ação da Bolsa (B3)
          </label>
          
          {/* Quick Stock Chips */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {POPULAR_STOCKS.map((stock) => {
              const isSelected = !isCustom && input.ticker === stock.ticker;
              return (
                <button
                  key={stock.ticker}
                  type="button"
                  onClick={() => handleStockSelect(stock.ticker)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-500'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="font-bold text-sm tracking-wide">{stock.ticker}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-full">{stock.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Ticker Input */}
          <form onSubmit={handleCustomTickerSubmit} className="flex gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Outro ticker (ex: AURE3, KLBN11)"
                value={customTicker}
                onChange={(e) => setCustomTicker(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Financial Inputs Section (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            2. Valores da Aplicação
          </label>

          {/* Initial Amount */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 flex items-center justify-between">
              <span>Aplicação Inicial</span>
              <span className="text-[10px] text-slate-500">Padrão R$ 10.000</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-emerald-400">R$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={input.initialAmount}
                onChange={(e) => onChange({ ...input, initialAmount: Math.max(0, Number(e.target.value)) })}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Monthly Contribution */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 flex items-center justify-between">
              <span>Aporte Mensal</span>
              <span className="text-[10px] text-slate-500">Padrão R$ 500</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-emerald-400">R$</span>
              <input
                type="number"
                min="0"
                step="50"
                value={input.monthlyContribution}
                onChange={(e) => onChange({ ...input, monthlyContribution: Math.max(0, Number(e.target.value)) })}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Dividend Reinvestment Option */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-slate-300 font-medium">Reinvestir Dividendos da Ação?</span>
            <input
              type="checkbox"
              checked={input.reinvestDividends}
              onChange={(e) => onChange({ ...input, reinvestDividends: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Time Window Section (3 columns) */}
        <div className="lg:col-span-3 space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            3. Janela de Tempo
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            {timeWindowOptions.map((opt) => {
              const isSelected = input.timeWindow === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleTimeWindowChange(opt.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="font-bold text-sm">{opt.label}</span>
                  </div>
                  <span className={`text-[11px] ${isSelected ? 'text-emerald-300 font-medium' : 'text-slate-500'}`}>
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
