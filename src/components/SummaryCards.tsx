import React from 'react';
import { CalculationResult } from '../types';
import { Trophy, PiggyBank, Flame, ArrowUpRight, ArrowDownRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface SummaryCardsProps {
  result: CalculationResult;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ result }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const isSelicWinner = result.winner === 'selic';
  const isPortfolioWinner = result.winner === 'portfolio';

  return (
    <div className="space-y-5">
      {/* Casino Winner Banner HUD */}
      <div className={`relative overflow-hidden p-5 md:p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl transition-all ${
        isSelicWinner
          ? 'bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950/60 border-sky-500/60 shadow-sky-950/50'
          : 'bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950/60 border-purple-500/60 shadow-purple-950/50'
      }`}>
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className={`p-3.5 rounded-2xl shadow-xl ${
            isSelicWinner ? 'bg-sky-400 text-slate-950 shadow-sky-400/30' : 'bg-emerald-400 text-slate-950 shadow-emerald-400/30 animate-pulse'
          }`}>
            <Trophy className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> BIG WINNER DA RODADA
              </span>
              <span className="text-xs text-slate-400">{result.startDate} — {result.endDate}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mt-1 tracking-tight">
              {result.winnerName} alcançou o melhor rendimento!
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Multiplicador da Aposta: <span className="font-extrabold text-emerald-400">{result.bestMultiplier.toFixed(2)}x o valor inicial</span>
            </p>
          </div>
        </div>

        {/* HUD Multiplier Stat */}
        <div className="flex items-center gap-4 bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800 text-right">
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Vantagem Líquida</div>
            <div className="text-xl font-black text-emerald-400">
              +{formatCurrency(result.differenceAmount)}
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            +{result.differencePercent.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Invested (Banca) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              <PiggyBank className="w-4 h-4 text-emerald-400" />
              Total da Banca (Aportado)
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300">
              {result.monthsCount} Meses
            </span>
          </div>

          <div className="mt-3">
            <div className="text-3xl font-black text-white tracking-tight">
              {formatCurrency(result.totalInvested)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Aporte inicial + {result.monthsCount - 1} aportes mensais
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Multiplicador Base:</span>
            <span className="font-bold text-white">1.00x</span>
          </div>
        </div>

        {/* Card 2: Selic (Banca do Estado / Renda Fixa) */}
        <div className={`bg-slate-900/90 border rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden transition-all ${
          isSelicWinner ? 'border-sky-400/80 ring-2 ring-sky-400/30' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold text-sky-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Tesouro Selic (House/Bank)
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {result.selicMultiplier.toFixed(2)}x Multiplier
            </span>
          </div>

          <div className="mt-3">
            <div className="text-3xl font-black text-white tracking-tight">
              {formatCurrency(result.selicNetBalance)}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded-md border border-sky-800/50">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{result.selicNetReturnPercent.toFixed(2)}%
              </span>
              <span className="text-xs text-slate-400">
                Lucro Líquido: <strong className="text-sky-300">{formatCurrency(result.selicNetProfit)}</strong>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">IR Deduzido (Lei 11.033):</span>
            <span className="font-semibold text-rose-400">-{formatCurrency(result.selicIrTax)}</span>
          </div>
        </div>

        {/* Card 3: Selected Stock Portfolio (High Roller) */}
        <div className={`bg-slate-900/90 border rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden transition-all ${
          isPortfolioWinner ? 'border-purple-400/80 ring-2 ring-purple-400/30' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold text-purple-400 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-purple-400" />
              Carteira de Ações ({result.stockResults.length})
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {result.portfolioMultiplier.toFixed(2)}x Multiplier
            </span>
          </div>

          <div className="mt-3">
            <div className="text-3xl font-black text-white tracking-tight">
              {formatCurrency(result.portfolioNetBalance)}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-md border ${
                result.portfolioNetReturnPercent >= 0 ? 'text-emerald-300 bg-emerald-950 border-emerald-800/50' : 'text-rose-400 bg-rose-950 border-rose-800/50'
              }`}>
                {result.portfolioNetReturnPercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {result.portfolioNetReturnPercent >= 0 ? '+' : ''}{result.portfolioNetReturnPercent.toFixed(2)}%
              </span>
              <span className="text-xs text-slate-400">
                Lucro Líquido: <strong className="text-purple-300">{formatCurrency(result.portfolioNetProfit)}</strong>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">CAGR Anualizado:</span>
            <span className="font-semibold text-purple-300">{result.portfolioCagrPercent.toFixed(2)}% a.a.</span>
          </div>
        </div>
      </div>

      {/* Individual Stock Multipliers Cards (if multi-stocks selected) */}
      {result.stockResults.length > 1 && (
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Desempenho Individual das Ações na Carteira
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {result.stockResults.map((s) => (
              <div key={s.ticker} className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-white" style={{ color: s.color }}>{s.ticker}</span>
                  <span className="text-[10px] font-bold text-amber-400">{s.multiplier.toFixed(2)}x</span>
                </div>
                <div className="text-xs font-extrabold text-slate-200">{formatCurrency(s.netBalance)}</div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className={s.netReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {s.netReturnPercent >= 0 ? '+' : ''}{s.netReturnPercent.toFixed(1)}%
                  </span>
                  <span className="text-rose-400 font-medium">-{s.maxDrawdownPercent.toFixed(1)}% DD</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
