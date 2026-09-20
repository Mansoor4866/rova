import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { Trophy, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { soundService } from '../services/soundService';

export const LeaderboardCard: React.FC = () => {
  const { stats, leaderboard, setActivePage } = useTrading();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextMidnightUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0
      ));
      const diffMs = nextMidnightUTC.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-card-glow flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-app-border-subtle mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-[15px] text-app-fg tracking-tight font-sans">
              Daily Reward Pool
            </h3>
          </div>
          <button
            onClick={() => {
              setActivePage('leaderboard');
              soundService.playClick();
            }}
            className="text-xs font-bold text-neon-cyan hover:underline flex items-center gap-0.5"
          >
            <span>Full Arena</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Reward Pool Banner */}
        <div className="rounded-xl bg-app-elev border border-app-border p-3.5 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-app-fg-dim font-bold">Today's Grand Pool</span>
            <span className="text-[11px] font-mono text-neon-cyan flex items-center gap-1 font-semibold">
              <Clock className="w-3 h-3" />
              <span>Resets: <strong>{timeLeft}</strong></span>
            </span>
          </div>
          <div className="font-mono font-black text-2xl text-app-fg tracking-tight">
            ${stats.rewardPool.toLocaleString()} USDG
          </div>
          <p className="text-[11px] text-app-fg-muted mt-1 leading-tight">
            20% platform trading fees split pro-rata among top 10 daily volume leaders.
          </p>
        </div>

        {/* Top 3 Preview */}
        <div className="space-y-2">
          {leaderboard.slice(0, 3).map((user) => (
            <div key={user.rank} className="flex items-center justify-between text-xs py-1 border-b border-app-border-subtle last:border-0 font-mono">
              <div className="flex items-center gap-2 font-sans">
                <span className="font-mono font-bold text-[11px] w-4 text-neon-cyan">#{user.rank}</span>
                <span className="font-bold text-app-fg">{user.username}</span>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-app-fg">${user.volume.toLocaleString()}</span>
                <span className="text-[10px] text-amber-400 block font-semibold">+${user.prize} pool</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-app-border-subtle mt-3 text-[11px] text-app-fg-dim font-mono">
        Settled volume resets midnight UTC
      </div>

    </div>
  );
};
