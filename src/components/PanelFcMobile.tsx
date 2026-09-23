import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, Gift, Sparkles } from 'lucide-react';
import { NewsItem, PromoCode } from '../types';

interface PanelFcMobileProps {
  news: NewsItem[];
  promoCodes?: PromoCode[];
  onSelectNews: (news: NewsItem) => void;
}

export const PanelFcMobile: React.FC<PanelFcMobileProps> = ({
  news,
  promoCodes = [],
  onSelectNews,
}) => {
  const [activeTab, setActiveTab] = useState<'noticias' | 'codigos'>('noticias');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const fcNews = news.filter((n) => n.game === 'fcmobile');
  const fcPromoCodes = promoCodes.filter((c) => c.game === 'fcmobile');

  const handleCopyCode = (code: PromoCode) => {
    navigator.clipboard?.writeText(code.code);
    setCopiedCodeId(code.id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  return (
    <section className="space-y-6 animate-fade-in" aria-label="Panel FC Mobile">
      {/* Top Section Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>⚽</span> EA SPORTS FC MOBILE
              </span>
              <span className="text-xs text-slate-400">Canal Oficial Olvis Bolt</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Noticias, Eventos y Códigos de FC Mobile
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Mantente al día con los últimos informes exclusivos, guías de jugabilidad, filtraciones de mercado y códigos activos para la comunidad.
            </p>
          </div>
        </div>
      </div>

      {/* Sub navigation bar */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 w-full">
        <button
          onClick={() => setActiveTab('noticias')}
          className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
            activeTab === 'noticias'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>⚽ Noticias y Guías ({fcNews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('codigos')}
          className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
            activeTab === 'codigos'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4 shrink-0" />
          <span>Códigos FC Mobile ({fcPromoCodes.length})</span>
        </button>
      </div>

      {/* TAB 1: NOTICIAS */}
      {activeTab === 'noticias' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Haz clic en cualquier noticia para leer el informe completo.</span>
            <span className="text-emerald-400 font-bold">Artículos y Guías Oficiales ({fcNews.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fcNews.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="group relative bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-emerald-500/50 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
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
                    <span className="absolute top-3 left-3 text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="absolute top-3 right-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                        ⭐ Destacado
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <span>{item.author}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-emerald-500/20">
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
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <span>Leer Noticia Completa</span>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors flex items-center justify-center text-slate-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CÓDIGOS PROMOCIONALES FC MOBILE */}
      {activeTab === 'codigos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Códigos Promocionales Activos de FC Mobile
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Toca en "Copiar" para guardar el código en tu portapapeles y canjéalo en el juego.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fcPromoCodes.map((code) => (
              <div
                key={code.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        code.status === 'exclusive'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                      }`}
                    >
                      {code.status === 'exclusive' ? '⭐ Exclusivo Olvis Bolt' : '✅ Código Verificado'}
                    </span>
                    <span className="text-[11px] text-slate-400">Verificado: {code.verifiedDate}</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 mb-3">
                    <span className="font-mono text-base font-black text-emerald-400 tracking-wider">
                      {code.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        copiedCodeId === code.id
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {copiedCodeId === code.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm font-bold text-white mb-1">🎁 Recompensa: {code.reward}</p>
                  <p className="text-xs text-slate-400">{code.instructions}</p>
                </div>

                {code.expiryDate && (
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
                    <span>Vencimiento:</span>
                    <span className="text-slate-300 font-medium">{code.expiryDate}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
