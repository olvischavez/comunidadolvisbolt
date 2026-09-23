import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Zap } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGame: 'fcmobile' | 'roblox';
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  activeGame,
}) => {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `¡Hola gamer! Soy el Asistente Inteligente de la Comunidad Olvis Bolt. ¿Tienes alguna duda sobre tácticas de FC Mobile, cartas de jugadores o secretos de Roblox? ¡Pregúntame lo que quieras!`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: userText },
    ]);
    setLoading(true);

    // Generate smart gaming reply instantly without server dependency
    setTimeout(() => {
      let reply = '';
      const q = userText.toLowerCase();

      if (activeGame === 'fcmobile') {
        if (q.includes('moneda') || q.includes('plata') || q.includes('millon') || q.includes('trade')) {
          reply = '🪙 Para ganar monedas en FC Mobile: Revisa la sección de Noticias de la app los martes y miércoles. Compra cartas de 96 a 99 OVR baratas antes del reinicio de intercambios de los jueves y véndelas cuando suba la demanda.';
        } else if (q.includes('formacion') || q.includes('tactica') || q.includes('alineacion')) {
          reply = '⚽ Táctica recomendada por Olvis Bolt: La 4-3-3 Ofensiva o 4-1-2-1-2 Estrecha. Con el reciente nerf a los centros, la creación de juego por el mediocampo y los pases al hueco rasos son los más efectivos en H2H.';
        } else if (q.includes('rango') || q.includes('mascherano') || q.includes('dudek')) {
          reply = '⭐ Consejo de Rangos: ¡Nunca arriesgues tus Mascherano al 50%! Guarda siempre 5 cartas para el Rango Rojo al 100% de probabilidad garantizada para no perder tus comodines.';
        } else {
          reply = `¡Buena pregunta sobre FC Mobile! Te sugiero completar los 3 partidos de habilidad diarios para juntar puntos de evento y canjear tus recompensas en la Comunidad Olvis Bolt.`;
        }
      } else {
        if (q.includes('robux') || q.includes('gratis') || q.includes('premio')) {
          reply = '💎 En la Comunidad Olvis Bolt puedes ganar Robux canjeando tus Bolt Coins en la pestaña de "Premios". ¡Completa desafíos y mantén tu racha diaria activa!';
        } else if (q.includes('codigo') || q.includes('code') || q.includes('promocod')) {
          reply = '🎁 Los códigos activos verificados de Roblox están disponibles arriba en la pestaña "Roblox > Códigos Activos". Cópialos con 1 toque antes de que caduquen.';
        } else {
          reply = `🎮 ¡Excelente consulta de Roblox! Recuerda unirte a servidores oficiales con los miembros del clan y nunca compartir tu contraseña. ¡Sigue apoyando a Olvis Bolt!`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'ai',
          text: reply,
        },
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div
      id="ai-assistant-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>Asistente Gamer Olvis Bolt</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                  IA
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Especialista en FC Mobile y Roblox</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-amber-400 border border-amber-400/30'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-400 text-slate-950 font-bold rounded-tr-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Pensando la mejor táctica para ti...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Pregunta sobre FC Mobile, jugadores o Roblox..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
