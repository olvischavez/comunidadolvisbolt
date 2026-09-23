export type ActivePanel = 'fcmobile' | 'roblox' | 'premios' | 'admin';

export interface NewsItem {
  id: string;
  game: 'fcmobile' | 'roblox';
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  author: string;
  imageUrl: string;
  sourceUrl: string;
  featured?: boolean;
  tags: string[];
  commentsCount: number;
}

export interface PromoCode {
  id: string;
  code: string;
  game: 'fcmobile' | 'roblox';
  reward: string;
  status: 'active' | 'expired' | 'exclusive';
  expiryDate?: string;
  verifiedDate: string;
  instructions: string;
}

export interface RewardPrize {
  id: string;
  title: string;
  costBolts: number;
  category: 'Robux' | 'FC Mobile' | 'FC Points' | 'Rango VIP' | 'Pase';
  icon: string;
  stock: number;
  deliveryTime: string;
  instructions: string;
}

export interface AdConfiguration {
  simulatedAds: boolean;
  offerwallUrl: string;
  coppaSafeKidsMode: boolean;
  rewardVideoDuration: number;
}

export interface UserCommunityProfile {
  id: string;
  uid?: string;
  email?: string;
  name: string;
  avatar: string;
  boltCoins: number;
  level: number;
  xp: number;
  streakDays: number;
  claimedCodes: string[];
  completedTasks: string[];
  lastPrizeRedeemedDate?: string | null;
  role?: 'admin' | 'member';
}

export interface PrizeRedemption {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  prizeId: string;
  prizeTitle: string;
  costBolts: number;
  category: string;
  accountIdentifier: string;
  status: 'pendiente' | 'entregado' | 'cancelado';
  createdAt: string;
}
