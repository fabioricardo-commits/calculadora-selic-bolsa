import React, { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, Clock, ShieldCheck, Scale } from 'lucide-react';

export const Footer: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update date and time instantaneously every second (1000ms)
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentDateTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/90 py-8 mt-12 text-xs text-slate-400 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-black text-sm">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>Simulador Acadêmico Selic vs Bolsa de Valores (B3)</span>
            </div>
            <p className="mt-1 text-slate-400 max-w-xl text-xs">
              Plataforma de simulação com cenários gamificados e tributação real (Art. 1º e 3º da Lei nº 11.033/2004). Dados da Selic via Banco Central do Brasil.
            </p>
          </div>

          {/* Instantaneous Real-Time System Clock */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-purple-500/40 px-4 py-2.5 rounded-2xl shadow-xl">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Horário do Sistema (Em Tempo Real)
              </div>
              <div className="text-sm font-black text-white capitalize flex items-center gap-2">
                <span>{formattedDate}</span>
                <span className="text-purple-400 font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Info Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Fins estritamente acadêmicos e educacionais. Sem garantia de resultados futuros.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Hospedagem Vercel
            </span>
            <a
              href="https://www.bcb.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:underline font-bold"
            >
              Fonte: Banco Central do Brasil <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
