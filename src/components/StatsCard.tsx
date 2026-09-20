import React from 'react';
import { useTrading } from '../context/TradingContext';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export const StatsCard: React.FC = () => {
  const { stats } = useTrading();

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-card-glow flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-app-border-subtle mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-neon-cyan" />
            <h3 className="font-extrabold text-[15px] text-app-fg tracking-tight font-sans">
              ROVA Protocol Metrics
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-neon-green bg-neon-green/10 border border-neon-green/20 px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            Active Feed
          </span>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3 pt-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-app-fg-muted font-sans">Today's Settled Volume</span>
            <span className="font-mono font-bold text-sm text-app-fg">
              ${stats.todayVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDG
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-app-fg-muted font-sans">Cumulative Platform Volume</span>
            <span className="font-mono font-bold text-sm text-app-fg">
              ${stats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDG
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-app-fg-muted font-sans">Total Payouts Distributed</span>
            <span className="font-mono font-bold text-sm text-neon-green">
              ${stats.totalPayouts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDG
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-app-fg-muted font-sans">Today's Executed Strikes</span>
            <span className="font-mono font-bold text-sm text-app-fg">
              {stats.todayTrades} rounds
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-app-fg-muted font-sans">Active High-Freq Traders</span>
            <span className="font-mono font-bold text-sm text-neon-cyan">
              {stats.todayTraders} online
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-app-border-subtle mt-3 text-[11px] text-app-fg-dim flex items-center justify-between font-mono">
        <span>Execution Latency</span>
        <span className="text-neon-cyan font-bold font-sans">15ms Ultra-Fast</span>
      </div>

    </div>
  );
};
