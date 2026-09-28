import React from 'react';
import { Scale, BookOpen, ShieldAlert, FileText, CheckCircle } from 'lucide-react';

export const AcademicDisclaimer: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border border-amber-500/30 p-5 shadow-2xl backdrop-blur-md">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Scale className="w-32 h-32 text-amber-400" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/20 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <span>Uso Acadêmico & Legislação Financeira Vigente</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400/20 text-amber-200 border border-amber-400/30">
                Brasil (CVM / Receita)
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Simulação de fins estritamente educacionais e pesquisa acadêmica sobre rentabilidade e risco.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Conforme Lei nº 11.033/2004</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Tributação Renda Fixa (Selic)
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Segue a Tabela Regressiva do Imposto de Renda (Art. 1º Lei 11.033/04): 22,5% (até 180d), 20% (até 360d), 17,5% (até 720d) e 15% (acima de 720d).
          </p>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Tributação em Ações (B3)
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Alíquota de 15% sobre o ganho de capital líquido. Isenção de IR para vendas mensais totais até R$ 20.000 (Art. 3º Lei 11.033/2004).
          </p>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Aviso CVM & Responsabilidade
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Rentabilidade passada não garante rentabilidade futura. Esta ferramenta não constitui oferta ou recomendação de investimento.
          </p>
        </div>
      </div>
    </div>
  );
};
