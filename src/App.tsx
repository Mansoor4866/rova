import React from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Header } from './components/Header';
import { AssetTickerBar } from './components/AssetTickerBar';
import { TradingChart } from './components/TradingChart';
import { TradingPanel } from './components/TradingPanel';
import { StatsCard } from './components/StatsCard';
import { LeaderboardCard } from './components/LeaderboardCard';
import { YourCallsCard } from './components/YourCallsCard';
import { WalletModal } from './components/WalletModal';
import { ConnectWalletModal } from './components/ConnectWalletModal';
import { RulesModal } from './components/RulesModal';
import { FullPositionsView } from './components/FullPositionsView';
import { FullLeaderboardView } from './components/FullLeaderboardView';
import { LandingHero } from './components/LandingHero';

export const AppContent: React.FC = () => {
  const { activePage, isConnectModalOpen, setIsConnectModalOpen } = useTrading();

  return (
    <div className="min-h-screen flex flex-col bg-app-bg text-app-fg selection:bg-neon-cyan selection:text-obsidian-950 font-sans">
      {/* Top Header */}
      <Header />

      {/* 3D Landing / Knox-style Hero View */}
      {activePage === 'landing' && <LandingHero />}

      {/* Main Terminal View */}
      {activePage === 'trade' && (
        <>
          {/* Ticker Feed Bar */}
          <AssetTickerBar />

          {/* Main Workspace Layout */}
          <main className="mx-auto max-w-[1240px] px-4 py-4 sm:px-6 flex-1 space-y-5 w-full">
            
            {/* Top Row: Pro Radar Chart + Strike Terminal */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
              <TradingChart />
              <TradingPanel />
            </div>

            {/* Bottom Row: 3-Column Protocol HUD Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <StatsCard />
              <LeaderboardCard />
              <YourCallsCard />
            </div>

          </main>
        </>
      )}

      {/* Full Positions Page */}
      {activePage === 'positions' && (
        <main className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 flex-1 w-full">
          <FullPositionsView />
        </main>
      )}

      {/* Full Leaderboard Page */}
      {activePage === 'leaderboard' && (
        <main className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 flex-1 w-full">
          <FullLeaderboardView />
        </main>
      )}

      {/* Futuristic Footer */}
      <footer className="border-t border-app-border-subtle py-5 mt-auto text-xs text-app-fg-dim font-mono">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
            ROVA Protocol — Next-Gen Micro-Prediction Options on Robinhood Chain
          </span>
          <span className="text-neon-cyan font-bold">USDG Oracle Settlement</span>
        </div>
      </footer>

      {/* Global Modals */}
      <WalletModal />
      <ConnectWalletModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
      <RulesModal />
    </div>
  );
};

export default function App() {
  return (
    <TradingProvider>
      <AppContent />
    </TradingProvider>
  );
}
