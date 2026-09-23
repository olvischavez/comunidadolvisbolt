import React, { useState, useEffect } from 'react';
import {
  ActivePanel,
  NewsItem,
  UserCommunityProfile,
  RewardPrize,
  AdConfiguration,
  PromoCode,
} from './types';
import {
  INITIAL_FC_MOBILE_NEWS,
  INITIAL_ROBLOX_NEWS,
  PROMO_CODES,
  REWARD_PRIZES,
} from './data/mockData';
import { Header } from './components/Header';
import { PanelFcMobile } from './components/PanelFcMobile';
import { PanelRoblox } from './components/PanelRoblox';
import { PanelPremios } from './components/PanelPremios';
import { PanelAdmin } from './components/PanelAdmin';
import { RewardedAdModal } from './components/RewardedAdModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  auth,
  syncUserProfile,
  createLocalProfileFromFbUser,
  logoutUser,
  updateUserBolts,
  getGlobalAdConfigFromFirestore,
  saveGlobalAdConfigToFirestore,
  fetchCommunityNewsFromFirestore,
  fetchPromoCodesFromFirestore,
} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [activePanel, setActivePanel] = useState<ActivePanel>('fcmobile');

  // News states
  const [allNews, setAllNews] = useState<NewsItem[]>([
    ...INITIAL_FC_MOBILE_NEWS,
    ...INITIAL_ROBLOX_NEWS,
  ]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(PROMO_CODES);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSync, setLastSync] = useState<string>('Hoy');

  // User Profile with Bolt Coins Persistence
  const [userProfile, setUserProfile] = useState<UserCommunityProfile>(() => {
    const saved = localStorage.getItem('olvis_bolt_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      id: 'usr-guest',
      name: 'Miembro Bolt',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      boltCoins: 150,
      level: 1,
      xp: 150,
      streakDays: 1,
      claimedCodes: [],
      completedTasks: [],
    };
  });

  const [dailyClaimed, setDailyClaimed] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile && (userProfile.uid || userProfile.email)) {
      localStorage.setItem('olvis_bolt_user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Load news and promo codes from Firestore
  const loadCommunityData = async () => {
    setIsSyncing(true);
    try {
      const [remoteNews, remoteCodes] = await Promise.all([
        fetchCommunityNewsFromFirestore(),
        fetchPromoCodesFromFirestore(),
      ]);

      if (remoteNews.length > 0) {
        const defaultNews = [...INITIAL_FC_MOBILE_NEWS, ...INITIAL_ROBLOX_NEWS];
        const remoteIds = new Set(remoteNews.map((n) => n.id));
        const mergedNews = [
          ...remoteNews,
          ...defaultNews.filter((n) => !remoteIds.has(n.id)),
        ];
        setAllNews(mergedNews);
      }

      if (remoteCodes.length > 0) {
        const remoteCodeIds = new Set(remoteCodes.map((c) => c.id));
        const mergedCodes = [
          ...remoteCodes,
          ...PROMO_CODES.filter((c) => !remoteCodeIds.has(c.id)),
        ];
        setPromoCodes(mergedCodes);
      }
      setLastSync('Justo ahora');
    } catch (err) {
      console.error('Error cargando datos de comunidad de Firestore:', err);
      setLastSync('Hoy');
    } finally {
      setIsSyncing(false);
    }
  };

  // Listen to Firebase Auth state & initial data
  useEffect(() => {
    loadCommunityData();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // 1. Inmediato: mostrar al usuario logueado en 0 ms
        const instantProfile = createLocalProfileFromFbUser(fbUser);
        setUserProfile((prev) => ({
          ...instantProfile,
          boltCoins: prev.boltCoins || 150,
          xp: prev.xp || 150,
          level: prev.level || 1,
        }));
        setIsAuthModalOpen(false);

        // 2. Sincronizar en segundo plano con Firestore
        try {
          const profile = await syncUserProfile(fbUser);
          setUserProfile(profile);
        } catch (err) {
          console.warn('Sincronización en segundo plano completada con fallback:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUserProfile({
        id: 'usr-guest',
        name: 'Miembro Bolt',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        boltCoins: 150,
        level: 1,
        xp: 150,
        streakDays: 1,
        claimedCodes: [],
        completedTasks: [],
      });
      setActivePanel('fcmobile');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Ad Configuration State
  const [adConfig, setAdConfig] = useState<AdConfiguration>(() => {
    const saved = localStorage.getItem('olvis_bolt_ad_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      simulatedAds: true,
      offerwallUrl: '',
      coppaSafeKidsMode: true,
      rewardVideoDuration: 7,
    };
  });

  // Sync adConfig with Firestore
  useEffect(() => {
    const fetchGlobalAdConfig = async () => {
      const remoteConfig = await getGlobalAdConfigFromFirestore();
      if (remoteConfig) {
        setAdConfig((prev) => ({
          ...prev,
          ...remoteConfig,
        }));
        localStorage.setItem('olvis_bolt_ad_config', JSON.stringify({ ...adConfig, ...remoteConfig }));
      }
    };
    fetchGlobalAdConfig();
  }, []);

  const handleSaveAdConfig = async (newConfig: AdConfiguration) => {
    setAdConfig(newConfig);
    localStorage.setItem('olvis_bolt_ad_config', JSON.stringify(newConfig));
    await saveGlobalAdConfigToFirestore(newConfig);
  };

  // Modals state
  const [isRewardedAdOpen, setIsRewardedAdOpen] = useState<boolean>(false);
  const [selectedNewsForAd, setSelectedNewsForAd] = useState<NewsItem | null>(null);
  const [activeNewsDetail, setActiveNewsDetail] = useState<NewsItem | null>(null);

  // Daily streak claim check
  useEffect(() => {
    const lastClaim = localStorage.getItem('olvis_last_daily_claim');
    const today = new Date().toISOString().split('T')[0];
    if (lastClaim === today) {
      setDailyClaimed(true);
    }
  }, []);

  // Save profile to localStorage as local cache
  useEffect(() => {
    localStorage.setItem('olvis_bolt_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Handle claiming daily bonus (+100 Bolt Coins)
  const handleClaimDailyBonus = async () => {
    if (dailyClaimed) return;
    const newCoins = userProfile.boltCoins + 100;
    const newXp = userProfile.xp + 50;
    const newStreak = userProfile.streakDays + 1;

    const updatedProfile: UserCommunityProfile = {
      ...userProfile,
      boltCoins: newCoins,
      xp: newXp,
      streakDays: newStreak,
    };

    setUserProfile(updatedProfile);
    setDailyClaimed(true);
    localStorage.setItem('olvis_last_daily_claim', new Date().toISOString().split('T')[0]);

    if (userProfile.uid) {
      await updateUserBolts(userProfile.uid, newCoins, newXp);
    }
  };

  // Handle task or action completion
  const handleEarnBolts = async (amount: number, reason: string, taskId?: string) => {
    const newCoins = userProfile.boltCoins + amount;
    const newXp = userProfile.xp + Math.floor(amount / 2);
    const updatedTasks = taskId && !userProfile.completedTasks.includes(taskId)
      ? [...userProfile.completedTasks, taskId]
      : userProfile.completedTasks;

    const updatedProfile: UserCommunityProfile = {
      ...userProfile,
      boltCoins: newCoins,
      xp: newXp,
      level: Math.floor(newXp / 500) + 1,
      completedTasks: updatedTasks,
    };

    setUserProfile(updatedProfile);

    if (userProfile.uid) {
      await updateUserBolts(userProfile.uid, newCoins, newXp, taskId);
    }
  };

  // Open news detail directly
  const handleSelectNews = (news: NewsItem) => {
    setActiveNewsDetail(news);
  };

  // Handle rewarded video ad completion
  const handleAdCompleted = (rewardGiven: boolean) => {
    setIsRewardedAdOpen(false);
    if (rewardGiven) {
      handleEarnBolts(25, 'Video Recompensado');
    }
    if (selectedNewsForAd) {
      setActiveNewsDetail(selectedNewsForAd);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Global Header */}
      <Header
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        userProfile={userProfile}
        onClaimDailyBonus={handleClaimDailyBonus}
        dailyClaimed={dailyClaimed}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area (with safe bottom padding for mobile nav bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-24 md:pb-8 overflow-x-hidden">
        {activePanel === 'fcmobile' && (
          <PanelFcMobile
            news={allNews}
            promoCodes={promoCodes}
            onSelectNews={handleSelectNews}
          />
        )}

        {activePanel === 'roblox' && (
          <PanelRoblox
            news={allNews}
            promoCodes={promoCodes}
            onSelectNews={handleSelectNews}
          />
        )}

        {activePanel === 'premios' && (
          <PanelPremios
            prizes={REWARD_PRIZES}
            userProfile={userProfile}
            onEarnBolts={handleEarnBolts}
            offerwallIframeUrl={adConfig.offerwallUrl}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onNavigateToAdmin={() => setActivePanel('admin')}
          />
        )}

        {activePanel === 'admin' && (
          <PanelAdmin
            adminProfile={userProfile}
            adConfig={adConfig}
            allNews={allNews}
            promoCodes={promoCodes}
            onSaveAdConfig={handleSaveAdConfig}
            onNewsUpdated={loadCommunityData}
            onCodesUpdated={loadCommunityData}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Rewarded Video Ad Modal */}
      <RewardedAdModal
        newsItem={selectedNewsForAd}
        isOpen={isRewardedAdOpen}
        onClose={() => setIsRewardedAdOpen(false)}
        onAdCompleted={handleAdCompleted}
      />

      {/* News Detail Modal */}
      <NewsDetailModal
        newsItem={activeNewsDetail}
        isOpen={Boolean(activeNewsDetail)}
        onClose={() => setActiveNewsDetail(null)}
        onAddBoltCoins={(amt) => handleEarnBolts(amt, 'Comentario')}
      />

      {/* Firebase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => setIsAuthModalOpen(false)}
      />

      {/* Global Footer */}
      <Footer setActivePanel={setActivePanel} />

      {/* Mobile Navigation Bar */}
      <MobileBottomNav
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        userProfile={userProfile}
        isLoggedIn={Boolean(userProfile.uid || userProfile.email)}
        canClaimDaily={!dailyClaimed}
        onClaimDailyBonus={handleClaimDailyBonus}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
    </div>
  );
}
