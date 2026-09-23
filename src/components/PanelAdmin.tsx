import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Crown,
  Gift,
  Zap,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Sliders,
  Sparkles,
  PlusCircle,
  AlertTriangle,
  LogOut,
  Trash2,
  Flame,
  Tag,
  Gamepad2,
  FileText,
  KeyRound,
} from 'lucide-react';
import { UserCommunityProfile, PrizeRedemption, AdConfiguration, NewsItem, PromoCode } from '../types';
import {
  getAllRedemptionsForAdmin,
  updateRedemptionStatus,
  getAllUsersForAdmin,
  grantBoltsToUserByAdmin,
  publishNewsToFirestore,
  deleteNewsFromFirestore,
  publishPromoCodeToFirestore,
  deletePromoCodeFromFirestore,
} from '../firebase';

interface PanelAdminProps {
  adminProfile: UserCommunityProfile;
  adConfig: AdConfiguration;
  allNews: NewsItem[];
  promoCodes: PromoCode[];
  onSaveAdConfig: (newConfig: AdConfiguration) => void;
  onNewsUpdated?: () => void;
  onCodesUpdated?: () => void;
  onLogout?: () => void;
}

export const PanelAdmin: React.FC<PanelAdminProps> = ({
  adminProfile,
  adConfig,
  allNews,
  promoCodes,
  onSaveAdConfig,
  onNewsUpdated,
  onCodesUpdated,
  onLogout,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'canjes' | 'usuarios' | 'noticias' | 'codigos' | 'configuracion'>('canjes');
  const [redemptions, setRedemptions] = useState<PrizeRedemption[]>([]);
  const [users, setUsers] = useState<UserCommunityProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendiente' | 'entregado' | 'cancelado'>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual grant bolts modal state
  const [selectedUserForBolts, setSelectedUserForBolts] = useState<UserCommunityProfile | null>(null);
  const [boltsAmountToAdd, setBoltsAmountToAdd] = useState<number>(250);
  const [isGrantingBolts, setIsGrantingBolts] = useState<boolean>(false);

  // News publishing state
  const [newsGame, setNewsGame] = useState<'fcmobile' | 'roblox'>('fcmobile');
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Actualización');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&auto=format&fit=crop');
  const [newsFeatured, setNewsFeatured] = useState<boolean>(true);
  const [isPublishingNews, setIsPublishingNews] = useState<boolean>(false);

  // Code publishing state
  const [codeGame, setCodeGame] = useState<'fcmobile' | 'roblox'>('fcmobile');
  const [codeText, setCodeText] = useState('');
  const [codeReward, setCodeReward] = useState('');
  const [codeStatus, setCodeStatus] = useState<'active' | 'exclusive'>('active');
  const [codeExpiry, setCodeExpiry] = useState('Activo');
  const [codeInstructions, setCodeInstructions] = useState('Canjear en la plataforma oficial del juego.');
  const [isPublishingCode, setIsPublishingCode] = useState<boolean>(false);

  // Temp offerwall URL
  const [tempOfferwallUrl, setTempOfferwallUrl] = useState(adConfig.offerwallUrl || '');

  useEffect(() => {
    if (adConfig.offerwallUrl) {
      setTempOfferwallUrl(adConfig.offerwallUrl);
    }
  }, [adConfig.offerwallUrl]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [reds, userList] = await Promise.all([
        getAllRedemptionsForAdmin(),
        getAllUsersForAdmin(adminProfile),
      ]);
      setRedemptions(reds);
      setUsers(userList);
    } catch (err) {
      console.error('Error cargando datos de admin:', err);
      showToast('Error cargando información de la base de datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCopyIdentifier = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
    showToast(`Copiado al portapapeles: "${text}"`);
  };

  const handleUpdateStatus = async (
    redemption: PrizeRedemption,
    newStatus: 'entregado' | 'cancelado'
  ) => {
    const confirmText =
      newStatus === 'entregado'
        ? `¿Marcar como entregado el premio "${redemption.prizeTitle}" para ${redemption.userName}?`
        : `¿Cancelar el canje y REEMBOLSAR ${redemption.costBolts} Rayos a ${redemption.userName}?`;

    if (!window.confirm(confirmText)) return;

    const res = await updateRedemptionStatus(
      redemption.id,
      newStatus,
      redemption.userId,
      redemption.costBolts
    );

    if (res.success) {
      showToast(res.message);
      setRedemptions((prev) =>
        prev.map((r) => (r.id === redemption.id ? { ...r, status: newStatus } : r))
      );
      if (newStatus === 'cancelado') {
        loadAdminData();
      }
    } else {
      showToast(res.message);
    }
  };

  const handleGrantBolts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBolts || boltsAmountToAdd === 0) return;

    setIsGrantingBolts(true);
    try {
      const res = await grantBoltsToUserByAdmin(selectedUserForBolts.uid || selectedUserForBolts.id, boltsAmountToAdd);
      if (res.success) {
        showToast(res.message);
        setSelectedUserForBolts(null);
        setBoltsAmountToAdd(250);
        loadAdminData();
      } else {
        showToast(res.message);
      }
    } catch (err: any) {
      showToast(err.message || 'Error al modificar rayos');
    } finally {
      setIsGrantingBolts(false);
    }
  };

  // Quick preset news templates
  const applyNewsTemplate = (type: string) => {
    if (type === 'fcm_market') {
      setNewsGame('fcmobile');
      setNewsCategory('Mercado y Tradéos');
      setNewsTitle('Filtración de Requisitos de Intercambio: Jugadores que subirán este Jueves');
      setNewsSummary('📌 RESUMEN CLAVE: 1) Los intercambios del fin de semana requerirán cartas de 96 a 99 OVR de ligas principales. 2) Comprar extremos baratos antes del reseteo para venderlos con 40% de ganancia. 3) Guardar Mascherano para los nuevos Iconos Prime.');
      setNewsContent('Informe Oficial de Olvis Bolt para la Comunidad:\n\nRecomendaciones de Mercado para hoy:\n• Revisa los requisitos de intercambio en el menú antes del reseteo del jueves.\n• Adquiere cartas de 96-98 OVR que estén al valor mínimo del mercado; la demanda aumentará un 35%.\n• No gastes monedas en sobres no garantizados; guarda tu balance para la rotación de fin de semana.');
      setNewsImageUrl('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop');
      setNewsFeatured(true);
      showToast('Plantilla aplicada: Tradéos FC Mobile');
    } else if (type === 'fcm_patch') {
      setNewsGame('fcmobile');
      setNewsCategory('Actualización Gameplay');
      setNewsTitle('Nueva Actualización de Gameplay: Ajustes a Pases Filtrados y Nerf a Centros');
      setNewsSummary('📌 RESUMEN CLAVE: 1) Los defensores centrales reaccionan un 20% más rápido ante centros aéreos. 2) Los pases rasos al hueco tienen mayor precisión en contragolpes. 3) Formación recomendada: 4-3-3 Ofensiva o 4-1-2-1-2 Estrecha.');
      setNewsContent('Análisis Táctico de Olvis Bolt:\n\nLa nueva actualización de FC Mobile premia el juego elaborado por el medio campo.\n• Los centros repetitivos ya no son infalibles; los porteros cortan centros lejanos con mayor efectividad.\n• Los regates de cambio de banda y ruleta se ejecutan con mayor fluidez.\n• Recomendamos entrenar la química de tus mediocampistas para dominar el modo Cara a Cara (H2H).');
      setNewsImageUrl('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop');
      setNewsFeatured(true);
      showToast('Plantilla aplicada: Gameplay FC Mobile');
    } else if (type === 'rbx_hunt') {
      setNewsGame('roblox');
      setNewsCategory('Objetos Gratuitos');
      setNewsTitle('Evento Global de Roblox: Nuevos Accesorios Míticos Gratis para tu Avatar');
      setNewsSummary('📌 RESUMEN CLAVE: 1) Desbloquea alas holográficas y coronas cibernéticas sin gastar Robux. 2) Misiones rápidas completables en 30 minutos. 3) Servidores privados abiertos para miembros de la comunidad.');
      setNewsContent('Guía Oficial de Recompensas de Roblox:\n\nYa están disponibles los nuevos cosméticos gratuitos para tu personaje.\n• Visita las experiencias verificadas del evento oficial.\n• Completa las insignias en orden para recibir los códigos de accesorios 3D.\n• Recuerda que en nuestro clan organizamos partidas grupales para conseguir las insignias juntos.');
      setNewsImageUrl('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop');
      setNewsFeatured(true);
      showToast('Plantilla aplicada: Roblox Gratis');
    } else if (type === 'rbx_update') {
      setNewsGame('roblox');
      setNewsCategory('Juegos en Tendencia');
      setNewsTitle('Actualización de Juegos Populares: Nuevas Frutas, Jefes y Códigos de 2X EXP');
      setNewsSummary('📌 RESUMEN CLAVE: 1) Nuevas habilidades despertadas y zonas de combate para explorar. 2) Códigos de doble maestría activos por 72 horas. 3) Servidores VIP gratuitos provistos por Olvis Bolt.');
      setNewsContent('Informe de Juegos en Tendencia:\n\nGrandes novedades en las experiencias favoritas del clan.\n• Aprovecha los códigos de experiencia doble disponibles en nuestra pestaña de códigos.\n• No aceptes intercambios con enlaces externos para proteger tu cuenta de robos.\n• ¡Apoya a la comunidad completando tareas en el panel de premios para conseguir tarjetas de Robux!');
      setNewsImageUrl('https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop');
      setNewsFeatured(false);
      showToast('Plantilla aplicada: Juegos Populares Roblox');
    } else if (type === 'notice') {
      setNewsCategory('Comunicado Oficial');
      setNewsTitle('¡Gran Torneo de Fin de Semana en la Comunidad Olvis Bolt!');
      setNewsSummary('📌 RESUMEN CLAVE: 1) Torneo amistoso con transmisión en directo para los 30 miembros. 2) Premios en Rayos Bolt y tarjetas de regalo para los mejores jugadores. 3) Inscripción gratuita confirmando asistencia.');
      setNewsContent('COMUNICADO OFICIAL DE OLVIS BOLT:\n\n¡Hola a todos los miembros de la comunidad!\nEste sábado organizaremos partidas amistosas de FC Mobile y Roblox con premios para los participantes.\n\n• Sigue acumulando tus Rayos Bolt diarios entrando a la plataforma.\n• Consulta la pestaña de Premios para canjear tus recompensas en menos de 24 horas.');
      setNewsImageUrl('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop');
      setNewsFeatured(true);
      showToast('Plantilla aplicada: Comunicado Oficial');
    }
  };

  // Quick promo code templates
  const applyCodeTemplate = (type: string) => {
    if (type === 'fcm_pack') {
      setCodeGame('fcmobile');
      setCodeText('FCMOBILE2026PACK');
      setCodeReward('Sobre Oro Garantizado + 1.000 Gemas');
      setCodeStatus('active');
      setCodeExpiry('30 Oct 2026');
      setCodeInstructions('Canjear en la app: Ajustes > Códigos promocionales o en redeem.fcmobile.ea.com');
      showToast('Plantilla aplicada: Sobre Oro FC Mobile');
    } else if (type === 'fcm_coins') {
      setCodeGame('fcmobile');
      setCodeText('BOLTVIPFCM');
      setCodeReward('500.000 Monedas + Potenciador de Rango');
      setCodeStatus('exclusive');
      setCodeExpiry('15 Nov 2026');
      setCodeInstructions('Exclusivo para miembros activos de la Comunidad Olvis Bolt.');
      showToast('Plantilla aplicada: Monedas FC Mobile');
    } else if (type === 'rbx_item') {
      setCodeGame('roblox');
      setCodeText('SPIDERCOLA');
      setCodeReward('Mascota de hombro Araña Cola (Accesorio Gratis)');
      setCodeStatus('active');
      setCodeExpiry('Permanente');
      setCodeInstructions('Canjear en roblox.com/redeem con tu cuenta iniciada.');
      showToast('Plantilla aplicada: Mascota Roblox');
    } else if (type === 'rbx_exp') {
      setCodeGame('roblox');
      setCodeText('EXP2XDRAGON');
      setCodeReward('20 Minutos de Doble Experiencia y Reinicio de Estadísticas');
      setCodeStatus('active');
      setCodeExpiry('Próxima actualización');
      setCodeInstructions('Canjear dentro del menú de códigos del juego.');
      showToast('Plantilla aplicada: EXP 2X Roblox');
    }
  };

  const handlePublishNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim()) {
      showToast('Completa el título y el resumen de la noticia.');
      return;
    }

    setIsPublishingNews(true);
    try {
      const res = await publishNewsToFirestore({
        game: newsGame,
        title: newsTitle.trim(),
        summary: newsSummary.trim(),
        content: newsContent.trim() || newsSummary.trim(),
        category: newsCategory.trim() || 'Actualización',
        date: 'Hoy (Oficial)',
        author: 'Olvis Bolt (Dueño)',
        imageUrl: newsImageUrl.trim() || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&auto=format&fit=crop',
        sourceUrl: '#comunicado-olvis-bolt',
        featured: newsFeatured,
        tags: [newsGame === 'fcmobile' ? 'FC Mobile' : 'Roblox', 'Comunidad Bolt', newsCategory.trim()],
        commentsCount: 15,
      });

      if (res.success) {
        showToast(res.message);
        setNewsTitle('');
        setNewsSummary('');
        setNewsContent('');
        if (onNewsUpdated) onNewsUpdated();
      } else {
        showToast(res.message);
      }
    } catch (err: any) {
      showToast(err.message || 'Error al publicar la noticia en Firestore');
    } finally {
      setIsPublishingNews(false);
    }
  };

  const handleDeleteNews = async (newsId: string, title: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la noticia "${title}" de la base de datos?`)) return;
    try {
      const success = await deleteNewsFromFirestore(newsId);
      if (success) {
        showToast('Noticia eliminada con éxito de Firestore.');
        if (onNewsUpdated) onNewsUpdated();
      } else {
        showToast('No se pudo eliminar la noticia.');
      }
    } catch {
      showToast('Error al eliminar la noticia.');
    }
  };

  const handlePublishCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeText.trim() || !codeReward.trim()) {
      showToast('Completa el código y la recompensa.');
      return;
    }

    setIsPublishingCode(true);
    try {
      const res = await publishPromoCodeToFirestore({
        code: codeText.trim().toUpperCase(),
        game: codeGame,
        reward: codeReward.trim(),
        status: codeStatus,
        expiryDate: codeExpiry.trim() || 'Activo',
        verifiedDate: 'Hoy',
        instructions: codeInstructions.trim() || 'Canjear en la plataforma oficial',
      });

      if (res.success) {
        showToast(res.message);
        setCodeText('');
        setCodeReward('');
        if (onCodesUpdated) onCodesUpdated();
      } else {
        showToast(res.message);
      }
    } catch (err: any) {
      showToast(err.message || 'Error al guardar el código en Firestore');
    } finally {
      setIsPublishingCode(false);
    }
  };

  const handleDeleteCode = async (codeId: string, codeStr: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el código "${codeStr}" de la base de datos?`)) return;
    try {
      const success = await deletePromoCodeFromFirestore(codeId);
      if (success) {
        showToast(`Código "${codeStr}" eliminado con éxito.`);
        if (onCodesUpdated) onCodesUpdated();
      } else {
        showToast('No se pudo eliminar el código.');
      }
    } catch {
      showToast('Error al eliminar el código.');
    }
  };

  // Metrics calculations
  const pendingCount = redemptions.filter((r) => r.status === 'pendiente').length;
  const deliveredCount = redemptions.filter((r) => r.status === 'entregado').length;
  const totalBoltsCirculating = users.reduce((acc, u) => acc + (u.boltCoins || 0), 0);

  // Filtered redemptions
  const filteredRedemptions = redemptions.filter((r) => {
    const matchesStatus = filterStatus === 'todos' || r.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      r.userName.toLowerCase().includes(query) ||
      r.userEmail.toLowerCase().includes(query) ||
      r.accountIdentifier.toLowerCase().includes(query) ||
      r.prizeTitle.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in" aria-label="Panel Administrador">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Crown className="w-5 h-5 fill-slate-950 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-950 border-2 border-amber-400/60 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shrink-0">
              <Crown className="w-9 h-9 fill-slate-950 text-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Crown className="w-3.5 h-3.5 fill-slate-950" /> DUEÑO & ADMINISTRADOR
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
                  {adminProfile.email}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Panel Maestro de Control • Olvis Bolt
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Control exclusivo de entregas de Robux y FC Mobile, publicación diaria de noticias y eventos a Firestore, códigos activos y miembros del clan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={loadAdminData}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Refrescar Datos</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Cerrar sesión de Administrador"
                className="px-3.5 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30">
            <span className="text-[11px] text-amber-300 font-bold block mb-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Canjes Pendientes
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {pendingCount}
            </div>
            <span className="text-[10px] text-slate-400">Por entregar en 24h</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
            <span className="text-[11px] text-emerald-300 font-bold block mb-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Canjes Entregados
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {deliveredCount}
            </div>
            <span className="text-[10px] text-slate-400">Completados con éxito</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-bold block mb-0.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-400" /> Miembros en Firebase
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {users.length}
            </div>
            <span className="text-[10px] text-slate-400">Cuentas con Google</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-bold block mb-0.5 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Rayos en Circulación
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {totalBoltsCirculating.toLocaleString()} ⚡
            </div>
            <span className="text-[10px] text-slate-400">En balances de usuarios</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 w-full">
        <button
          onClick={() => setActiveAdminTab('canjes')}
          className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
            activeAdminTab === 'canjes'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4 shrink-0" />
          <span className="truncate">Canjes ({pendingCount})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('usuarios')}
          className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
            activeAdminTab === 'usuarios'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span className="truncate">Miembros ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('noticias')}
          className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
            activeAdminTab === 'noticias'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span className="truncate">Noticias Diarias</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('codigos')}
          className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
            activeAdminTab === 'codigos'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4 shrink-0" />
          <span className="truncate">Códigos Diarios</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('configuracion')}
          className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center col-span-2 md:col-span-1 ${
            activeAdminTab === 'configuracion'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4 shrink-0" />
          <span className="truncate">Ajustes Muro</span>
        </button>
      </div>

      {/* TAB 1: GESTIÓN DE CANJES */}
      {activeAdminTab === 'canjes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full sm:w-auto">
              {(['todos', 'pendiente', 'entregado', 'cancelado'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    filterStatus === st
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por usuario, correo, ID o premio..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {filteredRedemptions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
              <Gift className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No hay canjes con este filtro</h3>
              <p className="text-xs text-slate-400 mt-1">
                Cuando los 30 chicos canjeen Robux o paquetes de FC Mobile con sus Rayos Bolt, aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRedemptions.map((redemption) => (
                <div
                  key={redemption.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    redemption.status === 'pendiente'
                      ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : redemption.status === 'entregado'
                      ? 'bg-slate-900/60 border-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            redemption.status === 'pendiente'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                              : redemption.status === 'entregado'
                              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                              : 'bg-red-400/20 text-red-300 border border-red-400/40'
                          }`}
                        >
                          {redemption.status === 'pendiente'
                            ? '⏳ Pendiente de Entrega'
                            : redemption.status === 'entregado'
                            ? '✅ Entregado'
                            : '❌ Cancelado'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(redemption.createdAt).toLocaleString('es-ES', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                          {redemption.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-black text-white flex items-center gap-2">
                          <span>{redemption.prizeTitle}</span>
                          <span className="text-xs font-bold text-amber-400 font-mono">
                            ({redemption.costBolts.toLocaleString()} ⚡)
                          </span>
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 flex-wrap">
                          <span>
                            Solicitante: <strong className="text-white">{redemption.userName}</strong>
                          </span>
                          <span>•</span>
                          <span className="text-slate-400 font-mono">{redemption.userEmail}</span>
                        </div>
                      </div>

                      {/* Account Identifier to deliver */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 max-w-xl">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 block">
                            {redemption.category === 'Robux' ? 'Usuario de Roblox para entrega:' : 'ID de FC Mobile / UID:'}
                          </span>
                          <span className="font-mono text-xs text-white font-bold break-all select-all">
                            {redemption.accountIdentifier}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyIdentifier(redemption.accountIdentifier, redemption.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          {copiedId === redemption.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar ID</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {redemption.status === 'pendiente' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(redemption, 'entregado')}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Marcar Entregado</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(redemption, 'cancelado')}
                            className="px-3 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Rechazar & Reembolsar</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MIEMBROS DE LA COMUNIDAD */}
      {activeAdminTab === 'usuarios' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" /> Miembros Registrados ({users.length})
              </h3>
              <p className="text-xs text-slate-400">
                Puedes ver el balance de Rayos Bolt de cada chico y añadir rayos manualmente de recompensa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-white truncate">
                      {u.name && u.name !== 'Miembro Bolt' && u.name !== 'Miembro'
                        ? u.name
                        : (u.email ? u.email.split('@')[0] : 'Usuario')}
                    </h4>
                    <p className="text-[11px] text-amber-300/80 font-mono truncate">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-amber-400 font-mono">
                        {u.boltCoins.toLocaleString()} ⚡
                      </span>
                      <span className="text-[10px] text-slate-500">Nivel {u.level}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUserForBolts(u)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Dar ⚡</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PUBLICAR NOTICIAS DIARIAS */}
      {activeAdminTab === 'noticias' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Publicador Rápido de Noticias Diarias</h3>
                <p className="text-xs text-slate-400">
                  Publica eventos, análisis de jugabilidad y avisos directamente en Firestore. Aparecen de inmediato en el panel de todos los usuarios.
                </p>
              </div>
            </div>

            {/* Plantillas Rápidas con 1 Toque */}
            <div className="mb-5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-black uppercase text-amber-400 block mb-2">
                ⚡ Plantillas de 1 Clic para Publicar Rápido:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyNewsTemplate('fcm_market')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer transition-all"
                >
                  ⚽ Tradéos & Mercado FC Mobile
                </button>
                <button
                  type="button"
                  onClick={() => applyNewsTemplate('fcm_patch')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer transition-all"
                >
                  ⚽ Parche & Gameplay FC Mobile
                </button>
                <button
                  type="button"
                  onClick={() => applyNewsTemplate('rbx_hunt')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-500/40 text-red-300 text-xs font-bold cursor-pointer transition-all"
                >
                  🟥 Objetos Gratis Roblox
                </button>
                <button
                  type="button"
                  onClick={() => applyNewsTemplate('rbx_update')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-500/40 text-red-300 text-xs font-bold cursor-pointer transition-all"
                >
                  🟥 Actualización Juegos Roblox
                </button>
                <button
                  type="button"
                  onClick={() => applyNewsTemplate('notice')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer transition-all"
                >
                  👑 Torneo / Comunicado Olvis Bolt
                </button>
              </div>
            </div>

            <form onSubmit={handlePublishNewsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Juego Destino</label>
                  <select
                    value={newsGame}
                    onChange={(e) => setNewsGame(e.target.value as 'fcmobile' | 'roblox')}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  >
                    <option value="fcmobile">⚽ FC Mobile</option>
                    <option value="roblox">🟥 Roblox</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Categoría</label>
                  <input
                    type="text"
                    required
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    placeholder="Ej: Mercado, Eventos, Gameplay..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Destacado en Portada</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newsFeatured}
                      onChange={(e) => setNewsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-400 focus:ring-0"
                    />
                    <span className="text-xs text-slate-200 font-medium">Mostrar con estrella dorada ⭐</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Título de la Noticia</label>
                <input
                  type="text"
                  required
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Ej: Nueva Filtración del Mercado: Cartas que subirán de precio"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Resumen Clave (Se muestra en la tarjeta del panel)
                </label>
                <textarea
                  rows={3}
                  required
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  placeholder="📌 RESUMEN CLAVE: 1) Punto uno... 2) Punto dos... 3) Recomendación de Olvis Bolt..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Contenido Detallado / Guía Completa (Opcional)
                </label>
                <textarea
                  rows={4}
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Escribe la guía o informe detallado..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={newsImageUrl}
                  onChange={(e) => setNewsImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isPublishingNews}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md hover:from-amber-300 cursor-pointer disabled:opacity-50"
                >
                  {isPublishingNews ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Publicar Noticia en Firestore</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Published News */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Noticias Publicadas en la Comunidad ({allNews.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allNews.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {n.game === 'fcmobile' ? '⚽ FC Mobile' : '🟥 Roblox'} • {n.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{n.date}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white line-clamp-2">{n.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.summary}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">ID: {n.id}</span>
                    <button
                      onClick={() => handleDeleteNews(n.id, n.title)}
                      className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PUBLICAR CÓDIGOS DIARIOS */}
      {activeAdminTab === 'codigos' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Publicador de Códigos Promocionales</h3>
                <p className="text-xs text-slate-400">
                  Agrega nuevos códigos oficiales de FC Mobile o Roblox para que los miembros los copien con 1 toque.
                </p>
              </div>
            </div>

            {/* Plantillas Rápidas con 1 Toque */}
            <div className="mb-5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-black uppercase text-amber-400 block mb-2">
                ⚡ Plantillas de 1 Clic para Códigos:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyCodeTemplate('fcm_pack')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer transition-all"
                >
                  ⚽ FC Mobile: Sobre Oro + Gemas
                </button>
                <button
                  type="button"
                  onClick={() => applyCodeTemplate('fcm_coins')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer transition-all"
                >
                  ⚽ FC Mobile: 500k Monedas Exclusivo
                </button>
                <button
                  type="button"
                  onClick={() => applyCodeTemplate('rbx_item')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-500/40 text-red-300 text-xs font-bold cursor-pointer transition-all"
                >
                  🟥 Roblox: Mascota Gratis
                </button>
                <button
                  type="button"
                  onClick={() => applyCodeTemplate('rbx_exp')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-500/40 text-red-300 text-xs font-bold cursor-pointer transition-all"
                >
                  🟥 Roblox: Doble EXP 2X
                </button>
              </div>
            </div>

            <form onSubmit={handlePublishCodeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Juego Destino</label>
                  <select
                    value={codeGame}
                    onChange={(e) => setCodeGame(e.target.value as 'fcmobile' | 'roblox')}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  >
                    <option value="fcmobile">⚽ FC Mobile</option>
                    <option value="roblox">🟥 Roblox</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tipo / Estado</label>
                  <select
                    value={codeStatus}
                    onChange={(e) => setCodeStatus(e.target.value as 'active' | 'exclusive')}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  >
                    <option value="active">✅ Código Activo General</option>
                    <option value="exclusive">⭐ Exclusivo Comunidad Olvis Bolt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Fecha de Expiración</label>
                  <input
                    type="text"
                    value={codeExpiry}
                    onChange={(e) => setCodeExpiry(e.target.value)}
                    placeholder="Ej: 30 Octubre 2026 o Permanente"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Código Promocional</label>
                  <input
                    type="text"
                    required
                    value={codeText}
                    onChange={(e) => setCodeText(e.target.value.toUpperCase())}
                    placeholder="Ej: FCMOBILE2026PACK"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-amber-400 font-mono font-black focus:outline-none focus:border-amber-400 tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Recompensa Otorgada</label>
                  <input
                    type="text"
                    required
                    value={codeReward}
                    onChange={(e) => setCodeReward(e.target.value)}
                    placeholder="Ej: Sobre Oro Garantizado + 1.000 Gemas"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Instrucciones de Canje</label>
                <input
                  type="text"
                  value={codeInstructions}
                  onChange={(e) => setCodeInstructions(e.target.value)}
                  placeholder="Ej: Canjear en la app en Ajustes > Códigos o en roblox.com/redeem"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isPublishingCode}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md hover:from-amber-300 cursor-pointer disabled:opacity-50"
                >
                  {isPublishingCode ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <KeyRound className="w-4 h-4" />
                  )}
                  <span>Publicar Código en Firestore</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Promo Codes */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" /> Códigos Promocionales Activos ({promoCodes.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {promoCodes.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {c.game === 'fcmobile' ? '⚽ FC Mobile' : '🟥 Roblox'}
                      </span>
                      <span className="font-mono text-xs font-black text-amber-400">{c.code}</span>
                    </div>
                    <p className="text-xs font-bold text-white">{c.reward}</p>
                    <p className="text-[10px] text-slate-400">{c.instructions}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteCode(c.id, c.code)}
                    className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONFIGURACIÓN GENERAL Y MURO */}
      {activeAdminTab === 'configuracion' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Muro de Ofertas & Tareas Externas</h3>
                <p className="text-xs text-slate-400">
                  Configura un iframe de tareas como Lootably, CPALead o Adscend para que los miembros consigan rayos extra.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                URL del Iframe del Muro de Ofertas
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={tempOfferwallUrl}
                  onChange={(e) => setTempOfferwallUrl(e.target.value)}
                  placeholder="https://lootably.com/offerwall/..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  onClick={() => {
                    onSaveAdConfig({ ...adConfig, offerwallUrl: tempOfferwallUrl });
                    showToast('URL del Muro de Ofertas guardada con éxito.');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer shadow-md"
                >
                  Guardar
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Si dejas este campo vacío, la app mostrará tareas y encuestas internas seguras para menores.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ajustes de Publicidad Segura (COPPA)
              </h4>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white block font-bold">Anuncios Simulados de Prueba</strong>
                  <span className="text-slate-400 text-[11px]">
                    Permite probar el flujo de video y recompensas sin gastar dinero real.
                  </span>
                </div>
                <button
                  onClick={() => {
                    const updated = !adConfig.simulatedAds;
                    onSaveAdConfig({ ...adConfig, simulatedAds: updated });
                    showToast(`Anuncios simulados: ${updated ? 'Activados' : 'Desactivados'}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    adConfig.simulatedAds ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {adConfig.simulatedAds ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white block font-bold">Seguridad Infantil COPPA</strong>
                  <span className="text-slate-400 text-[11px]">
                    Filtra anuncios inapropiados para la comunidad juvenil de FC Mobile y Roblox.
                  </span>
                </div>
                <button
                  onClick={() => {
                    const updated = !adConfig.coppaSafeKidsMode;
                    onSaveAdConfig({ ...adConfig, coppaSafeKidsMode: updated });
                    showToast(`Modo COPPA: ${updated ? 'Activado' : 'Desactivado'}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    adConfig.coppaSafeKidsMode ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {adConfig.coppaSafeKidsMode ? 'Activado' : 'Desactivado'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Regalar Rayos Bolt a un Usuario */}
      {selectedUserForBolts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black text-xl">
                ⚡
              </div>
              <div>
                <h3 className="text-base font-black text-white">Otorgar Rayos Bolt</h3>
                <p className="text-xs text-slate-400">
                  Usuario: <strong className="text-white">{selectedUserForBolts.name}</strong> ({selectedUserForBolts.email})
                </p>
              </div>
            </div>

            <form onSubmit={handleGrantBolts} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Cantidad de Rayos Bolt a Sumar
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[100, 250, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBoltsAmountToAdd(amt)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        boltsAmountToAdd === amt
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      +{amt} ⚡
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  max="100000"
                  value={boltsAmountToAdd}
                  onChange={(e) => setBoltsAmountToAdd(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBolts(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGrantingBolts}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isGrantingBolts ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 fill-slate-950" />
                  )}
                  <span>Confirmar Rayos</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
