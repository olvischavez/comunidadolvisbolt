import React from 'react';
import { Zap, Users, Gift, Flame, LogIn, LogOut, User as UserIcon, Crown } from 'lucide-react';
import { ActivePanel, UserCommunityProfile } from '../types';

interface HeaderProps {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  userProfile: UserCommunityProfile;
  onClaimDailyBonus: () => void;
  dailyClaimed: boolean;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePanel,
  setActivePanel,
  userProfile,
  onClaimDailyBonus,
  dailyClaimed,
  onOpenAuthModal,
  onLogout,
}) => {
  const isLoggedIn = Boolean(userProfile.uid || userProfile.email);
  const isAdmin = userProfile.email === 'olvischavezmustafa@gmail.com' || userProfile.role === 'admin';
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            onClick={() => setActivePanel('fcmobile')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-2xl">
                ⚡
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold tracking-tight text-sm sm:text-xl text-white group-hover:text-amber-400 transition-colors uppercase truncate">
                  COMUNIDAD OLVIS BOLT
                </span>
                <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shrink-0">
                  CLAN
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                FC Mobile & Roblox Gaming Hub
              </p>
            </div>
          </div>

          {/* Mobile Coins & Auth Indicator */}
          <div className="flex md:hidden items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setActivePanel('admin')}
                className={`p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activePanel === 'admin'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                    : 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                }`}
              >
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>Admin</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl text-amber-300 font-bold text-xs">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{userProfile.boltCoins}</span>
            </div>

            {isLoggedIn ? (
              <button
                onClick={onLogout}
                title="Cerrar Sesión"
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (visible on tablet & desktop, mobile uses native bottom nav) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 w-full sm:w-auto justify-center flex-wrap">
          <button
            id="tab-fcmobile"
            onClick={() => setActivePanel('fcmobile')}
            className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePanel === 'fcmobile'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>⚽</span>
            <span className="hidden xs:inline">Panel </span>FC Mobile
          </button>

          <button
            id="tab-roblox"
            onClick={() => setActivePanel('roblox')}
            className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePanel === 'roblox'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🟥</span>
            <span className="hidden xs:inline">Panel </span>Roblox
          </button>

          <button
            id="tab-premios"
            onClick={() => setActivePanel('premios')}
            className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap relative ${
              activePanel === 'premios'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Gift className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline">Panel </span>Premios
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
          </button>

          {/* Special Admin Tab for Owner (Olvis Bolt) */}
          {isAdmin && (
            <button
              id="tab-admin"
              onClick={() => setActivePanel('admin')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
                activePanel === 'admin'
                  ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-md shadow-amber-400/20'
                  : 'bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 border-amber-400/30'
              }`}
            >
              <Crown className="w-4 h-4 fill-current shrink-0" />
              <span>Panel Admin</span>
            </button>
          )}
        </nav>

        {/* User Stats & Daily Claim */}
        <div className="hidden md:flex items-center gap-3">
          {/* Rayos Bolt Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-xl border border-amber-500/30 text-xs">
            <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium leading-none">Tus Rayos Bolt</div>
              <div className="font-extrabold text-amber-300 text-sm">{userProfile.boltCoins} ⚡</div>
            </div>
          </div>

          {/* Daily Gift Button */}
          <button
            onClick={onClaimDailyBonus}
            disabled={dailyClaimed}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              dailyClaimed
                ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-700/40'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-400/20 active:scale-95'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${dailyClaimed ? '' : 'text-slate-950 animate-bounce'}`} />
            <span>{dailyClaimed ? 'Reclamado Hoy' : '+50 Diario'}</span>
          </button>

          {/* Auth Section: Logged In or Login Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-xl object-cover border border-amber-400/30"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
                    {userProfile.name}
                  </div>
                  {isAdmin ? (
                    <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5 fill-amber-300" />
                      Dueño / Admin
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En línea
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Cerrar Sesión"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

