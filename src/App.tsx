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
import { FactoLanding } from './components/FactoLanding';

export const AppContent: React.FC = () => {
  const { activePage, isConnectModalOpen, setIsConnectModalOpen } = useTrading();

  return (
    <div className="min-h-screen flex flex-col bg-app-bg text-app-fg font-sans selection:bg-facto-pink selection:text-white antialiased">
      
      {/* Facto Island Header */}
      <Header />

      {/* Facto Neo-Fintech Landing / Overview View */}
      {activePage === 'landing' && <FactoLanding />}

      {/* Main Terminal View */}
      {activePage === 'trade' && (
        <div className="flex-1 flex flex-col pt-4">
          {/* Ticker Feed Bar */}
          <AssetTickerBar />

          {/* Main Workspace Layout */}
          <main className="mx-auto max-w-[1360px] px-4 py-4 sm:px-6 flex-1 space-y-5 w-full">
            
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
        </div>
      )}

      {/* Full Positions Page */}
      {activePage === 'positions' && (
        <main className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 flex-1 w-full">
          <FullPositionsView />
        </main>
      )}

      {/* Full Leaderboard Page */}
      {activePage === 'leaderboard' && (
        <main className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 flex-1 w-full">
          <FullLeaderboardView />
        </main>
      )}

      {/* Facto Minimalist Footer */}
      <footer className="border-t border-app-border py-8 mt-auto text-xs text-app-fg-muted font-sans">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-app-fg">ROVA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-facto-pink" />
            <span className="text-app-fg-muted">Permissionless Micro-Predictions on Robinhood Chain</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px] text-app-fg-dim">
            <span>ORACLE SETTLEMENT</span>
            <span>USDG VAULT</span>
            <span>ZERO GAS</span>
          </div>
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
