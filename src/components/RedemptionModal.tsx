import React, { useState } from 'react';
import { X, Gift, Zap, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { RewardPrize, UserCommunityProfile } from '../types';
import { redeemPrizeInFirestore } from '../firebase';

interface RedemptionModalProps {
  prize: RewardPrize | null;
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserCommunityProfile;
  onSuccess: (remainingBolts: number, message: string) => void;
}

export const RedemptionModal: React.FC<RedemptionModalProps> = ({
  prize,
  isOpen,
  onClose,
  userProfile,
  onSuccess,
}) => {
  const [accountIdentifier, setAccountIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !prize) return null;

  const isRoblox = prize.category.toLowerCase().includes('roblox') || prize.category.toLowerCase().includes('robux');
  const idLabel = isRoblox ? 'Tu Nombre de Usuario en Roblox' : 'Tu UID de FC Mobile (o correo EA)';
  const idPlaceholder = isRoblox ? 'Ejemplo: OlvisGamer99' : 'Ejemplo: 92837192830';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountIdentifier.trim()) {
      setErrorMessage(`Por favor escribe ${idLabel.toLowerCase()} para poder entregarte el premio.`);
      return;
    }

    if (!userProfile.uid) {
      setErrorMessage('Debes iniciar sesión con Google para registrar tu canje.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await redeemPrizeInFirestore({
        userId: userProfile.uid,
        userEmail: userProfile.email || '',
        userName: userProfile.name,
        prizeId: prize.id,
        prizeTitle: prize.title,
        costBolts: prize.costBolts,
        category: prize.category,
        accountIdentifier: accountIdentifier.trim(),
      });

      if (res.success) {
        onSuccess(res.remainingBolts ?? (userProfile.boltCoins - prize.costBolts), res.message);
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      console.error('Error al canjear:', err);
      setErrorMessage(err.message || 'Error al procesar el canje en la base de datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black text-2xl">
            {prize.icon || '🎁'}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {prize.category}
            </span>
            <h2 className="text-xl font-black text-white mt-1">{prize.title}</h2>
          </div>
        </div>

        {/* Anti-abuse notice */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Regla de la Comunidad:</strong> Máximo <strong>1 canje diario</strong> por miembro. Se guardará de forma oficial en la base de datos de Firebase.
          </span>
        </div>

        {/* Cost & Delivery info */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-slate-400 block mb-0.5">Costo del Premio</span>
            <div className="text-amber-400 font-extrabold text-sm flex items-center gap-1">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>{prize.costBolts.toLocaleString()} Rayos</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-slate-400 block mb-0.5">Tiempo de Entrega</span>
            <div className="text-slate-200 font-bold text-xs flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{prize.deliveryTime}</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              {idLabel} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={accountIdentifier}
              onChange={(e) => setAccountIdentifier(e.target.value)}
              placeholder={idPlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-white text-sm placeholder:text-slate-600 font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {isRoblox
                ? 'Ingresa tu usuario exacto de Roblox para enviarte el pase o los Robux.'
                : 'Asegúrate de que tu UID sea el correcto para no enviar el premio a otra cuenta.'}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Gift className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Guardando en Base de Datos...' : 'Confirmar y Solicitar Canje'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
