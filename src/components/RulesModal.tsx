import React from 'react';
import { useTrading } from '../context/TradingContext';
import { X, HelpCircle, ArrowUp, ArrowDown, Zap, Clock, ShieldCheck, Crosshair } from 'lucide-react';
import { soundService } from '../services/soundService';

export const RulesModal: React.FC = () => {
  const { isRulesOpen, setIsRulesOpen } = useTrading();

  if (!isRulesOpen) return null;

  const handleClose = () => {
    setIsRulesOpen(false);
    soundService.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-6 animate-enter">
      <div className="w-full max-w-lg rounded-b-none p-6 sm:rounded-b-[24px] bg-app-card rounded-2xl border border-app-border shadow-card-glow relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-app-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-app-fg tracking-tight font-sans">
                ROVA Protocol Rules
              </h3>
              <p className="text-xs text-app-fg-muted">
                Micro-prediction execution & payout mechanics
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-app-elev border border-app-border text-app-fg-muted hover:text-app-fg hover:border-app-accent transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3 my-4">
          
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-app-elev border border-app-border">
            <div className="w-7 h-7 rounded-lg bg-neon-cyan text-obsidian-950 flex items-center justify-center font-black text-xs shrink-0 font-mono">
              01
            </div>
            <div>
              <h4 className="font-bold text-xs text-app-fg font-sans">Select Market & Expiry Target</h4>
              <p className="text-xs text-app-fg-muted mt-0.5">
                Choose any asset feed (NVDA, TSLA, BTC, SOL) and lock in an expiry duration from 15 seconds to 10 minutes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-app-elev border border-app-border">
            <div className="w-7 h-7 rounded-lg bg-neon-green text-obsidian-950 flex items-center justify-center font-black text-xs shrink-0 font-mono">
              02
            </div>
            <div>
              <h4 className="font-bold text-xs text-app-fg font-sans">Execute LONG or SHORT</h4>
              <p className="text-xs text-app-fg-muted mt-0.5">
                Hit <strong>LONG (Green)</strong> if you anticipate price will exceed strike at countdown zero, or <strong>SHORT (Red)</strong> if lower.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-app-elev border border-app-border">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-obsidian-950 flex items-center justify-center font-black text-xs shrink-0 font-mono">
              03
            </div>
            <div>
              <h4 className="font-bold text-xs text-app-fg font-sans">Instant 1.90x (+90% ROI) Settlement</h4>
              <p className="text-xs text-app-fg-muted mt-0.5">
                At 0s expiry, the oracle instantly verifies close price and credits your wallet +90% profit in USDG automatically.
              </p>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={handleClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-app-accent hover:opacity-95 text-obsidian-950 font-black text-sm transition-all shadow-md font-sans"
        >
          Enter ROVA Terminal
        </button>

      </div>
    </div>
  );
};
