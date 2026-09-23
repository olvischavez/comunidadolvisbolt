import React from 'react';
import { ActivePanel, UserCommunityProfile } from '../types';
import { Gift, Zap, Crown, User, LogIn, Check, LogOut } from 'lucide-react';

interface MobileBottomNavProps {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  userProfile: UserCommunityProfile;
  isLoggedIn: boolean;
  canClaimDaily: boolean;
  onClaimDailyBonus: () => void;
  onOpenAuthModal: () => void;
  onLogout?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePanel,
  setActivePanel,
  userProfile,
  isLoggedIn,
  canClaimDaily,
  onClaimDailyBonus,
  onOpenAuthModal,
  onLogout,
}) => {
  const isAdmin = userProfile.email === 'olvischavezmustafa@gmail.com' || userProfile.role === 'admin';

  return (
    <nav
      aria-label="Navegación Móvil Android"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] select-none"
      style={{ paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-lg mx-auto grid grid-cols-5 px-1 py-1.5 items-center">
        {/* Tab 1: FC Mobile */}
        <button
          id="mobile-nav-fcmobile"
          onClick={() => setActivePanel('fcmobile')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
            activePanel === 'fcmobile'
              ? 'text-emerald-400 font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-xl flex items-center justify-center text-base transition-all ${
              activePanel === 'fcmobile'
                ? 'bg-emerald-500/20 shadow-sm shadow-emerald-500/30 ring-1 ring-emerald-500/40 scale-110'
                : 'bg-transparent'
            }`}
          >
            ⚽
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight truncate max-w-full">
            FC Mobile
          </span>
          {activePanel === 'fcmobile' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </button>

        {/* Tab 2: Roblox */}
        <button
          id="mobile-nav-roblox"
          onClick={() => setActivePanel('roblox')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
            activePanel === 'roblox'
              ? 'text-red-400 font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-xl flex items-center justify-center text-base transition-all ${
              activePanel === 'roblox'
                ? 'bg-red-500/20 shadow-sm shadow-red-500/30 ring-1 ring-red-500/40 scale-110'
                : 'bg-transparent'
            }`}
          >
            🟥
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight truncate max-w-full">
            Roblox
          </span>
          {activePanel === 'roblox' && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-0.5 animate-pulse" />
          )}
        </button>

        {/* Tab 3: Premios */}
        <button
          id="mobile-nav-premios"
          onClick={() => setActivePanel('premios')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
            activePanel === 'premios'
              ? 'text-amber-400 font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
              activePanel === 'premios'
                ? 'bg-amber-500/20 shadow-sm shadow-amber-500/30 ring-1 ring-amber-500/40 scale-110 text-amber-400'
                : 'bg-transparent text-slate-400'
            }`}
          >
            <Gift className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight truncate max-w-full">
            Premios
          </span>
          {activePanel === 'premios' ? (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 animate-pulse" />
          ) : (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        {/* Tab 4: Bono Diario +50 Rayos (1-tap claim directly on Android) */}
        <button
          id="mobile-nav-bonus"
          onClick={canClaimDaily ? onClaimDailyBonus : undefined}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
            canClaimDaily
              ? 'text-amber-300 font-black'
              : 'text-slate-500'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
              canClaimDaily
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md shadow-amber-500/30 animate-pulse'
                : 'bg-slate-900 border border-slate-800 text-slate-500'
            }`}
          >
            {canClaimDaily ? (
              <Zap className="w-4 h-4 fill-current" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight truncate max-w-full">
            {canClaimDaily ? '+50 Rayos' : 'Listo'}
          </span>
          {canClaimDaily && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
          )}
        </button>

        {/* Tab 5: Admin or Profile/Auth */}
        {isAdmin ? (
          <button
            id="mobile-nav-admin"
            onClick={() => setActivePanel('admin')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
              activePanel === 'admin'
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                activePanel === 'admin'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm scale-110'
                  : 'bg-slate-900 border border-slate-800 text-amber-400'
              }`}
            >
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 tracking-tight truncate max-w-full">
              Admin
            </span>
            {activePanel === 'admin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 animate-pulse" />
            )}
          </button>
        ) : isLoggedIn ? (
          <div
            id="mobile-nav-profile"
            className="flex items-center justify-center gap-1 py-1.5 px-0.5 rounded-2xl"
          >
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-[10px] font-black text-amber-300 overflow-hidden">
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-3 h-3" />
                )}
              </div>
              <span className="text-[9px] font-bold text-slate-400 mt-0.5 truncate max-w-[40px]">
                {userProfile.name.split(' ')[0]}
              </span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="w-6 h-6 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-400 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : (
          <button
            id="mobile-nav-login"
            onClick={onOpenAuthModal}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl text-amber-400 active:scale-90 transition-all cursor-pointer"
          >
            <div className="w-9 h-7 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <LogIn className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 tracking-tight">
              Entrar
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
