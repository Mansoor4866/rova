import React, { useEffect, useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { priceFeedService } from '../services/priceFeed';
import { ArrowUp, ArrowDown, Clock, Target, Sparkles } from 'lucide-react';

export const ActivePositions: React.FC = () => {
  const { activePositions } = useTrading();
  const [, setTick] = useState(0);

  // Force re-render for smooth 100ms countdown progress
  useEffect(() => {
    if (activePositions.length === 0) return;
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 100);
    return () => clearInterval(timer);
  }, [activePositions.length]);

  if (activePositions.length === 0) {
    return null;
  }

  const now = Date.now();

  return (
    <div className="bg-card rounded-2xl border border-line p-4 sm:p-6 shadow-xs">
      
      <div className="flex items-center justify-between pb-3 border-b border-line/60 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-up animate-ping" />
          <h2 className="font-bold text-sm sm:text-base text-fg tracking-tight">
            Active Prediction Rounds ({activePositions.length})
          </h2>
        </div>
        <span className="text-xs font-mono text-fg-2">
          Live Oracle Settlement
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activePositions.map((pos) => {
          const currentPrice = priceFeedService.getCurrentPrice(pos.assetSymbol);
          const isUp = pos.direction === 'UP';
          const inProfit = isUp ? (currentPrice > pos.strikePrice) : (currentPrice < pos.strikePrice);
          const priceDiff = currentPrice - pos.strikePrice;
          const priceDiffPercent = ((currentPrice - pos.strikePrice) / pos.strikePrice) * 100;

          const totalDurationMs = pos.durationSeconds * 1000;
          const elapsedMs = Math.max(0, now - pos.createdAt);
          const remainingMs = Math.max(0, pos.expiresAt - now);
          const remainingSec = Math.ceil(remainingMs / 1000);
          const progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalDurationMs) * 100));

          return (
            <div
              key={pos.id}
              className={`rounded-xl border p-3.5 transition-all relative overflow-hidden bg-elev/30 ${
                inProfit
                  ? 'border-up/50 strike-glow-up bg-up/5'
                  : 'border-down/40 bg-down/5'
              }`}
            >
              {/* Top Row: Symbol, Direction, Timer */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs flex items-center gap-1 text-white ${
                    isUp ? 'bg-up' : 'bg-down'
                  }`}>
                    {isUp ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                    {pos.direction}
                  </span>
                  <span className="font-bold text-sm text-fg">
                    {pos.assetSymbol}
                  </span>
                </div>

                {/* Remaining Seconds Badge */}
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-fg text-white font-mono font-bold text-xs">
                  <Clock className="w-3.5 h-3.5 text-white/80" />
                  <span>{remainingSec}s left</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-elev rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-100 ${isUp ? 'bg-up' : 'bg-down'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Prices & Target Delta */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono mb-2 bg-card/80 p-2 rounded-lg border border-line/60">
                <div>
                  <span className="text-[10px] text-fg-3 block uppercase">Strike</span>
                  <span className="font-bold text-fg">${pos.strikePrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-fg-3 block uppercase">Live Price</span>
                  <span className={`font-bold ${inProfit ? 'text-up' : 'text-down'}`}>
                    ${currentPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-fg-3 block uppercase">Payout</span>
                  <span className="font-bold text-fg font-mono">
                    ${pos.potentialPayout.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Live Status Banner */}
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono font-semibold flex items-center gap-1 ${
                  inProfit ? 'text-up' : 'text-down'
                }`}>
                  {inProfit ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      IN PROFIT (+{Math.abs(priceDiffPercent).toFixed(3)}%)
                    </>
                  ) : (
                    <>
                      OUT OF MONEY ({priceDiffPercent > 0 ? '+' : ''}{priceDiffPercent.toFixed(3)}%)
                    </>
                  )}
                </span>
                <span className="text-fg-3 font-mono text-[11px]">
                  Bet: ${pos.amount.toFixed(2)}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
