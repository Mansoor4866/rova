import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { priceFeedService } from '../services/priceFeed';
import { ArrowUp, ArrowDown, Clock, Layers, ArrowLeft, Target, ShieldCheck } from 'lucide-react';
import { soundService } from '../services/soundService';

export const FullPositionsView: React.FC = () => {
  const { activePositions, settledPositions, setActivePage } = useTrading();
  const [filter, setFilter] = useState<'all' | 'open' | 'settled'>('all');

  const now = Date.now();

  return (
    <div className="space-y-6 animate-enter">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActivePage('trade');
              soundService.playClick();
            }}
            className="p-2.5 rounded-xl bg-app-card border border-app-border text-app-fg hover:border-app-accent transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-app-fg font-sans flex items-center gap-2">
              <span>Strike Positions & Ledger</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan font-bold">
                PRO HUD
              </span>
            </h1>
            <p className="text-xs text-app-fg-muted">
              Live settlement delta tracking on Robinhood Chain
            </p>
          </div>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center bg-app-elev border border-app-border rounded-xl p-1 text-xs font-bold">
          {(['all', 'open', 'settled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                soundService.playClick();
              }}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-all ${
                filter === f
                  ? 'bg-neon-cyan/20 text-neon-cyan font-black border border-neon-cyan/30 shadow-xs'
                  : 'text-app-fg-muted hover:text-app-fg'
              }`}
            >
              {f} ({f === 'all' ? activePositions.length + settledPositions.length : f === 'open' ? activePositions.length : settledPositions.length})
            </button>
          ))}
        </div>
      </div>

      {/* Active Rounds */}
      {(filter === 'all' || filter === 'open') && activePositions.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 shadow-card-glow">
          <h2 className="font-extrabold text-sm text-app-fg pb-3 border-b border-app-border-subtle mb-3 flex items-center gap-2 font-sans">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
            <span>Active Rounds ({activePositions.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activePositions.map((pos) => {
              const currentPrice = priceFeedService.getCurrentPrice(pos.assetSymbol);
              const isUp = pos.direction === 'UP';
              const inProfit = isUp ? (currentPrice > pos.strikePrice) : (currentPrice < pos.strikePrice);
              const remainingSec = Math.max(0, Math.ceil((pos.expiresAt - now) / 1000));

              return (
                <div key={pos.id} className={`p-4 rounded-xl border ${inProfit ? 'border-neon-green/60 bg-neon-green/5 shadow-neon-green/10 shadow-sm' : 'border-neon-red/50 bg-neon-red/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono font-black text-xs ${isUp ? 'bg-neon-green text-obsidian-950' : 'bg-neon-red text-white'}`}>
                        {isUp ? 'LONG' : 'SHORT'}
                      </span>
                      <span className="font-bold text-sm text-app-fg">{pos.assetSymbol}</span>
                      <span className="text-xs text-app-fg-dim font-mono">${pos.amount}</span>
                    </div>
                    <span className="font-mono text-xs font-bold bg-app-elev border border-app-border text-neon-cyan px-2.5 py-0.5 rounded-full">
                      {remainingSec}s left
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs mt-2 bg-app-elev p-2.5 rounded-lg border border-app-border">
                    <div>
                      <span className="text-[10px] text-app-fg-dim block uppercase font-bold">Strike Target</span>
                      <span className="font-bold text-app-fg">${pos.strikePrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-app-fg-dim block uppercase font-bold">Current Live</span>
                      <span className={`font-bold ${inProfit ? 'text-neon-green' : 'text-neon-red'}`}>${currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-app-fg-dim block uppercase font-bold">Est. Payout</span>
                      <span className="font-bold text-app-fg">${pos.potentialPayout.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settled History */}
      {(filter === 'all' || filter === 'settled') && (
        <div className="glass-panel rounded-2xl p-5 shadow-card-glow">
          <h2 className="font-extrabold text-sm text-app-fg pb-3 border-b border-app-border-subtle mb-3 font-sans">
            Settled History Ledger ({settledPositions.length})
          </h2>
          {settledPositions.length === 0 ? (
            <div className="py-12 text-center text-app-fg-muted text-xs font-sans">
              No settled prediction strikes yet.
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-app-border text-app-fg-dim uppercase text-[10px]">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Asset</th>
                    <th className="pb-2">Direction</th>
                    <th className="pb-2">Position</th>
                    <th className="pb-2">Strike → Close</th>
                    <th className="pb-2">Payout</th>
                    <th className="pb-2 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border-subtle">
                  {settledPositions.map((pos) => {
                    const isWon = pos.status === 'WON';
                    const isUp = pos.direction === 'UP';

                    return (
                      <tr key={pos.id} className="hover:bg-app-elev/50 transition-colors">
                        <td className="py-2.5 text-app-fg-dim text-[11px]">
                          {new Date(pos.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 font-bold text-app-fg font-sans">
                          {pos.assetSymbol}
                        </td>
                        <td className="py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isUp ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'}`}>
                            {isUp ? 'LONG' : 'SHORT'}
                          </span>
                        </td>
                        <td className="py-2.5 text-app-fg">
                          ${pos.amount.toFixed(2)}
                        </td>
                        <td className="py-2.5 text-app-fg-muted">
                          ${pos.strikePrice.toFixed(2)} → ${pos.closePrice ? pos.closePrice.toFixed(2) : '-'}
                        </td>
                        <td className="py-2.5 font-bold">
                          <span className={isWon ? 'text-neon-green' : 'text-app-fg-dim'}>
                            {isWon ? `+$${(pos.payout || 0).toFixed(2)}` : '$0.00'}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${isWon ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : 'bg-neon-red/10 text-neon-red border border-neon-red/30'}`}>
                            {isWon ? 'WON (+90%)' : 'LOST'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
