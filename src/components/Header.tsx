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
  Wallet, 
  Trophy, 
  Layers, 
  RefreshCw,
  Copy,
  Check
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
    fullWalletAddress,
    refreshBalance,
    connectWallet,
    disconnectWallet
  } = useTrading();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
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
    <header className="sticky top-0 z-40 w-full pt-3 px-4 sm:px-6">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-4 sm:px-6 rounded-2xl bg-app-card/90 backdrop-blur-xl border border-app-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
        
        {/* Left: Brand Wordmark (Facto style) */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => {
              setActivePage('landing');
              soundService.playClick();
            }}
            className="flex items-center gap-2 group text-left"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-[-0.04em] font-sans text-app-fg">
                ROVA
              </span>
              <span className="w-2 h-2 rounded-full bg-facto-pink group-hover:scale-125 transition-transform" />
            </div>
          </button>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => {
                setActivePage('landing');
                soundService.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activePage === 'landing'
                  ? 'bg-app-fg text-app-bg font-semibold shadow-xs'
                  : 'text-app-fg-muted hover:text-app-fg hover:bg-app-elev'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setActivePage('trade');
                soundService.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activePage === 'trade'
                  ? 'bg-app-fg text-app-bg font-semibold shadow-xs'
                  : 'text-app-fg-muted hover:text-app-fg hover:bg-app-elev'
              }`}
            >
              Trade Terminal
            </button>
            <button
              onClick={() => {
                setActivePage('positions');
                soundService.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activePage === 'positions'
                  ? 'bg-app-fg text-app-bg font-semibold shadow-xs'
                  : 'text-app-fg-muted hover:text-app-fg hover:bg-app-elev'
              }`}
            >
              Positions
            </button>
            <button
              onClick={() => {
                setActivePage('leaderboard');
                soundService.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activePage === 'leaderboard'
                  ? 'bg-app-fg text-app-bg font-semibold shadow-xs'
                  : 'text-app-fg-muted hover:text-app-fg hover:bg-app-elev'
              }`}
            >
              Reward Pool ($1,000)
            </button>
          </nav>
        </div>

        {/* Right: Balance, Controls, Wallet (Facto styling) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* USDG Live Balance Pill */}
          <div className="flex items-center gap-1">
            <button
              onClick={openDeposit}
              className="flex h-10 items-center gap-2 rounded-xl border border-app-border bg-app-elev px-3.5 hover:bg-app-elev-2 transition-colors"
              title="Click to Deposit / Manage USDG Collateral"
            >
              <span className="text-xs font-mono uppercase text-facto-pink font-bold">USDG</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-app-fg">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </button>
            {isWalletConnected && (
              <button
                onClick={async () => {
                  setIsRefreshing(true);
                  soundService.playClick();
                  await refreshBalance();
                  setTimeout(() => setIsRefreshing(false), 800);
                }}
                disabled={isRefreshing}
                className="h-10 w-9 flex items-center justify-center rounded-xl border border-app-border bg-app-elev hover:bg-app-elev-2 text-app-fg-muted hover:text-app-fg transition-colors"
                title="Refresh Live On-Chain Balance"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-facto-pink' : ''}`} />
              </button>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl border border-app-border bg-app-elev text-app-fg-muted hover:text-app-fg hover:bg-app-elev-2 flex items-center justify-center transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="h-10 w-10 rounded-xl border border-app-border bg-app-elev text-app-fg-muted hover:text-app-fg hover:bg-app-elev-2 flex items-center justify-center transition-colors"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-app-fg" />}
          </button>

          {/* Wallet Menu */}
          <div className="relative" ref={dropdownRef}>
            {isWalletConnected ? (
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-10 items-center gap-2 rounded-xl border border-app-border bg-app-elev px-3 hover:bg-app-elev-2 transition-colors font-mono text-xs text-app-fg font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-facto-green animate-pulse" />
                <span>{walletAddress}</span>
                <ChevronDown className="w-3.5 h-3.5 text-app-fg-dim" />
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="facto-btn-dark h-10 py-0 px-4 text-sm"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect</span>
              </button>
            )}

            {/* Profile Dropdown */}
            {isDropdownOpen && isWalletConnected && (
              <div className="absolute right-0 z-50 mt-2 w-[280px] rounded-2xl border border-app-border bg-app-card p-3 shadow-xl animate-enter">
                <div className="mb-2 p-3 rounded-xl bg-app-elev border border-app-border-subtle">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono text-app-fg-dim">
                    <span>Connected Wallet</span>
                    <button
                      onClick={() => {
                        const addrToCopy = fullWalletAddress || walletAddress || '';
                        navigator.clipboard.writeText(addrToCopy);
                        setCopiedAddr(true);
                        soundService.playClick();
                        setTimeout(() => setCopiedAddr(false), 2000);
                      }}
                      className="text-facto-pink hover:underline flex items-center gap-1 font-semibold"
                    >
                      {copiedAddr ? <Check className="w-3 h-3 text-facto-green" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAddr ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs font-bold text-app-fg truncate mt-0.5">
                    {fullWalletAddress || walletAddress}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-app-border/40">
                    <span className="font-mono text-[11px] text-app-fg-muted">Balance:</span>
                    <span className="font-mono text-xs font-bold text-facto-green">
                      ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDG
                    </span>
                  </div>
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
                    <span className="text-[10px] bg-facto-green/10 text-facto-green font-bold px-1.5 py-0.5 rounded font-mono">+USDG</span>
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
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-facto-red hover:bg-facto-red/10 transition-colors"
                  >
                    Disconnect Wallet
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
