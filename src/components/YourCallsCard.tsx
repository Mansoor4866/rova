import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { priceFeedService } from '../services/priceFeed';
import { ArrowUp, ArrowDown, Clock, CheckCircle2, XCircle, Sparkles, Target } from 'lucide-react';
import { soundService } from '../services/soundService';

export const YourCallsCard: React.FC = () => {
  const { activePositions, settledPositions } = useTrading();
  const [tab, setTab] = useState<'open' | 'all'>('open');

  const now = Date.now();

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-card-glow flex flex-col justify-between">
      
      <div>
        {/* Header & Tabs */}
        <div className="flex items-center justify-between pb-3 border-b border-app-border-subtle mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-neon-cyan" />
            <h3 className="font-extrabold text-[15px] text-app-fg tracking-tight font-sans">
              Your Strikes
            </h3>
          </div>
          <div className="flex items-center bg-app-elev border border-app-border-subtle rounded-xl p-0.5">
            <button
              onClick={() => {
                setTab('open');
                soundService.playClick();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                tab === 'open'
                  ? 'bg-neon-cyan/20 text-neon-cyan font-bold shadow-xs'
                  : 'text-app-fg-muted hover:text-app-fg'
              }`}
            >
              Live ({activePositions.length})
            </button>
            <button
              onClick={() => {
                setTab('all');
                soundService.playClick();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                tab === 'all'
                  ? 'bg-neon-cyan/20 text-neon-cyan font-bold shadow-xs'
                  : 'text-app-fg-muted hover:text-app-fg'
              }`}
            >
              History ({settledPositions.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Live Open Strikes */}
        {tab === 'open' && (
          <div>
            {activePositions.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-10 h-10 rounded-2xl bg-app-elev border border-app-border-subtle flex items-center justify-center mx-auto mb-2 text-app-fg-dim">
                  <Clock className="w-5 h-5 text-neon-cyan" />
                </div>
                <h4 className="font-bold text-xs text-app-fg font-sans">No Active Strikes</h4>
                <p className="text-[11px] text-app-fg-muted mt-0.5 max-w-[210px] mx-auto">
                  Execute LONG or SHORT above to activate real-time target rounds.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto no-scrollbar">
                {activePositions.map((pos) => {
                  const currentPrice = priceFeedService.getCurrentPrice(pos.assetSymbol);
                  const isUp = pos.direction === 'UP';
                  const inProfit = isUp ? (currentPrice > pos.strikePrice) : (currentPrice < pos.strikePrice);
                  const remainingSec = Math.max(0, Math.ceil((pos.expiresAt - now) / 1000));

                  return (
                    <div
                      key={pos.id}
                      className={`p-3 rounded-xl border transition-all text-xs font-mono ${
                        inProfit
                          ? 'border-neon-green/60 bg-neon-green/5 shadow-xs'
                          : 'border-neon-red/50 bg-neon-red/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className={`px-1.5 py-0.5 rounded-md text-white text-[10px] font-bold ${isUp ? 'bg-neon-green text-obsidian-950' : 'bg-neon-red text-white'}`}>
                            {isUp ? 'LONG' : 'SHORT'}
                          </span>
                          <span className="font-bold text-app-fg">{pos.assetSymbol}</span>
                          <span className="text-[11px] text-app-fg-dim font-mono">${pos.amount}</span>
                        </div>
                        <span className="font-bold text-app-fg bg-app-elev border border-app-border px-2 py-0.5 rounded-md text-[11px]">
                          {remainingSec}s
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-app-fg-dim">Target: ${pos.strikePrice.toFixed(2)}</span>
                        <span className={`font-bold ${inProfit ? 'text-neon-green' : 'text-neon-red'}`}>
                          ${currentPrice.toFixed(2)} ({inProfit ? 'In Profit' : 'Out'})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Settled History */}
        {tab === 'all' && (
          <div>
            {settledPositions.length === 0 ? (
              <div className="py-8 text-center">
                <h4 className="font-bold text-xs text-app-fg font-sans">No settled rounds yet</h4>
                <p className="text-[11px] text-app-fg-muted mt-0.5">
                  Your payouts and settled rounds will display here.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
                {settledPositions.slice(0, 5).map((pos) => {
                  const isWon = pos.status === 'WON';
                  const isUp = pos.direction === 'UP';

                  return (
                    <div key={pos.id} className="flex items-center justify-between text-xs py-1.5 border-b border-app-border-subtle last:border-0 font-mono">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isUp ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'}`}>
                          {isUp ? 'LONG' : 'SHORT'}
                        </span>
                        <span className="font-bold text-app-fg">{pos.assetSymbol}</span>
                        <span className="text-[10px] text-app-fg-dim font-mono">${pos.amount}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${isWon ? 'text-neon-green' : 'text-app-fg-dim'}`}>
                          {isWon ? `+$${(pos.payout || 0).toFixed(2)}` : '$0.00'}
                        </span>
                        <span className={`text-[10px] font-bold block ${isWon ? 'text-neon-green' : 'text-neon-red'}`}>
                          {isWon ? 'WON (+90%)' : 'LOST'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-app-border-subtle mt-3 text-[11px] text-app-fg-dim font-mono">
        High-precision settlement engine
      </div>

    </div>
  );
};
