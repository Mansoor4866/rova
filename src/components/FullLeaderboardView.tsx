import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { Trophy, Clock, Medal, ArrowLeft, Users, DollarSign, Sparkles } from 'lucide-react';
import { soundService } from '../services/soundService';

export const FullLeaderboardView: React.FC = () => {
  const { leaderboard, stats, setActivePage } = useTrading();
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

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-amber-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="font-mono font-bold text-xs text-neon-cyan">#{rank}</span>;
  };

  return (
    <div className="space-y-6 animate-enter">
      
      {/* Header */}
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
            <span>Daily Arena Prize Pool</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 font-bold border border-amber-400/30">
              $1,000 USDG
            </span>
          </h1>
          <p className="text-xs text-app-fg-muted">
            Top 10 volume traders receive pro-rata prize distributions at UTC midnight
          </p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel shadow-card-glow border-t-2 border-t-amber-400">
          <span className="text-xs text-app-fg-dim uppercase font-mono font-bold block">Prize Reward Pool</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-app-fg mt-1 block">
            ${stats.rewardPool.toLocaleString()} USDG
          </span>
          <span className="text-[11px] text-neon-green font-semibold mt-1 block">
            Pro-rata payout for Top 10
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-panel shadow-card-glow border-t-2 border-t-neon-cyan">
          <span className="text-xs text-app-fg-dim uppercase font-mono font-bold block">Reset Countdown (UTC)</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-neon-cyan mt-1 block">
            {timeLeft}
          </span>
          <span className="text-[11px] text-app-fg-muted mt-1 block">
            Automated on-chain distribution
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-panel shadow-card-glow border-t-2 border-t-neon-green">
          <span className="text-xs text-app-fg-dim uppercase font-mono font-bold block">Today's Total Settled</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-neon-green mt-1 block">
            ${stats.todayVolume.toLocaleString()} USDG
          </span>
          <span className="text-[11px] text-app-fg-muted mt-1 block">
            Across {stats.todayTrades} executed strikes
          </span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl p-5 shadow-card-glow">
        <h2 className="font-extrabold text-sm text-app-fg pb-3 border-b border-app-border-subtle mb-3 font-sans">
          Live Arena Rankings by Settled Volume
        </h2>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-app-border text-app-fg-dim uppercase text-[10px]">
                <th className="pb-2.5">Rank</th>
                <th className="pb-2.5">Trader</th>
                <th className="pb-2.5">Settled Volume</th>
                <th className="pb-2.5">Total Net PnL</th>
                <th className="pb-2.5">Win Rate</th>
                <th className="pb-2.5 text-right">Pool Prize</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border-subtle">
              {leaderboard.map((user) => (
                <tr key={user.rank} className="hover:bg-app-elev/50 transition-colors">
                  <td className="py-3.5 flex items-center gap-2">
                    {getRankBadge(user.rank)}
                  </td>
                  <td className="py-3.5 font-sans">
                    <div className="flex flex-col">
                      <span className="font-bold text-app-fg text-sm">{user.username}</span>
                      <span className="text-[11px] text-app-fg-dim font-mono">{user.address}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-app-fg font-black text-sm">
                    ${user.volume.toLocaleString()} USDG
                  </td>
                  <td className="py-3.5 text-neon-green font-bold text-sm">
                    +${user.pnl.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-app-fg-muted font-bold">
                    {user.winRate}%
                  </td>
                  <td className="py-3.5 text-right font-black text-amber-400 text-sm">
                    +${user.prize} USDG
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
