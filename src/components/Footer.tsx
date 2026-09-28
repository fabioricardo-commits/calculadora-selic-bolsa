import React from 'react';
import { Landmark, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/80 py-8 mt-12 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 font-bold">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span>Comparador Selic vs Bolsa de Valores (B3)</span>
          </div>
          <p className="mt-1 text-slate-500 max-w-lg">
            Desenvolvido para simulação educacional de investimentos no mercado financeiro brasileiro. Dados históricos obtidos do Banco Central do Brasil.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="text-slate-400">
            Hospedagem configurada para <strong className="text-white">Vercel</strong>
          </span>
          <a
            href="https://www.bcb.gov.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:underline font-medium"
          >
            Fonte: Banco Central do Brasil <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
