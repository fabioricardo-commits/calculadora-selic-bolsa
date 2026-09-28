import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { Table, Search, ChevronLeft, ChevronRight, PieChart, Sparkles, AlertTriangle } from 'lucide-react';

interface DetailedMetricsProps {
  result: CalculationResult;
}

export const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'monthly'>('comparison');
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const filteredData = result.monthlyData.filter(
    (item) =>
      item.dateStr.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.monthIndex.toString().includes(searchFilter)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl backdrop-blur-md space-y-5">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'comparison'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <PieChart className="w-4 h-4" />
            Detalhamento da Carteira
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'monthly'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Table className="w-4 h-4" />
            Tabela Mês a Mês ({result.monthsCount} Meses)
          </button>
        </div>

        {activeTab === 'monthly' && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar mês ou ano..."
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Comparison */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Ativo / Opção</th>
                  <th className="py-3 px-3">Multiplicador</th>
                  <th className="py-3 px-3">Total Investido</th>
                  <th className="py-3 px-3">Saldo Bruto</th>
                  <th className="py-3 px-3 text-rose-400">IR Estimado</th>
                  <th className="py-3 px-3 text-emerald-400">Saldo Líquido</th>
                  <th className="py-3 px-3">Retorno Líquido</th>
                  <th className="py-3 px-3">CAGR (a.a.)</th>
                  <th className="py-3 px-3 text-rose-400">Máx Drawdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                {/* Selic row */}
                <tr className="hover:bg-slate-800/40 bg-sky-950/20">
                  <td className="py-3 px-3 font-extrabold text-sky-400">Tesouro Selic</td>
                  <td className="py-3 px-3 font-black text-amber-400">{result.selicMultiplier.toFixed(2)}x</td>
                  <td className="py-3 px-3 font-medium">{formatCurrency(result.totalInvested)}</td>
                  <td className="py-3 px-3 text-slate-300">{formatCurrency(result.selicGrossBalance)}</td>
                  <td className="py-3 px-3 text-rose-400">-{formatCurrency(result.selicIrTax)}</td>
                  <td className="py-3 px-3 font-black text-sky-300">{formatCurrency(result.selicNetBalance)}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">+{result.selicNetReturnPercent.toFixed(2)}%</td>
                  <td className="py-3 px-3">{result.selicCagrPercent.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-slate-500">0.0% (Zero)</td>
                </tr>

                {/* Combined Portfolio Row */}
                {result.stockResults.length > 1 && (
                  <tr className="hover:bg-slate-800/40 bg-purple-950/30 border-t-2 border-purple-500/40">
                    <td className="py-3 px-3 font-black text-purple-400">Carteira Consolidada</td>
                    <td className="py-3 px-3 font-black text-amber-400">{result.portfolioMultiplier.toFixed(2)}x</td>
                    <td className="py-3 px-3 font-medium">{formatCurrency(result.totalInvested)}</td>
                    <td className="py-3 px-3 text-slate-300">{formatCurrency(result.stockResults.reduce((a, s) => a + s.grossBalance, 0))}</td>
                    <td className="py-3 px-3 text-rose-400">-{formatCurrency(result.stockResults.reduce((a, s) => a + s.irTax, 0))}</td>
                    <td className="py-3 px-3 font-black text-purple-300">{formatCurrency(result.portfolioNetBalance)}</td>
                    <td className={`py-3 px-3 font-bold ${result.portfolioNetReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {result.portfolioNetReturnPercent >= 0 ? '+' : ''}{result.portfolioNetReturnPercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3">{result.portfolioCagrPercent.toFixed(2)}%</td>
                    <td className="py-3 px-3 text-slate-400">—</td>
                  </tr>
                )}

                {/* Individual stocks rows */}
                {result.stockResults.map((s) => (
                  <tr key={s.ticker} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: s.color }}></span>
                      {s.ticker} <span className="text-[10px] text-slate-400 font-normal">({s.name})</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-400">{s.multiplier.toFixed(2)}x</td>
                    <td className="py-3 px-3 text-slate-400">{formatCurrency(result.totalInvested / result.stockResults.length)}</td>
                    <td className="py-3 px-3 text-slate-300">{formatCurrency(s.grossBalance)}</td>
                    <td className="py-3 px-3 text-rose-400">-{formatCurrency(s.irTax)}</td>
                    <td className="py-3 px-3 font-extrabold text-white">{formatCurrency(s.netBalance)}</td>
                    <td className={`py-3 px-3 font-bold ${s.netReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {s.netReturnPercent >= 0 ? '+' : ''}{s.netReturnPercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3">{s.cagrPercent.toFixed(2)}%</td>
                    <td className="py-3 px-3 font-semibold text-rose-400">-{s.maxDrawdownPercent.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              Conceitos de Risco: Drawdown & Volatilidade Acadêmica
            </div>
            <p className="text-slate-300 leading-relaxed">
              • <strong>Max Drawdown:</strong> Representa a maior queda percentual do patrimônio desde o seu topo histórico até o fundo no período. Medida fundamental em finanças acadêmicas para avaliar o risco de cauda e tolerância do investidor.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Table */}
      {activeTab === 'monthly' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Mês</th>
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Total Investido</th>
                  <th className="py-3 px-3 text-sky-400">Saldo Selic</th>
                  <th className="py-3 px-3 text-purple-400">Saldo Carteira</th>
                  {result.stockResults.map((s) => (
                    <th key={s.ticker} className="py-3 px-3" style={{ color: s.color }}>
                      {s.ticker}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {paginatedData.map((row) => (
                  <tr key={row.monthIndex} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-white">#{row.monthIndex}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.dateStr}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-200">{formatCurrency(row.totalInvested)}</td>
                    <td className="py-2.5 px-3 font-bold text-sky-400">{formatCurrency(row.selicNetBalance)}</td>
                    <td className="py-2.5 px-3 font-bold text-purple-400">{formatCurrency(row.portfolioNetBalance)}</td>
                    {result.stockResults.map((s) => (
                      <td key={s.ticker} className="py-2.5 px-3 font-semibold text-slate-200">
                        {formatCurrency(row.stockBalances[s.ticker] ?? 0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Página {currentPage} de {totalPages} ({filteredData.length} meses)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
