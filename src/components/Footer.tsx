import React from 'react';
import { ActivePanel } from '../types';

interface FooterProps {
  setActivePanel?: (panel: ActivePanel) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-8 text-center text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-black text-sm">
            ⚡
          </div>
          <span className="font-black text-sm sm:text-base text-white uppercase tracking-wider">
            COMUNIDAD OLVIS BOLT
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          © 2026 COMUNIDAD OLVIS BOLT. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
