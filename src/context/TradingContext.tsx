import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Asset, Position, Direction, LeaderboardEntry, PlatformStats, ActivePage, AppTheme, ChartMode, HUDTheme } from '../types';
import { INITIAL_ASSETS, priceFeedService } from '../services/priceFeed';
import { soundService } from '../services/soundService';
import { supabaseService, isSupabaseConfigured } from '../services/supabase';
import { web3WalletService } from '../services/web3Wallet';
import confetti from 'canvas-confetti';

interface TradingContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  hudTheme: HUDTheme;
  setHudTheme: (theme: HUDTheme) => void;
  chartMode: ChartMode;
  setChartMode: (mode: ChartMode) => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  assets: Asset[];
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
  selectedDuration: number;
  setSelectedDuration: (duration: number) => void;
  durations: number[];
  payoutMultiplier: number;
  balance: number;
  activePositions: Position[];
  settledPositions: Position[];
  placePosition: (direction: Direction, amount: number) => { success: boolean; message?: string };
  depositDemoFunds: (amount: number) => void;
  withdrawDemoFunds: (amount: number) => { success: boolean; message?: string };
  stats: PlatformStats;
  leaderboard: LeaderboardEntry[];
  isMuted: boolean;
  toggleMute: () => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (open: boolean) => void;
  walletModalTab: 'deposit' | 'withdraw';
  setWalletModalTab: (tab: 'deposit' | 'withdraw') => void;
  isRulesOpen: boolean;
  setIsRulesOpen: (open: boolean) => void;
  isWalletConnected: boolean;
  setIsWalletConnected: (connected: boolean) => void;
  walletAddress: string | null;
  fullWalletAddress: string | null;
  setWalletAddress: (addr: string | null, fullAddr?: string | null) => void;
  refreshBalance: () => Promise<void>;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isDatabaseConnected: boolean;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('rova_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [hudTheme, setHudThemeState] = useState<HUDTheme>(() => {
    const saved = localStorage.getItem('rova_hud_theme') as HUDTheme;
    return (saved === 'crimson' || saved === 'cyan' || saved === 'purple' || saved === 'emerald') ? saved : 'crimson';
  });

  const setHudTheme = useCallback((newTheme: HUDTheme) => {
    setHudThemeState(newTheme);
    localStorage.setItem('rova_hud_theme', newTheme);
  }, []);

  const [chartMode, setChartMode] = useState<ChartMode>('area');
  const [activePage, setActivePage] = useState<ActivePage>('landing');
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(INITIAL_ASSETS[0]);
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const durations = [15, 30, 60, 300, 600];
  const payoutMultiplier = 1.90;

  // Wallet & Balance State
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(() => {
    return localStorage.getItem('rova_wallet_connected') === 'true';
  });
  const [walletAddress, setWalletAddressState] = useState<string | null>(() => {
    return localStorage.getItem('rova_wallet_display') || null;
  });
  const [fullWalletAddress, setFullWalletAddress] = useState<string | null>(() => {
    return localStorage.getItem('rova_wallet_full') || null;
  });

  const [balance, setBalance] = useState<number>(0);

  const [activePositions, setActivePositions] = useState<Position[]>([]);
  const [settledPositions, setSettledPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem('rova_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [isMuted, setIsMuted] = useState<boolean>(soundService.getIsMuted());
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [walletModalTab, setWalletModalTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isDatabaseConnected] = useState(isSupabaseConfigured);

  const [stats, setStats] = useState<PlatformStats>({
    totalPositions: 1842,
    openPositions: 0,
    totalVolume: 56420,
    totalPayouts: 50778,
    totalRefunded: 0,
    todayVolume: 4950,
    todayTraders: 21,
    todayTrades: 46,
    users: 64,
    rewardPool: 1000,
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, address: '0x7e4b...d91a', username: 'HyperNova', volume: 16800, pnl: 5420, winRate: 81.2, prize: 400 },
    { rank: 2, address: '0x2a91...bc44', username: 'QuantumTrader', volume: 12900, pnl: 3890, winRate: 74.5, prize: 250 },
    { rank: 3, address: '0x99cc...31ee', username: 'CyberBull', volume: 10400, pnl: 2950, winRate: 70.8, prize: 150 },
    { rank: 4, address: '0x55df...710a', username: 'ApexSniper', volume: 8200, pnl: 2150, winRate: 66.0, prize: 100 },
    { rank: 5, address: '0x10ae...49fb', username: 'LaserStrike', volume: 6900, pnl: 1740, winRate: 63.4, prize: 100 },
  ]);

  // Set wallet address helper
  const setWalletAddress = useCallback((addr: string | null, fullAddr?: string | null) => {
    if (addr && fullAddr) {
      setWalletAddressState(addr);
      setFullWalletAddress(fullAddr);
      setIsWalletConnected(true);
      localStorage.setItem('rova_wallet_display', addr);
      localStorage.setItem('rova_wallet_full', fullAddr);
      localStorage.setItem('rova_wallet_connected', 'true');
    } else if (addr) {
      setWalletAddressState(addr);
      setFullWalletAddress(addr);
      setIsWalletConnected(true);
      localStorage.setItem('rova_wallet_display', addr);
      localStorage.setItem('rova_wallet_full', addr);
      localStorage.setItem('rova_wallet_connected', 'true');
    } else {
      setWalletAddressState(null);
      setFullWalletAddress(null);
      setIsWalletConnected(false);
      localStorage.removeItem('rova_wallet_display');
      localStorage.removeItem('rova_wallet_full');
      localStorage.removeItem('rova_wallet_connected');
    }
  }, []);

  // Fetch real USDG balance on-chain
  const refreshBalance = useCallback(async () => {
    const targetAddress = fullWalletAddress || walletAddress;
    if (!targetAddress) {
      setBalance(0);
      return;
    }

    try {
      const liveBal = await web3WalletService.getUSDGBalance(targetAddress);
      setBalance(liveBal);

      // Sync user profile to Supabase with live balance
      supabaseService.syncUser(targetAddress, liveBal).then(user => {
        if (user && user.balance !== undefined && !isNaN(user.balance)) {
          // If Supabase has an active platform ledger, reconcile
          if (user.balance > 0 && liveBal === 0) {
            setBalance(user.balance);
          }
        }
      });
    } catch (err) {
      console.warn('Error fetching wallet USDG balance:', err);
    }
  }, [fullWalletAddress, walletAddress]);

  // Auto detect injected wallet on load
  useEffect(() => {
    const checkInjectedWallet = async () => {
      const ethereum = typeof window !== 'undefined' ? (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum : undefined;
      if (ethereum) {
        try {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            const acc = accounts[0];
            const display = acc.slice(0, 6) + '...' + acc.slice(-4);
            setWalletAddress(display, acc);
          }
        } catch (_) {}
      }
    };

    checkInjectedWallet();
  }, [setWalletAddress]);

  // Listen to Ethereum wallet account/chain changes
  useEffect(() => {
    const ethereum = typeof window !== 'undefined' ? (window as unknown as { ethereum?: { on?: (event: string, handler: (args: unknown) => void) => void; removeListener?: (event: string, handler: (args: unknown) => void) => void } }).ethereum : undefined;
    if (!ethereum || !ethereum.on) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accList = accounts as string[];
      if (accList && accList.length > 0) {
        const acc = accList[0];
        const display = acc.slice(0, 6) + '...' + acc.slice(-4);
        setWalletAddress(display, acc);
      } else {
        setWalletAddress(null, null);
      }
    };

    const handleChainChanged = () => {
      refreshBalance();
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [setWalletAddress, refreshBalance]);

  // Fetch balance when wallet is connected/changed
  useEffect(() => {
    if (fullWalletAddress || walletAddress) {
      refreshBalance();

      // Fetch positions for this wallet
      const targetAddr = fullWalletAddress || walletAddress || '';
      supabaseService.fetchUserPositions(targetAddr).then(dbPositions => {
        if (dbPositions.length > 0) {
          const active = dbPositions.filter(p => p.status === 'ACTIVE');
          const settled = dbPositions.filter(p => p.status !== 'ACTIVE');
          setActivePositions(active);
          setSettledPositions(settled);
        }
      });
    } else {
      setBalance(0);
    }
  }, [fullWalletAddress, walletAddress, refreshBalance]);

  // Periodic balance polling every 12 seconds when wallet connected
  useEffect(() => {
    if (!isWalletConnected || (!fullWalletAddress && !walletAddress)) return;

    const timer = setInterval(() => {
      refreshBalance();
    }, 12000);

    return () => clearInterval(timer);
  }, [isWalletConnected, fullWalletAddress, walletAddress, refreshBalance]);

  // Sync Supabase Leaderboard
  useEffect(() => {
    supabaseService.fetchLeaderboard().then(data => {
      if (data && data.length > 0) {
        setLeaderboard(data);
      }
    });
  }, []);

  // Sync theme
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('rova_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    soundService.playClick();
  };

  useEffect(() => {
    localStorage.setItem('rova_history', JSON.stringify(settledPositions.slice(0, 50)));
  }, [settledPositions]);

  useEffect(() => {
    const unsub = priceFeedService.subscribe(selectedAsset.symbol, (newPrice) => {
      setSelectedAsset(prev => ({
        ...prev,
        price: newPrice
      }));
      setAssets(prev => prev.map(a => a.symbol === selectedAsset.symbol ? { ...a, price: newPrice } : a));
    });
    return unsub;
  }, [selectedAsset.symbol]);

  // Settlement loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setActivePositions(prevPositions => {
        const stillActive: Position[] = [];
        const newlySettled: Position[] = [];

        prevPositions.forEach(pos => {
          if (now >= pos.expiresAt) {
            const currentPrice = priceFeedService.getCurrentPrice(pos.assetSymbol);
            const isUp = pos.direction === 'UP';
            const isWon = isUp ? (currentPrice > pos.strikePrice) : (currentPrice < pos.strikePrice);
            const payoutAmount = isWon ? pos.amount * pos.payoutMultiplier : 0;

            const settledPos: Position = {
              ...pos,
              closePrice: currentPrice,
              payout: payoutAmount,
              status: isWon ? 'WON' : 'LOST'
            };

            newlySettled.push(settledPos);

            // Sync with Supabase & on-chain state
            const targetAddr = fullWalletAddress || walletAddress || '0xDemoTrader';
            const updatedBalance = isWon ? balance + payoutAmount : balance;
            supabaseService.settlePosition(pos.id, targetAddr, currentPrice, isWon, payoutAmount, updatedBalance);
            web3WalletService.saveUserBalance(targetAddr, updatedBalance);

            if (isWon) {
              setBalance(b => b + payoutAmount);
              soundService.playWin();
              confetti({
                particleCount: 65,
                spread: 75,
                origin: { y: 0.6 }
              });
            } else {
              soundService.playLoss();
            }
          } else {
            const secondsLeft = Math.ceil((pos.expiresAt - now) / 1000);
            if (secondsLeft <= 3 && secondsLeft > 0) {
              soundService.playCountdownTick();
            }
            stillActive.push(pos);
          }
        });

        if (newlySettled.length > 0) {
          setSettledPositions(history => [...newlySettled, ...history]);
          setStats(s => ({
            ...s,
            openPositions: stillActive.length,
            totalPayouts: s.totalPayouts + newlySettled.reduce((acc, p) => acc + (p.payout || 0), 0),
            todayTrades: s.todayTrades + newlySettled.length,
          }));
        }

        return stillActive;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [balance, walletAddress, fullWalletAddress]);

  const placePosition = useCallback((direction: Direction, amount: number) => {
    if (amount <= 0 || isNaN(amount)) {
      return { success: false, message: 'Invalid trade size' };
    }
    if (amount > balance) {
      return { success: false, message: 'Insufficient USDG balance in connected wallet' };
    }

    const currentPrice = priceFeedService.getCurrentPrice(selectedAsset.symbol);
    const now = Date.now();
    const durationMs = selectedDuration * 1000;

    const newPosition: Position = {
      id: 'strike_' + Math.random().toString(36).substr(2, 9),
      assetSymbol: selectedAsset.symbol,
      assetName: selectedAsset.name,
      direction,
      amount,
      strikePrice: currentPrice,
      payoutMultiplier,
      potentialPayout: amount * payoutMultiplier,
      durationSeconds: selectedDuration,
      createdAt: now,
      expiresAt: now + durationMs,
      status: 'ACTIVE'
    };

    const newBal = balance - amount;
    setBalance(newBal);
    setActivePositions(prev => [newPosition, ...prev]);
    soundService.playTradeEntry(direction);

    // Persist to Supabase & local storage
    const targetAddr = fullWalletAddress || walletAddress || '0xDemoTrader';
    supabaseService.savePosition(newPosition, targetAddr);
    supabaseService.updateBalance(targetAddr, newBal, 'WITHDRAW', amount);
    web3WalletService.saveUserBalance(targetAddr, newBal);

    setStats(s => ({
      ...s,
      totalPositions: s.totalPositions + 1,
      openPositions: s.openPositions + 1,
      totalVolume: s.totalVolume + amount,
      todayVolume: s.todayVolume + amount
    }));

    return { success: true };
  }, [balance, selectedAsset, selectedDuration, payoutMultiplier, walletAddress, fullWalletAddress]);

  const depositDemoFunds = (amount: number) => {
    const newBal = balance + amount;
    setBalance(newBal);
    soundService.playWin();

    const targetAddr = fullWalletAddress || walletAddress || '0xDemoTrader';
    supabaseService.updateBalance(targetAddr, newBal, 'DEPOSIT', amount);
    web3WalletService.saveUserBalance(targetAddr, newBal);
  };

  const withdrawDemoFunds = (amount: number) => {
    if (amount <= 0 || isNaN(amount)) return { success: false, message: 'Invalid amount' };
    if (amount > balance) return { success: false, message: 'Insufficient USDG balance' };
    const newBal = balance - amount;
    setBalance(newBal);
    soundService.playClick();

    const targetAddr = fullWalletAddress || walletAddress || '0xDemoTrader';
    supabaseService.updateBalance(targetAddr, newBal, 'WITHDRAW', amount);
    web3WalletService.saveUserBalance(targetAddr, newBal);
    return { success: true };
  };

  const toggleMute = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  const connectWallet = () => {
    setIsConnectModalOpen(true);
    soundService.playClick();
  };

  const disconnectWallet = () => {
    setWalletAddress(null, null);
    setBalance(0);
    soundService.playClick();
  };

  return (
    <TradingContext.Provider
      value={{
        theme,
        toggleTheme,
        hudTheme,
        setHudTheme,
        chartMode,
        setChartMode,
        activePage,
        setActivePage,
        assets,
        selectedAsset,
        setSelectedAsset,
        selectedDuration,
        setSelectedDuration,
        durations,
        payoutMultiplier,
        balance,
        activePositions,
        settledPositions,
        placePosition,
        depositDemoFunds,
        withdrawDemoFunds,
        stats,
        leaderboard,
        isMuted,
        toggleMute,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isConnectModalOpen,
        setIsConnectModalOpen,
        walletModalTab,
        setWalletModalTab,
        isRulesOpen,
        setIsRulesOpen,
        isWalletConnected,
        setIsWalletConnected,
        walletAddress,
        fullWalletAddress,
        setWalletAddress,
        refreshBalance,
        connectWallet,
        disconnectWallet,
        isDatabaseConnected,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
