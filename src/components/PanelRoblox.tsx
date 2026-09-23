import React, { useState } from 'react';
import { Copy, Check, Flame, Gift } from 'lucide-react';
import { NewsItem, PromoCode } from '../types';

interface PanelRobloxProps {
  news: NewsItem[];
  promoCodes: PromoCode[];
  onSelectNews: (news: NewsItem) => void;
}

export const PanelRoblox: React.FC<PanelRobloxProps> = ({
  news,
  promoCodes,
  onSelectNews,
}) => {
  const [activeTab, setActiveTab] = useState<'noticias' | 'codigos'>('noticias');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const robloxPromoCodes = promoCodes.filter((c) => c.game === 'roblox');
  const robloxNews = news.filter((n) => n.game === 'roblox');

  const handleCopyCode = (code: PromoCode) => {
    navigator.clipboard?.writeText(code.code);
    setCopiedCodeId(code.id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  return (
    <section className="space-y-6 animate-fade-in" aria-label="Panel Roblox">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-950 border border-red-500/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>🟥</span> ROBLOX NEWSROOM & GAMING
              </span>
              <span className="text-xs text-slate-400">Canal Oficial Olvis Bolt</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Actualizaciones, Nuevos Juegos y Códigos de Roblox
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Descubre análisis profundos de Roblox, secretos de juegos en tendencia, accesorios gratuitos para tu avatar,
              servidores comunitarios y las mejores experiencias para jugar con el clan.
            </p>
          </div>
        </div>
      </div>

      {/* Sub navigation bar */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 w-full">
        <button
          onClick={() => setActiveTab('noticias')}
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
            activeTab === 'noticias'
              ? 'bg-red-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>📰</span>
          <span className="truncate">Noticias ({robloxNews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('codigos')}
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
            activeTab === 'codigos'
              ? 'bg-red-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Códigos ({robloxPromoCodes.length})</span>
        </button>
      </div>

      {/* TAB 1: NOTICIAS */}
      {activeTab === 'noticias' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Presiona cualquier noticia para leer el informe completo de la comunidad.</span>
            <span className="text-amber-400 font-bold">+25 Rayos por lectura</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {robloxNews.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="group relative bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-red-500/50 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-red-400 border border-red-500/30">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="absolute top-3 right-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                        ⭐ Novedad
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <span>{item.author}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-red-300 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-red-500/20">
                      <div className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-1.5 mb-1">
                        <span>📌 Resumen Clave:</span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold">
                    <span>Leer Noticia Completa</span>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-red-500 group-hover:text-white transition-colors flex items-center justify-center text-slate-300">
                    <Flame className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CODIGOS PROMOCIONALES */}
      {activeTab === 'codigos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-start gap-3">
            <span className="text-2xl">🎩</span>
            <div>
              <h4 className="font-bold text-white text-sm">¿Cómo canjear códigos en Roblox?</h4>
              <p className="text-xs text-slate-300 mt-1">
                Entra a <strong>roblox.com/redeem</strong> en tu navegador, inicia sesión con tu usuario y contraseña de Roblox, y pega el código para recibir accesorios de avatar gratis y permanentes.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {robloxPromoCodes.map((code) => (
              <div
                key={code.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base sm:text-lg font-black text-amber-400 bg-slate-950 px-3 py-1 rounded-lg border border-amber-500/30 tracking-wider">
                      {code.code}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      ✓ Activo
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white">{code.reward}</p>
                  <p className="text-[11px] text-slate-400">{code.instructions}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopyCode(code)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                      copiedCodeId === code.id
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                    }`}
                  >
                    {copiedCodeId === code.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
