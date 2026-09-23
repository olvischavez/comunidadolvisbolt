import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Zap, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { loginWithGoogle } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setNoticeMessage(null);
      await loginWithGoogle();
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // Expected user cancellation or dismissed window - do NOT log as console.error
        console.info('Inicio de sesión cancelado o ventana cerrada por el usuario.');
        setNoticeMessage('La ventana de Google se cerró antes de seleccionar una cuenta. Puedes volver a hacer clic cuando quieras continuar.');
      } else if (code === 'auth/popup-blocked') {
        console.warn('Ventana emergente bloqueada por el navegador.');
        setErrorMessage('El navegador bloqueó la ventana emergente de Google. Permite las ventanas emergentes (pop-ups) para este sitio o abre la app en una nueva pestaña.');
      } else if (code === 'auth/unauthorized-domain') {
        console.warn('Dominio no autorizado en Firebase:', window.location.hostname);
        setErrorMessage(`El dominio "${window.location.hostname}" no está registrado en los dominios autorizados de Firebase.`);
      } else if (code === 'auth/network-request-failed') {
        console.warn('Error de red al conectar con Google:', err);
        setErrorMessage('Problema de conexión con Google. Revisa tu internet e inténtalo de nuevo.');
      } else {
        console.error('Error al iniciar sesión con Google:', err);
        setErrorMessage(err.message || 'Error al conectar con Google. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl mb-3 shadow-inner">
            ⚡
          </div>
          <h2 className="text-2xl font-black text-white">Únete a la Comunidad</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Inicia sesión con tu cuenta de <strong>Google (Gmail)</strong> para guardar tus <strong>Rayos Bolt</strong> de forma segura en la base de datos y canjear premios.
          </p>
        </div>

        {/* Welcome Gift Badge */}
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
            <Zap className="w-4 h-4 fill-slate-950" />
          </div>
          <div className="text-left text-xs">
            <span className="font-extrabold text-amber-300 block">¡Bono de Bienvenida Gratis!</span>
            <span className="text-slate-300">Recibe <strong>+150 Rayos Bolt</strong> al registrarte con tu correo de Gmail.</span>
          </div>
        </div>

        {/* Informative notice message (e.g. user closed popup) */}
        {noticeMessage && (
          <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Login Button */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isLoading ? 'Conectando con Google...' : 'Continuar con Google (Gmail)'}</span>
          </button>

          {isInIframe && (
            <div className="mt-3 text-center">
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>¿Problemas en la vista previa? Abrir app en pestaña nueva</span>
              </a>
            </div>
          )}
        </div>

        {/* Security note */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Acceso seguro mediante Google Identity y Firebase Auth.</span>
        </div>
      </div>
    </div>
  );
};
