import { Asset } from '../types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 1,
    symbol: "NVDA",
    name: "NVIDIA Corp",
    category: "stocks",
    price: 220.85,
    change24h: 3.42,
    decimals: 2,
    logoUrl: "https://financialmodelingprep.com/image-stock/NVDA.png",
    tradable: true,
  },
  {
    id: 2,
    symbol: "TSLA",
    name: "Tesla Inc",
    category: "stocks",
    price: 362.40,
    change24h: -1.15,
    decimals: 2,
    logoUrl: "https://financialmodelingprep.com/image-stock/TSLA.png",
    tradable: true,
  },
  {
    id: 3,
    symbol: "HOOD",
    name: "Robinhood Markets",
    category: "stocks",
    price: 48.95,
    change24h: 5.62,
    decimals: 2,
    logoUrl: "https://financialmodelingprep.com/image-stock/HOOD.png",
    tradable: true,
  },
  {
    id: 7,
    symbol: "GOOGL",
    name: "Alphabet Class A",
    category: "stocks",
    price: 349.50,
    change24h: 0.88,
    decimals: 2,
    logoUrl: "https://financialmodelingprep.com/image-stock/GOOGL.png",
    tradable: true,
  },
  {
    id: 11,
    symbol: "AMD",
    name: "AMD",
    category: "stocks",
    price: 554.20,
    change24h: 2.14,
    decimals: 2,
    logoUrl: "https://financialmodelingprep.com/image-stock/AMD.png",
    tradable: true,
  },
  {
    id: 12,
    symbol: "SPY",
    name: "S&P 500 ETF",
    category: "stocks",
    price: 762.80,
    change24h: 0.45,
    decimals: 2,
    logoUrl: "https://financialmodelingprep.com/image-stock/SPY.png",
    tradable: true,
  },
  {
    id: 13,
    symbol: "BTC",
    name: "Bitcoin",
    category: "crypto",
    price: 80512.40,
    change24h: 2.76,
    decimals: 2,
    logoUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
    tradable: true,
  },
  {
    id: 14,
    symbol: "ETH",
    name: "Ethereum",
    category: "crypto",
    price: 2578.90,
    change24h: 1.84,
    decimals: 2,
    logoUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
    tradable: true,
  },
  {
    id: 15,
    symbol: "SOL",
    name: "Solana",
    category: "crypto",
    price: 108.65,
    change24h: -0.92,
    decimals: 2,
    logoUrl: "https://assets.coincap.io/assets/icons/sol@2x.png",
    tradable: true,
  },
  {
    id: 19,
    symbol: "FATCOIN",
    name: "FATCOIN",
    category: "memes",
    price: 0.001592,
    change24h: 14.20,
    decimals: 6,
    logoUrl: "https://cdn.dexscreener.com/cms/images/H1qdCfIYX-s_GlHs?width=800&height=800&quality=95&format=auto",
    tradable: true,
  },
  {
    id: 20,
    symbol: "CHROME",
    name: "Chrome Cat",
    category: "memes",
    price: 0.0001565,
    change24h: 8.45,
    decimals: 7,
    logoUrl: "https://cdn.dexscreener.com/cms/images/AUn7kN02DE1vkOdM?width=800&height=800&quality=95&format=auto",
    tradable: true,
  }
];

export class PriceFeedService {
  private listeners: Map<string, Set<(price: number, change24h: number) => void>> = new Map();
  private assetPrices: Map<string, number> = new Map();
  private intervalId: number | null = null;

  constructor() {
    INITIAL_ASSETS.forEach(a => {
      this.assetPrices.set(a.symbol, a.price);
    });
    this.startStreaming();
  }

  private startStreaming() {
    if (typeof window === 'undefined') return;
    this.intervalId = window.setInterval(() => {
      // Simulate micro-ticks with realistic drift and volatility
      this.assetPrices.forEach((currentPrice, symbol) => {
        const volatility = symbol === 'BTC' || symbol === 'ETH' ? 0.0004 : symbol.startsWith('FAT') || symbol === 'CHROME' ? 0.0012 : 0.0003;
        const deltaPercent = (Math.random() - 0.495) * volatility;
        const newPrice = currentPrice * (1 + deltaPercent);
        this.assetPrices.set(symbol, newPrice);

        const callbacks = this.listeners.get(symbol);
        if (callbacks) {
          callbacks.forEach(cb => cb(newPrice, 0));
        }
      });
    }, 400);
  }

  public subscribe(symbol: string, callback: (price: number, change24h: number) => void): () => void {
    if (!this.listeners.has(symbol)) {
      this.listeners.set(symbol, new Set());
    }
    this.listeners.get(symbol)!.add(callback);
    
    // Immediate callback with current price
    const current = this.assetPrices.get(symbol);
    if (current !== undefined) {
      callback(current, 0);
    }

    return () => {
      this.listeners.get(symbol)?.delete(callback);
    };
  }

  public getCurrentPrice(symbol: string): number {
    return this.assetPrices.get(symbol) || 100;
  }
}

export const priceFeedService = new PriceFeedService();
