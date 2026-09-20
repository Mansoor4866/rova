export type AssetCategory = 'stocks' | 'crypto' | 'memes';

export interface Asset {
  id: number;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change24h: number;
  decimals: number;
  logoUrl: string;
  sourceId?: string;
  tradable: boolean;
  high24h?: number;
  low24h?: number;
}

export type Direction = 'UP' | 'DOWN';

export type PositionStatus = 'ACTIVE' | 'WON' | 'LOST';

export interface Position {
  id: string;
  assetSymbol: string;
  assetName: string;
  direction: Direction;
  amount: number;
  strikePrice: number;
  closePrice?: number;
  payoutMultiplier: number;
  potentialPayout: number;
  payout?: number;
  durationSeconds: number;
  createdAt: number;
  expiresAt: number;
  status: PositionStatus;
}

export interface PlatformStats {
  totalPositions: number;
  openPositions: number;
  totalVolume: number;
  totalPayouts: number;
  totalRefunded: number;
  todayVolume: number;
  todayTraders: number;
  todayTrades: number;
  rewardPool: number;
  users: number;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  username: string;
  volume: number;
  pnl: number;
  winRate: number;
  prize: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  price: number;
}

export type ActivePage = 'landing' | 'trade' | 'positions' | 'leaderboard';
export type AppTheme = 'dark' | 'light';
export type ChartMode = 'area' | 'candles';
