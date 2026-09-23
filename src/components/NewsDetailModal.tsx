import React, { useState } from 'react';
import { X, Calendar, User, ThumbsUp, MessageSquare, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsDetailModalProps {
  newsItem: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddBoltCoins?: (amount: number) => void;
}

interface UserComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  newsItem,
  isOpen,
  onClose,
  onAddBoltCoins,
}) => {
  if (!isOpen || !newsItem) return null;

  const [comments, setComments] = useState<UserComment[]>([
    {
      id: 'c1',
      author: 'Gamer_Mateo_Bolt',
      avatar: '⚡',
      text: newsItem.game === 'fcmobile'
        ? '¡Qué buena noticia! Justo estaba ahorrando gemas para el evento TOTS. ¡Gracias Olvis!'
        : '¡Ya canjeé los códigos y me dieron el accesorio para mi avatar! Saludos al clan.',
      time: 'Hace 2 horas',
      likes: 5,
    },
    {
      id: 'c2',
      author: 'Santy_Roblox_Pro',
      avatar: '🎮',
      text: '¿Cuándo hacemos el torneo del clan este fin de semana? ¡Quiero participar!',
      time: 'Hace 4 horas',
      likes: 8,
    },
  ]);

  const [newCommentText, setNewCommentText] = useState('');

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: UserComment = {
      id: `c-${Date.now()}`,
      author: 'Tú (Miembro Bolt)',
      avatar: '🌟',
      text: newCommentText.trim(),
      time: 'Justo ahora',
      likes: 1,
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    if (onAddBoltCoins) {
      onAddBoltCoins(10); // Reward for participating in the community!
    }
  };

  const handleLike = (commentId: string) => {
    setComments(
      comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <div
      id="news-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                newsItem.game === 'fcmobile'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}
            >
              {newsItem.game === 'fcmobile' ? '⚽ FC Mobile' : '🟥 Roblox'}
            </span>
            <span className="text-xs text-slate-400">• {newsItem.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Header Image */}
          <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden">
            <img
              src={newsItem.imageUrl}
              alt={newsItem.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {newsItem.title}
              </h2>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                {newsItem.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {newsItem.date}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Informe Exclusivo Olvis Bolt</span>
            </div>
          </div>

          {/* Resumen Importante y Destacado */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-800/90 to-slate-900 border-2 border-amber-400/40 shadow-xl space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-black text-xs sm:text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Resumen Importante de la Noticia</span>
            </div>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed font-semibold">
              {newsItem.summary}
            </p>
          </div>

          {/* Main Article Content */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
            {newsItem.content}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {newsItem.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comments Section */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Comentarios de la Comunidad ({comments.length})</span>
              </h3>
              <span className="text-xs text-emerald-400 font-semibold">+10 Rayos por comentar</span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Escribe un mensaje para Olvis y la comunidad..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                      {comment.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{comment.author}</span>
                        <span className="text-[10px] text-slate-500">{comment.time}</span>
                      </div>
                      <p className="text-slate-300 mt-1">{comment.text}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px]"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
