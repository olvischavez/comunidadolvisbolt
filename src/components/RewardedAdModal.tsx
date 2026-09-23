import React, { useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, ShieldCheck, Zap, X, CheckCircle, Info } from 'lucide-react';
import { NewsItem } from '../types';

interface RewardedAdModalProps {
  newsItem: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAdCompleted: (rewardGiven: boolean) => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  newsItem,
  isOpen,
  onClose,
  onAdCompleted,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(7);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(7);
      setCanSkip(false);
      setHasClaimed(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !newsItem) return null;

  const handleFinish = () => {
    setHasClaimed(true);
    setTimeout(() => {
      onAdCompleted(true);
    }, 400);
  };

  const progressPercent = Math.max(0, Math.min(100, ((7 - secondsRemaining) / 7) * 100));

  return (
    <div
      id="rewarded-ad-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 flex flex-col">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              Video Publicitario Patrocinado
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" /> Seguro para niños
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>+25 Rayos Bolt</span>
            </div>

            {canSkip && (
              <button
                onClick={handleFinish}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                title="Continuar a la noticia"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Video Simulation Canvas */}
        <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
          {/* Animated Background Graphic */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000"
            style={{
              backgroundImage: `url(${
                newsItem.game === 'fcmobile'
                  ? 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'
                  : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop'
              })`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Central Ad Graphic & Sound */}
          <div className="relative z-10 text-center px-6 max-w-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-400 mb-3 shadow-lg shadow-amber-400/20">
              <Play className="w-8 h-8 fill-amber-400 translate-x-0.5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {newsItem.game === 'fcmobile'
                ? '¡SÚPER PACK TOTS FC MOBILE 2026!'
                : '¡DESCUBRE LA NUEVA ISLA EN ROBLOX!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium">
              Anuncio patrocinador oficial de la <strong className="text-amber-300">Comunidad Olvis Bolt</strong>.
              Cada visualización apoya a comprar tarjetas de regalo para los 30 miembros.
            </p>
          </div>

          {/* Bottom Video Controls */}
          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-xs text-slate-300">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isMuted ? 'Silencio' : 'Sonido'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-amber-300 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                {secondsRemaining > 0 ? `00:0${secondsRemaining}` : '¡Listo!'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Desbloqueando noticia: <strong className="text-slate-200">{newsItem.title.slice(0, 38)}...</strong>
            </span>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-end gap-3">
            {canSkip ? (
              <button
                id="btn-ad-continue"
                onClick={handleFinish}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer animate-pulse"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Continuar a la Noticia (+25 Rayos)</span>
              </button>
            ) : (
              <div className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 font-bold text-xs">
                Puedes continuar en {secondsRemaining} segundos...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
