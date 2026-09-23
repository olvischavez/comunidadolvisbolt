import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import defaultFirebaseConfig from '../firebase-applet-config.json';
import { UserCommunityProfile, PrizeRedemption, AdConfiguration, NewsItem, PromoCode } from './types';

// Support Vite environment variables with fallback to config json
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId || 'comunidad-olvis-bolt-base-dato',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain || 'comunidad-olvis-bolt-base-dato.firebaseapp.com',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket || 'comunidad-olvis-bolt-base-dato.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultFirebaseConfig.measurementId || '',
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function loginWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

/**
 * Gets or creates the user's persistent profile document in Firestore
 */
export async function syncUserProfile(user: FirebaseUser): Promise<UserCommunityProfile> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      return {
        id: user.uid,
        uid: user.uid,
        email: user.email || '',
        name: data.name || user.displayName || 'Miembro Bolt',
        avatar: data.avatar || user.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        boltCoins: typeof data.boltCoins === 'number' ? data.boltCoins : 150,
        level: data.level || 1,
        xp: data.xp || 150,
        streakDays: data.streakDays || 1,
        claimedCodes: data.claimedCodes || [],
        completedTasks: data.completedTasks || [],
        lastPrizeRedeemedDate: data.lastPrizeRedeemedDate || null,
        role: user.email === 'olvischavezmustafa@gmail.com' ? 'admin' : (data.role || 'member'),
      };
    }

    // Create initial user document with welcome bonus
    const newProfile: UserCommunityProfile = {
      id: user.uid,
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || 'Miembro Bolt',
      avatar: user.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      boltCoins: 150, // Welcome gift of 150 bolts
      level: 1,
      xp: 150,
      streakDays: 1,
      claimedCodes: [],
      completedTasks: [],
      lastPrizeRedeemedDate: null,
      role: user.email === 'olvischavezmustafa@gmail.com' ? 'admin' : 'member',
    };

    await setDoc(userRef, {
      ...newProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return newProfile;
  } catch (err) {
    console.warn('No se pudo sincronizar directamente con Firestore (usando fallback local):', err);
    return {
      id: user.uid,
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || 'Miembro Bolt',
      avatar: user.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      boltCoins: 150,
      level: 1,
      xp: 150,
      streakDays: 1,
      claimedCodes: [],
      completedTasks: [],
      lastPrizeRedeemedDate: null,
      role: user.email === 'olvischavezmustafa@gmail.com' ? 'admin' : 'member',
    };
  }
}

/**
 * Updates user bolt coins and xp in Firestore
 */
export async function updateUserBolts(
  uid: string,
  boltCoins: number,
  xp: number,
  completedTaskId?: string
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const currentTasks: string[] = snap.data().completedTasks || [];
  const updatedTasks = completedTaskId && !currentTasks.includes(completedTaskId)
    ? [...currentTasks, completedTaskId]
    : currentTasks;

  await updateDoc(userRef, {
    boltCoins,
    xp,
    level: Math.floor(xp / 500) + 1,
    completedTasks: updatedTasks,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Handles prize redemption with anti-abuse 1-prize-per-day limit
 */
export async function redeemPrizeInFirestore(params: {
  userId: string;
  userEmail: string;
  userName: string;
  prizeId: string;
  prizeTitle: string;
  costBolts: number;
  category: string;
  accountIdentifier: string;
}): Promise<{ success: boolean; message: string; remainingBolts?: number }> {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const userRef = doc(db, 'users', params.userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return { success: false, message: 'Perfil de usuario no encontrado en la base de datos.' };
  }

  const userData = userSnap.data();

  // ANTI-ABUSE CHECK: Max 1 prize redemption per user per day
  if (userData.lastPrizeRedeemedDate === today && userData.role !== 'admin') {
    return {
      success: false,
      message: '⚠️ Límite diario alcanzado: Por seguridad y para garantizar premios para todos los 30 miembros, solo puedes canjear 1 premio cada 24 horas. ¡Vuelve mañana para seguir canjeando!',
    };
  }

  const currentBolts = userData.boltCoins || 0;
  if (currentBolts < params.costBolts) {
    return {
      success: false,
      message: `No tienes suficientes Rayos Bolt. Necesitas ${params.costBolts.toLocaleString()} ⚡ y tienes ${currentBolts.toLocaleString()} ⚡.`,
    };
  }

  const newBolts = currentBolts - params.costBolts;

  // 1. Deduct bolts and update user's lastPrizeRedeemedDate
  await updateDoc(userRef, {
    boltCoins: newBolts,
    lastPrizeRedeemedDate: today,
    updatedAt: new Date().toISOString(),
  });

  // 2. Insert into redemptions collection
  const redemptionsCol = collection(db, 'redemptions');
  await addDoc(redemptionsCol, {
    userId: params.userId,
    userEmail: params.userEmail,
    userName: params.userName,
    prizeId: params.prizeId,
    prizeTitle: params.prizeTitle,
    costBolts: params.costBolts,
    category: params.category,
    accountIdentifier: params.accountIdentifier,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: `¡Canje exitoso! Solicitaste "${params.prizeTitle}". Olvis Bolt verificará tu cuenta y enviará tu premio en menos de 24 horas.`,
    remainingBolts: newBolts,
  };
}

/**
 * Gets user redemption history
 */
export async function getUserRedemptions(userId: string): Promise<PrizeRedemption[]> {
  try {
    const q = query(
      collection(db, 'redemptions'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const results: PrizeRedemption[] = [];
    snap.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        prizeId: data.prizeId,
        prizeTitle: data.prizeTitle,
        costBolts: data.costBolts,
        category: data.category,
        accountIdentifier: data.accountIdentifier,
        status: data.status,
        createdAt: data.createdAt,
      });
    });
    return results;
  } catch (err) {
    console.error('Error fetching redemptions:', err);
    return [];
  }
}

/**
 * Gets all redemptions for admin panel
 */
export async function getAllRedemptionsForAdmin(): Promise<PrizeRedemption[]> {
  try {
    const q = query(
      collection(db, 'redemptions'),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    const results: PrizeRedemption[] = [];
    snap.forEach((d) => {
      const data = d.data();
      results.push({
        id: d.id,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        prizeId: data.prizeId,
        prizeTitle: data.prizeTitle,
        costBolts: data.costBolts,
        category: data.category,
        accountIdentifier: data.accountIdentifier,
        status: data.status,
        createdAt: data.createdAt,
      });
    });
    return results;
  } catch (err) {
    console.error('Error fetching all redemptions for admin:', err);
    // Fallback without orderBy if index is still propagating
    try {
      const snap = await getDocs(collection(db, 'redemptions'));
      const results: PrizeRedemption[] = [];
      snap.forEach((d) => {
        const data = d.data();
        results.push({
          id: d.id,
          userId: data.userId,
          userEmail: data.userEmail,
          userName: data.userName,
          prizeId: data.prizeId,
          prizeTitle: data.prizeTitle,
          costBolts: data.costBolts,
          category: data.category,
          accountIdentifier: data.accountIdentifier,
          status: data.status,
          createdAt: data.createdAt,
        });
      });
      return results.reverse();
    } catch {
      return [];
    }
  }
}

/**
 * Updates status of a redemption (entregado, cancelado)
 */
export async function updateRedemptionStatus(
  redemptionId: string,
  newStatus: 'pendiente' | 'entregado' | 'cancelado',
  refundUserId?: string,
  refundBolts?: number
): Promise<{ success: boolean; message: string }> {
  try {
    const redRef = doc(db, 'redemptions', redemptionId);
    await updateDoc(redRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    // If cancelled and refund specified, return bolts to user
    if (newStatus === 'cancelado' && refundUserId && refundBolts && refundBolts > 0) {
      const userRef = doc(db, 'users', refundUserId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const curBolts = userSnap.data().boltCoins || 0;
        await updateDoc(userRef, {
          boltCoins: curBolts + refundBolts,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return {
      success: true,
      message: `Estado actualizado a "${newStatus}" con éxito.`,
    };
  } catch (err: any) {
    console.error('Error updating redemption status:', err);
    return {
      success: false,
      message: err.message || 'Error al actualizar el estado del canje.',
    };
  }
}

/**
 * Gets all registered users for admin
 */
export async function getAllUsersForAdmin(): Promise<UserCommunityProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users: UserCommunityProfile[] = [];
    snap.forEach((d) => {
      const data = d.data();
      users.push({
        id: d.id,
        uid: data.uid || d.id,
        email: data.email || '',
        name: data.name || 'Miembro',
        avatar: data.avatar || '',
        boltCoins: data.boltCoins || 0,
        level: data.level || 1,
        xp: data.xp || 0,
        streakDays: data.streakDays || 1,
        claimedCodes: data.claimedCodes || [],
        completedTasks: data.completedTasks || [],
        lastPrizeRedeemedDate: data.lastPrizeRedeemedDate || null,
        role: data.role || 'member',
      });
    });
    return users;
  } catch (err) {
    console.error('Error fetching users for admin:', err);
    return [];
  }
}

/**
 * Grants or adds Rayos Bolt to a user by admin
 */
export async function grantBoltsToUserByAdmin(
  userId: string,
  additionalBolts: number
): Promise<{ success: boolean; newBolts?: number; message: string }> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      return { success: false, message: 'Usuario no encontrado en la base de datos.' };
    }
    const curBolts = snap.data().boltCoins || 0;
    const newBolts = Math.max(0, curBolts + additionalBolts);
    await updateDoc(userRef, {
      boltCoins: newBolts,
      updatedAt: new Date().toISOString(),
    });
    return {
      success: true,
      newBolts,
      message: `Se han añadido ${additionalBolts} Rayos Bolt al usuario. Ahora tiene ${newBolts} ⚡`,
    };
  } catch (err: any) {
    console.error('Error granting bolts:', err);
    return { success: false, message: err.message || 'Error al modificar los rayos.' };
  }
}

/**
 * Gets global app settings (such as offerwallUrl) from Firestore
 */
export async function getGlobalAdConfigFromFirestore(): Promise<Partial<AdConfiguration> | null> {
  try {
    const settingsRef = doc(db, 'settings', 'adConfig');
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return snap.data() as Partial<AdConfiguration>;
    }
    return null;
  } catch (err) {
    console.error('Error fetching global ad config from Firestore:', err);
    return null;
  }
}

/**
 * Saves global app settings (offerwallUrl, etc.) to Firestore (Admin only)
 */
export async function saveGlobalAdConfigToFirestore(config: AdConfiguration): Promise<boolean> {
  try {
    const settingsRef = doc(db, 'settings', 'adConfig');
    await setDoc(settingsRef, {
      ...config,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving global ad config to Firestore:', err);
    return false;
  }
}

/**
 * Fetches all community news published by Olvis Bolt from Firestore
 */
export async function fetchCommunityNewsFromFirestore(): Promise<NewsItem[]> {
  try {
    const q = query(collection(db, 'community_news'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const results: NewsItem[] = [];
    snap.forEach((d) => {
      const data = d.data();
      results.push({
        id: d.id,
        game: data.game || 'fcmobile',
        title: data.title,
        summary: data.summary,
        content: data.content || data.summary,
        category: data.category || 'Actualización',
        date: data.date || 'Hoy',
        author: data.author || 'Olvis Bolt',
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&auto=format&fit=crop',
        sourceUrl: data.sourceUrl || '#comunicado-olvis-bolt',
        featured: !!data.featured,
        tags: Array.isArray(data.tags) ? data.tags : ['Comunidad Bolt'],
        commentsCount: typeof data.commentsCount === 'number' ? data.commentsCount : 12,
      });
    });
    return results;
  } catch (err) {
    console.error('Error fetching news from Firestore, attempting fallback:', err);
    try {
      const snap = await getDocs(collection(db, 'community_news'));
      const results: NewsItem[] = [];
      snap.forEach((d) => {
        const data = d.data();
        results.push({
          id: d.id,
          game: data.game || 'fcmobile',
          title: data.title,
          summary: data.summary,
          content: data.content || data.summary,
          category: data.category || 'Actualización',
          date: data.date || 'Hoy',
          author: data.author || 'Olvis Bolt',
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&auto=format&fit=crop',
          sourceUrl: data.sourceUrl || '#comunicado-olvis-bolt',
          featured: !!data.featured,
          tags: Array.isArray(data.tags) ? data.tags : ['Comunidad Bolt'],
          commentsCount: typeof data.commentsCount === 'number' ? data.commentsCount : 12,
        });
      });
      return results;
    } catch {
      return [];
    }
  }
}

/**
 * Publishes or updates a news item in Firestore (Admin only)
 */
export async function publishNewsToFirestore(
  item: Omit<NewsItem, 'id'> & { id?: string }
): Promise<{ success: boolean; newsItem?: NewsItem; message: string }> {
  try {
    const newsCol = collection(db, 'community_news');
    const docId = item.id || `news-${Date.now()}`;
    const docRef = doc(newsCol, docId);
    
    const payload = {
      game: item.game,
      title: item.title,
      summary: item.summary,
      content: item.content,
      category: item.category,
      date: item.date || 'Hoy',
      author: item.author || 'Olvis Bolt',
      imageUrl: item.imageUrl,
      sourceUrl: item.sourceUrl,
      featured: item.featured ?? false,
      tags: item.tags || [],
      commentsCount: item.commentsCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(docRef, payload, { merge: true });

    return {
      success: true,
      message: '¡Noticia publicada con éxito en Firestore para todos los usuarios!',
      newsItem: {
        id: docId,
        ...payload,
      },
    };
  } catch (err: any) {
    console.error('Error publishing news to Firestore:', err);
    return {
      success: false,
      message: err.message || 'Error al guardar la noticia en la base de datos.',
    };
  }
}

/**
 * Deletes a news item from Firestore (Admin only)
 */
export async function deleteNewsFromFirestore(newsId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'community_news', newsId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting news from Firestore:', err);
    return false;
  }
}

/**
 * Fetches promotional codes from Firestore
 */
export async function fetchPromoCodesFromFirestore(): Promise<PromoCode[]> {
  try {
    const snap = await getDocs(collection(db, 'promo_codes'));
    const results: PromoCode[] = [];
    snap.forEach((d) => {
      const data = d.data();
      results.push({
        id: d.id,
        code: data.code,
        game: data.game || 'fcmobile',
        reward: data.reward,
        status: data.status || 'active',
        expiryDate: data.expiryDate,
        verifiedDate: data.verifiedDate || 'Hoy',
        instructions: data.instructions || 'Canjear en la plataforma oficial',
      });
    });
    return results;
  } catch (err) {
    console.error('Error fetching promo codes from Firestore:', err);
    return [];
  }
}

/**
 * Publishes or updates a promotional code in Firestore (Admin only)
 */
export async function publishPromoCodeToFirestore(
  item: Omit<PromoCode, 'id'> & { id?: string }
): Promise<{ success: boolean; promoCode?: PromoCode; message: string }> {
  try {
    const codesCol = collection(db, 'promo_codes');
    const docId = item.id || `code-${Date.now()}`;
    const docRef = doc(codesCol, docId);

    const payload = {
      code: item.code.trim().toUpperCase(),
      game: item.game,
      reward: item.reward.trim(),
      status: item.status,
      expiryDate: item.expiryDate || 'Activo',
      verifiedDate: item.verifiedDate || 'Hoy',
      instructions: item.instructions || 'Canjear en la plataforma oficial',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(docRef, payload, { merge: true });

    return {
      success: true,
      message: '¡Código promocional publicado con éxito en Firestore!',
      promoCode: {
        id: docId,
        ...payload,
      },
    };
  } catch (err: any) {
    console.error('Error publishing promo code to Firestore:', err);
    return {
      success: false,
      message: err.message || 'Error al guardar el código en la base de datos.',
    };
  }
}

/**
 * Deletes a promo code from Firestore (Admin only)
 */
export async function deletePromoCodeFromFirestore(codeId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'promo_codes', codeId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting promo code from Firestore:', err);
    return false;
  }
}



