import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { Table, Search, ChevronLeft, ChevronRight, Info, PieChart, Sparkles } from 'lucide-react';

interface DetailedMetricsProps {
  result: CalculationResult;
}

export const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'monthly'>('comparison');
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 1 year per page

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatPercent = (val: number) => {
    return `${val.toFixed(2)}%`;
  };

  // Filter monthly data
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-sm space-y-5">
      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'comparison'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <PieChart className="w-4 h-4" />
            Detalhamento Comparativo
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
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
              placeholder="Filtrar por mês ou data..."
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

      {/* Tab 1: Detailed Comparison */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selic Metrics Table */}
            <div className="bg-slate-950/60 rounded-xl border border-sky-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-sm text-sky-400 flex items-center gap-2">
                  Tesouro Selic
                </span>
                <span className="text-[11px] text-slate-400">Renda Fixa Pós-Fixada</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Total Investido (Aportes):</span>
                  <span className="font-semibold text-white">{formatCurrency(result.totalInvested)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Saldo Bruto Final:</span>
                  <span className="font-semibold text-sky-300">{formatCurrency(result.selicGrossBalance)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Rendimento Bruto:</span>
                  <span className="font-semibold text-emerald-400">+{formatCurrency(result.selicGrossProfit)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Imposto de Renda (IR):</span>
                  <span className="font-semibold text-rose-400">-{formatCurrency(result.selicIrTax)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400 font-bold">Saldo Líquido Final:</span>
                  <span className="font-black text-sky-400 text-sm">{formatCurrency(result.selicNetBalance)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Rentabilidade Líquida Total:</span>
                  <span className="font-semibold text-emerald-400">+{formatPercent(result.selicNetReturnPercent)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Rentabilidade Anual (CAGR):</span>
                  <span className="font-semibold text-sky-300">{formatPercent(result.selicCagrPercent)} a.a.</span>
                </div>
              </div>
            </div>

            {/* Stock Metrics Table */}
            <div className="bg-slate-950/60 rounded-xl border border-purple-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-sm text-purple-400 flex items-center gap-2">
                  Ação {result.stockTicker}
                </span>
                <span className="text-[11px] text-slate-400">{result.stockName}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Total Investido (Aportes):</span>
                  <span className="font-semibold text-white">{formatCurrency(result.totalInvested)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Saldo Bruto Final:</span>
                  <span className="font-semibold text-purple-300">{formatCurrency(result.stockGrossBalance)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Rendimento Bruto:</span>
                  <span className="font-semibold text-emerald-400">+{formatCurrency(result.stockGrossProfit)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Imposto de Renda (IR Estimado):</span>
                  <span className="font-semibold text-rose-400">-{formatCurrency(result.stockIrTax)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400 font-bold">Saldo Líquido Final:</span>
                  <span className="font-black text-purple-400 text-sm">{formatCurrency(result.stockNetBalance)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Rentabilidade Líquida Total:</span>
                  <span className={`font-semibold ${result.stockNetReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    +{formatPercent(result.stockNetReturnPercent)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Rentabilidade Anual (CAGR):</span>
                  <span className="font-semibold text-purple-300">{formatPercent(result.stockCagrPercent)} a.a.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Insights Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              Análise de Risco & Liquidez
            </div>
            <p className="text-slate-300 leading-relaxed">
              • <strong>Tesouro Selic:</strong> Oferece liquidez diária (D+1) com volatilidade próxima de zero e garantia soberana (baixo risco de crédito).
            </p>
            <p className="text-slate-300 leading-relaxed">
              • <strong>Ações da Bolsa (B3):</strong> Possuem volatilidade e oscilação diária. A estratégia de aportes mensais (DCA - Dollar Cost Averaging) ajuda a suavizar o preço médio de aquisição ao longo dos anos.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Evolution Table */}
      {activeTab === 'monthly' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Mês</th>
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Total Investido</th>
                  <th className="py-3 px-3 text-sky-400">Selic (%)</th>
                  <th className="py-3 px-3 text-sky-400">Saldo Selic (Líquido)</th>
                  <th className="py-3 px-3 text-purple-400">Retorno {result.stockTicker}</th>
                  <th className="py-3 px-3 text-purple-400">Saldo {result.stockTicker} (Líquido)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {paginatedData.map((row) => (
                  <tr key={row.monthIndex} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white">#{row.monthIndex}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.dateStr}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-200">{formatCurrency(row.totalInvested)}</td>
                    <td className="py-2.5 px-3 text-sky-300">{row.selicRateMonth.toFixed(2)}%</td>
                    <td className="py-2.5 px-3 font-semibold text-sky-400">{formatCurrency(row.selicNetBalance)}</td>
                    <td className={`py-2.5 px-3 font-medium ${row.stockMonthlyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.stockMonthlyReturn >= 0 ? '+' : ''}{row.stockMonthlyReturn.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-purple-400">{formatCurrency(row.stockNetBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Página {currentPage} de {totalPages} ({filteredData.length} registros)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
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
