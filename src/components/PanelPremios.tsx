import React, { useState, useEffect } from 'react';
import { Gift, Zap, ShieldCheck, CheckCircle2, Clock, Info, ExternalLink, Sparkles, AlertCircle, UserCheck, ListOrdered, Crown } from 'lucide-react';
import { RewardPrize, UserCommunityProfile, PrizeRedemption } from '../types';
import { RedemptionModal } from './RedemptionModal';
import { getUserRedemptions } from '../firebase';

interface PanelPremiosProps {
  prizes: RewardPrize[];
  userProfile: UserCommunityProfile;
  onEarnBolts: (amount: number, reason: string) => void;
  offerwallIframeUrl?: string;
  onOpenAuthModal?: () => void;
  onNavigateToAdmin?: () => void;
}

export const PanelPremios: React.FC<PanelPremiosProps> = ({
  prizes,
  userProfile,
  onEarnBolts,
  offerwallIframeUrl = '',
  onOpenAuthModal,
  onNavigateToAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'offerwall' | 'tienda' | 'mis_canjes'>('offerwall');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPrizeForRedemption, setSelectedPrizeForRedemption] = useState<RewardPrize | null>(null);
  const [redemptions, setRedemptions] = useState<PrizeRedemption[]>([]);
  const isAdmin = userProfile.email === 'olvischavezmustafa@gmail.com' || userProfile.role === 'admin';

  const today = new Date().toISOString().split('T')[0];
  const isDailyLimitReached = userProfile.lastPrizeRedeemedDate === today && userProfile.role !== 'admin';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Load user redemptions from Firestore when logged in
  useEffect(() => {
    if (userProfile.uid) {
      getUserRedemptions(userProfile.uid).then((items) => {
        setRedemptions(items);
      });
    }
  }, [userProfile.uid, activeTab]);

  const handleRedeemPrize = (prize: RewardPrize) => {
    // If not logged in, prompt AuthModal
    if (!userProfile.uid) {
      if (onOpenAuthModal) onOpenAuthModal();
      showToast('Inicia sesión con Google para registrar tu canje de forma segura.');
      return;
    }

    // Daily Limit Anti-Abuse Check: Max 1 major prize per day
    if (isDailyLimitReached) {
      showToast('⚠️ Límite diario alcanzado: Máximo 1 canje por día para verificar las ofertas.');
      return;
    }

    if (userProfile.boltCoins < prize.costBolts) {
      showToast(`Te faltan ${(prize.costBolts - userProfile.boltCoins).toLocaleString()} Rayos Bolt para este premio.`);
      return;
    }

    setSelectedPrizeForRedemption(prize);
  };

  const handleRedemptionSuccess = (remainingBolts: number, message: string) => {
    onEarnBolts(-(userProfile.boltCoins - remainingBolts), 'Canje');
    showToast(message);
    if (userProfile.uid) {
      getUserRedemptions(userProfile.uid).then((items) => setRedemptions(items));
    }
  };

  return (
    <section className="space-y-6 animate-fade-in" aria-label="Panel Premios">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-400 text-slate-950 font-extrabold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Zap className="w-5 h-5 fill-slate-950 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/40 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> MURO DE DESAFÍOS & CANJES
              </span>
              <span className="text-xs text-slate-400">Comunidad Gamer Olvis Bolt</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Muro de Desafíos & Recompensas
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Completa ofertas oficiales (juegos móviles, encuestas y videos patrocinados). Cada tarea completada suma <strong className="text-amber-400">Rayos Bolt</strong> directamente para canjear en FC Mobile y Roblox.
            </p>
          </div>

          {/* User Bolt Balance Card & Daily Limit Status */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 shrink-0 flex flex-col items-end gap-1">
            <span className="text-xs text-slate-400 font-medium">Tus Rayos Disponibles</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-1.5">
              <Zap className="w-6 h-6 fill-amber-400" />
              <span>{userProfile.boltCoins.toLocaleString()} ⚡</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Límite: {isDailyLimitReached ? '1/1 canje usado hoy' : '0/1 canjes hoy'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Rule Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold mb-0.5">Límite Diario de Seguridad (Anti-Abuso)</strong>
          <span>
            Cada usuario puede canjear máximo <strong>1 premio al día</strong>. Todas las tareas del Muro de Desafíos se verifican en 24h para asegurar que no se hayan usado VPNs ni multicuentas.
          </span>
        </div>
      </div>

      {/* Sub Navigation Bar: Offerwall, Tienda de Canje, Mis Canjes */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 w-full">
        <button
          onClick={() => setActiveTab('offerwall')}
          className={`px-2 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
            activeTab === 'offerwall'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Desafíos</span>
        </button>

        <button
          onClick={() => setActiveTab('tienda')}
          className={`px-2 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
            activeTab === 'tienda'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Tienda ({prizes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mis_canjes')}
          className={`px-2 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center relative ${
            activeTab === 'mis_canjes'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Canjes</span>
          {redemptions.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-950 text-amber-400 font-bold shrink-0">
              {redemptions.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OFFERWALL OFICIAL */}
      {activeTab === 'offerwall' && (
        <div className="space-y-6">
          {/* Offerwall Frame Container */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 border border-amber-500/30 overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-sm text-white">Muro de Tareas</span>
              </div>
              <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                ⚡ Rayos Bolt automáticos al completar ofertas
              </span>
            </div>

            {offerwallIframeUrl ? (
              <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                <iframe
                  src={offerwallIframeUrl}
                  title="Muro de Desafíos Comunidad Olvis Bolt"
                  className="w-full min-h-[640px] rounded-2xl border-none"
                  allow="camera; microphone; geolocation"
                />
              </div>
            ) : (
              <div className="py-16 px-6 rounded-2xl bg-slate-950/80 border border-dashed border-amber-500/30 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold text-xs uppercase tracking-wider inline-block">
                    Próximamente en Vivo
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white pt-1">
                    Muro de Desafíos en Preparación
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                    Estamos alistando el muro oficial de tareas y ofertas patrocinadas. Muy pronto podrás completar ofertas de juegos, ver videos y responder encuestas para ganar miles de <strong className="text-amber-400">Rayos Bolt</strong> diarios.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Ofertas Seguras & Verificadas</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Acreditación Automática</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 max-w-md w-full flex items-center justify-between gap-3 text-left">
                    <div className="text-xs">
                      <strong className="text-amber-300 block font-black flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 fill-amber-300" /> Modo Administrador
                      </strong>
                      <span className="text-slate-300 text-[11px]">
                        Puedes conectar el enlace de Lootably o CPALead directamente desde tu panel de control.
                      </span>
                    </div>
                    {onNavigateToAdmin && (
                      <button
                        onClick={onNavigateToAdmin}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shrink-0 transition-all cursor-pointer shadow"
                      >
                        Ir al Admin
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TIENDA DE CANJE */}
      {activeTab === 'tienda' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Canjea tus Rayos Bolt por premios oficiales. Límite diario: <strong>1 premio por persona por día</strong> para validar las ofertas.
              </span>
            </span>
            <span className="font-bold text-emerald-400">Verificación 24 Horas Garantizada</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {prizes.map((prize) => {
              const canAfford = userProfile.boltCoins >= prize.costBolts;
              const progressPct = Math.min(100, Math.round((userProfile.boltCoins / prize.costBolts) * 100));

              return (
                <div
                  key={prize.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-amber-400/40 p-5 flex flex-col justify-between transition-all group shadow-xl"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-2xl shrink-0">
                        {prize.icon}
                      </div>

                      <div className="text-right">
                        <div className="text-amber-400 font-black text-base flex items-center gap-1 justify-end bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
                          <Zap className="w-4 h-4 fill-amber-400" />
                          <span>{prize.costBolts.toLocaleString()}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Rayos Bolt</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {prize.category}
                    </span>

                    <h3 className="font-extrabold text-base text-white mt-2 group-hover:text-amber-300 transition-colors">
                      {prize.title}
                    </h3>

                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {prize.instructions}
                    </p>

                    <div className="mt-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{prize.deliveryTime}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Progreso:</span>
                        <span className={canAfford ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                          {userProfile.boltCoins.toLocaleString()} / {prize.costBolts.toLocaleString()} ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {canAfford && !isDailyLimitReached
                        ? '¡Disponible para canjear!'
                        : isDailyLimitReached
                        ? 'Límite diario usado'
                        : `Faltan ${(prize.costBolts - userProfile.boltCoins).toLocaleString()} ⚡`}
                    </span>

                    <button
                      onClick={() => handleRedeemPrize(prize)}
                      disabled={!canAfford || isDailyLimitReached}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        canAfford && !isDailyLimitReached
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{canAfford && !isDailyLimitReached ? 'Canjear' : 'No disponible'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MIS CANJES (HISTORIAL EN FIREBASE) */}
      {activeTab === 'mis_canjes' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-amber-400" />
                  <span>Historial de Canjes Registrados en Firebase</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Tus solicitudes oficiales almacenadas en la nube. Olvis verificará tus puntos y entregará tu premio.
                </p>
              </div>

              {!userProfile.uid && (
                <button
                  onClick={onOpenAuthModal}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all cursor-pointer"
                >
                  Iniciar Sesión para Ver
                </button>
              )}
            </div>

            {userProfile.uid ? (
              redemptions.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <Gift className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white">Aún no tienes canjes registrados</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Completa tareas en el Muro de Desafíos, junta Rayos Bolt y canjea tu primer premio en la Tienda.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {redemptions.map((red) => (
                    <div
                      key={red.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black text-lg shrink-0">
                          🎁
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-white text-sm">{red.prizeTitle}</h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {red.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Destino / ID: <strong className="text-slate-200">{red.accountIdentifier}</strong> • Fecha: {new Date(red.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 fill-amber-400" /> {red.costBolts.toLocaleString()}
                          </span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                            red.status === 'entregado'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : red.status === 'cancelado'
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {red.status === 'entregado' ? '✓ Entregado' : red.status === 'cancelado' ? 'Cancelado' : '⏳ Pendiente (24h)'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-10 px-4 rounded-2xl bg-slate-950 border border-slate-800">
                <ShieldCheck className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-slate-300">
                  Inicia sesión con tu cuenta de Google (Gmail) para ver y gestionar tus canjes en la base de datos de Firebase.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Solicitud de Canje con ID del Jugador */}
      <RedemptionModal
        prize={selectedPrizeForRedemption}
        isOpen={Boolean(selectedPrizeForRedemption)}
        onClose={() => setSelectedPrizeForRedemption(null)}
        userProfile={userProfile}
        onSuccess={handleRedemptionSuccess}
      />
    </section>
  );
};
