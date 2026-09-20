import React, { useState, useRef, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { 
  Zap, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  ChevronDown, 
  ExternalLink, 
  LogOut, 
  Wallet, 
  Trophy, 
  Activity,
  Shield,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { soundService } from '../services/soundService';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    activePage,
    setActivePage,
    balance,
    isMuted,
    toggleMute,
    setIsWalletModalOpen,
    setWalletModalTab,
    isWalletConnected,
    walletAddress,
    connectWallet,
    disconnectWallet
  } = useTrading();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openDeposit = () => {
    setWalletModalTab('deposit');
    setIsWalletModalOpen(true);
    soundService.playClick();
  };

  const openWithdraw = () => {
    setWalletModalTab('withdraw');
    setIsWalletModalOpen(true);
    soundService.playClick();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-app-border bg-app-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4 sm:px-6">
        
        {/* Left: Brand Identity & Navigation */}
        <div className="flex items-center gap-6">
          
          {/* Logo */}
          <button
            onClick={() => {
              setActivePage('trade');
              soundService.playClick();
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-neon-cyan via-app-accent to-neon-purple p-0.5 shadow-neon-cyan/20 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-neon-cyan fill-neon-cyan/30" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xl tracking-tight font-sans text-app-fg flex items-center gap-1 leading-none">
                RO<span className="text-neon-cyan">VA</span>
              </span>
              <span className="text-[9px] font-mono text-neon-green tracking-widest uppercase font-bold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                PREDICTION PROTOCOL
              </span>
            </div>
          </button>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-app-elev/80 border border-app-border-subtle p-1 rounded-xl">
            <button
              onClick={() => {
                setActivePage('trade');
                soundService.playClick();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePage === 'trade'
                  ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 shadow-xs'
                  : 'text-app-fg-muted hover:text-app-fg hover:bg-app-elev-2'
              }`}
            >
              Terminal
            </button>
            <button
              onClick={() => {
                setActivePage('positions');
                soundService.playClick();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePage === 'positions'
                  ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 shadow-xs'
                  : 'text-app-fg-muted hover:text-app-fg hover:bg-app-elev-2'
              }`}
            >
              Positions
            </button>
            <button
              onClick={() => {
                setActivePage('leaderboard');
                soundService.playClick();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePage === 'leaderboard'
                  ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 shadow-xs'
                  : 'text-app-fg-muted hover:text-app-fg hover:bg-app-elev-2'
              }`}
            >
              Reward Pool ($1,000)
            </button>
          </nav>

        </div>

        {/* Right: Controls, Theme Switcher, Balance, Wallet */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl border border-app-border bg-app-elev text-app-fg-muted hover:text-app-fg hover:border-app-accent/40 flex items-center justify-center transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="h-9 w-9 rounded-xl border border-app-border bg-app-elev text-app-fg-muted hover:text-app-fg hover:border-app-accent/40 flex items-center justify-center transition-colors"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-neon-cyan" />}
          </button>

          {/* USDG Balance Card */}
          <button
            onClick={openDeposit}
            className="flex h-9 items-center gap-2.5 rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 px-3 hover:bg-neon-cyan/10 transition-colors"
          >
            <span className="text-[11px] font-mono uppercase text-neon-cyan font-bold tracking-wider">USDG</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-app-fg">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </button>

          {/* Wallet Menu */}
          <div className="relative" ref={dropdownRef}>
            {isWalletConnected ? (
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-9 items-center gap-2 rounded-xl border border-app-border bg-app-elev px-2.5 hover:border-app-accent/40 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="font-mono text-xs text-app-fg font-medium">{walletAddress}</span>
                <ChevronDown className="w-3.5 h-3.5 text-app-fg-dim" />
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-cyber flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-neon-cyan to-app-accent px-4 text-xs font-bold text-obsidian-950 shadow-neon-cyan/20 shadow-md"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect</span>
              </button>
            )}

            {/* Profile Dropdown */}
            {isDropdownOpen && isWalletConnected && (
              <div className="absolute right-0 z-40 mt-2 w-[270px] rounded-2xl border border-app-border bg-app-card p-2.5 shadow-card-glow animate-enter">
                <div className="mb-2 p-2.5 rounded-xl bg-app-elev border border-app-border-subtle">
                  <span className="text-[10px] uppercase font-mono text-app-fg-dim block">Connected Wallet</span>
                  <div className="font-mono text-xs font-bold text-app-fg truncate mt-0.5">{walletAddress}</div>
                  <div className="font-mono text-[11px] text-neon-cyan font-semibold mt-1">Robinhood Chain (4663)</div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setActivePage('positions');
                      setIsDropdownOpen(false);
                      soundService.playClick();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-app-fg-muted hover:text-app-fg hover:bg-app-elev transition-colors"
                  >
                    Positions Ledger
                  </button>

                  <button
                    onClick={() => {
                      setActivePage('leaderboard');
                      setIsDropdownOpen(false);
                      soundService.playClick();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-app-fg-muted hover:text-app-fg hover:bg-app-elev transition-colors"
                  >
                    Daily Prize Leaderboard
                  </button>

                  <button
                    onClick={() => {
                      openDeposit();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-app-fg-muted hover:text-app-fg hover:bg-app-elev transition-colors"
                  >
                    <span>Deposit / Testnet Faucet</span>
                    <span className="text-[10px] bg-neon-green/10 text-neon-green font-bold px-1.5 py-0.5 rounded font-mono">+USDG</span>
                  </button>

                  <button
                    onClick={() => {
                      openWithdraw();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-app-fg-muted hover:text-app-fg hover:bg-app-elev transition-colors"
                  >
                    Withdraw Funds
                  </button>

                  <a
                    href="https://robinhoodchain.blockscout.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-app-fg-muted hover:text-app-fg hover:bg-app-elev transition-colors"
                  >
                    <span>Robinhood Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5 text-app-fg-dim" />
                  </a>
                </div>

                <div className="border-t border-app-border pt-1.5 mt-2">
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-neon-red hover:bg-neon-red/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
