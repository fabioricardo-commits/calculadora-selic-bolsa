import React from 'react';
import { TrendingUp, Landmark, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">Selic vs Bolsa</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                B3 & BCB API
              </span>
            </div>
            <p className="text-xs text-slate-400">Comparador de Rentabilidade de Investimentos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Landmark className="w-4 h-4 text-sky-400" />
            <span>Tesouro Selic vs Renda Variável</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/50 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pronto para Vercel</span>
          </div>
        </div>
      </div>
    </header>
  );
};
