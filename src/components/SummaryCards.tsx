import React from 'react';
import { CalculationResult } from '../types';
import { Trophy, TrendingUp, PiggyBank, ArrowUpRight, ArrowDownRight, Percent, CheckCircle2 } from 'lucide-react';

interface SummaryCardsProps {
  result: CalculationResult;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ result }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatPercent = (val: number) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(2)}%`;
  };

  const isStockWinner = result.winner === 'stock';
  const isSelicWinner = result.winner === 'selic';

  return (
    <div className="space-y-5">
      {/* Winner Banner */}
      <div className={`p-4 md:p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all shadow-xl ${
        isStockWinner
          ? 'bg-gradient-to-r from-purple-950/80 via-slate-900 to-purple-950/40 border-purple-500/50 shadow-purple-950/30'
          : isSelicWinner
          ? 'bg-gradient-to-r from-sky-950/80 via-slate-900 to-sky-950/40 border-sky-500/50 shadow-sky-950/30'
          : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className={`p-3 rounded-2xl ${
            isStockWinner ? 'bg-purple-500 text-slate-950' : isSelicWinner ? 'bg-sky-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
          }`}>
            <Trophy className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Resultado em {result.monthsCount / 12} ano(s)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                {result.startDate} — {result.endDate}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-extrabold text-white mt-0.5">
              {isStockWinner && (
                <>A ação <span className="text-purple-400">{result.stockTicker}</span> superou a Selic!</>
              )}
              {isSelicWinner && (
                <>A <span className="text-sky-400">Taxa Selic</span> superou a ação {result.stockTicker}!</>
              )}
              {!isStockWinner && !isSelicWinner && <>Empate técnico de rendimento!</>}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/70 px-4 py-2.5 rounded-xl border border-slate-800/80 text-right">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Diferença Final Líquida</div>
            <div className={`text-base font-extrabold ${isStockWinner ? 'text-purple-400' : isSelicWinner ? 'text-sky-400' : 'text-slate-300'}`}>
              +{formatCurrency(result.differenceAmount)}
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            isStockWinner ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
          }`}>
            +{result.differencePercent.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Invested */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <PiggyBank className="w-24 h-24 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <PiggyBank className="w-4 h-4 text-emerald-400" />
            Total Investido (Aportes)
          </div>
          
          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {formatCurrency(result.totalInvested)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Aporte Inicial + {result.monthsCount - 1} parcelas mensais
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total de Períodos:</span>
            <span className="font-semibold text-slate-200">{result.monthsCount} meses</span>
          </div>
        </div>

        {/* Card 2: Selic Result */}
        <div className={`bg-slate-900/80 border rounded-2xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden transition-all ${
          isSelicWinner ? 'border-sky-500/60 ring-1 ring-sky-500/40' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block animate-pulse"></span>
              Tesouro Selic (Renda Fixa)
            </div>
            {isSelicWinner && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Vencedor
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {formatCurrency(result.selicNetBalance)}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/40">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {formatPercent(result.selicNetReturnPercent)}
              </span>
              <span className="text-xs text-slate-400">
                Lucro Líquido: <strong className="text-sky-300 font-semibold">{formatCurrency(result.selicNetProfit)}</strong>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-slate-400 text-[11px]">Valor Bruto:</div>
              <div className="font-semibold text-slate-200">{formatCurrency(result.selicGrossBalance)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">IR Estimado:</div>
              <div className="font-semibold text-rose-400">-{formatCurrency(result.selicIrTax)}</div>
            </div>
          </div>
        </div>

        {/* Card 3: Stock Result */}
        <div className={`bg-slate-900/80 border rounded-2xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden transition-all ${
          isStockWinner ? 'border-purple-500/60 ring-1 ring-purple-500/40' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block animate-pulse"></span>
              {result.stockTicker} — {result.stockName}
            </div>
            {isStockWinner && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Vencedor
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {formatCurrency(result.stockNetBalance)}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-md border ${
                result.stockNetReturnPercent >= 0 
                  ? 'text-purple-300 bg-purple-950/60 border-purple-800/40' 
                  : 'text-rose-400 bg-rose-950/60 border-rose-800/40'
              }`}>
                {result.stockNetReturnPercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {formatPercent(result.stockNetReturnPercent)}
              </span>
              <span className="text-xs text-slate-400">
                Lucro Líquido: <strong className="text-purple-300 font-semibold">{formatCurrency(result.stockNetProfit)}</strong>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-slate-400 text-[11px]">Valor Bruto:</div>
              <div className="font-semibold text-slate-200">{formatCurrency(result.stockGrossBalance)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">IR Estimado:</div>
              <div className="font-semibold text-rose-400">-{formatCurrency(result.stockIrTax)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
