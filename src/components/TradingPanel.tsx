import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { ArrowUp, ArrowDown, Zap, ShieldCheck, DollarSign, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { soundService } from '../services/soundService';

export const TradingPanel: React.FC = () => {
  const {
    selectedAsset,
    selectedDuration,
    setSelectedDuration,
    durations,
    payoutMultiplier,
    balance,
    placePosition,
    setIsWalletModalOpen,
    setWalletModalTab
  } = useTrading();

  const [tradeAmount, setTradeAmount] = useState<string>('10');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const numericAmount = parseFloat(tradeAmount) || 0;
  const potentialPayout = numericAmount * payoutMultiplier;
  const potentialProfit = potentialPayout - numericAmount;

  const quickAmounts = [5, 10, 25, 50, 100];

  const handleQuickSelect = (amt: number) => {
    setTradeAmount(amt.toString());
    setErrorMessage(null);
    soundService.playClick();
  };

  const handleMax = () => {
    setTradeAmount(Math.floor(balance).toString());
    setErrorMessage(null);
    soundService.playClick();
  };

  const handleTrade = (direction: 'UP' | 'DOWN') => {
    if (numericAmount <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }
    if (numericAmount > balance) {
      setErrorMessage('Insufficient balance. Click deposit to add test funds.');
      return;
    }

    const res = placePosition(direction, numericAmount);
    if (!res.success) {
      setErrorMessage(res.message || 'Trade failed');
    } else {
      setErrorMessage(null);
    }
  };

  const formatDurationLabel = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    return `${sec / 60}m`;
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-card-glow flex flex-col justify-between">
      
      <div>
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-app-border-subtle mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-cyan fill-neon-cyan/20" />
            <span className="font-extrabold text-sm sm:text-base text-app-fg tracking-tight font-sans">
              Instant Strike Terminal
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-neon-green bg-neon-green/10 border border-neon-green/20 px-2 py-0.5 rounded-md font-bold">
            <span>1.90x Multiplier</span>
          </div>
        </div>

        {/* Expiry Duration Selector */}
        <div className="mb-4">
          <label className="text-[11px] font-bold text-app-fg-muted uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
            <Clock className="w-3.5 h-3.5 text-neon-cyan" />
            <span>Target Expiry Duration</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setSelectedDuration(d);
                  soundService.playClick();
                }}
                className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedDuration === d
                    ? 'bg-gradient-to-r from-neon-cyan to-app-accent text-obsidian-950 shadow-neon-cyan/20 shadow-md font-extrabold scale-[1.02]'
                    : 'bg-app-elev text-app-fg-muted hover:text-app-fg hover:bg-app-elev-2 border border-app-border-subtle'
                }`}
              >
                {formatDurationLabel(d)}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold text-app-fg-muted uppercase tracking-wider flex items-center gap-1 font-sans">
              <DollarSign className="w-3.5 h-3.5 text-neon-cyan" />
              <span>Position Size (USDG)</span>
            </label>
            <span className="text-xs font-mono text-app-fg-dim">
              Bal: ${balance.toFixed(2)}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-app-fg-dim text-base">
              $
            </span>
            <input
              type="number"
              min="1"
              max="10000"
              value={tradeAmount}
              onChange={(e) => {
                setTradeAmount(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="0.00"
              className="w-full bg-app-elev border border-app-border rounded-xl pl-8 pr-16 py-2.5 font-mono font-bold text-lg text-app-fg focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 transition-all"
            />
            <button
              onClick={handleMax}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-app-card border border-app-border text-[11px] font-mono font-bold text-neon-cyan hover:bg-app-elev transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Quick Amount Pills */}
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => handleQuickSelect(amt)}
              className={`py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                numericAmount === amt
                  ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan font-bold shadow-xs'
                  : 'bg-app-elev border-app-border-subtle text-app-fg-muted hover:bg-app-elev-2 hover:text-app-fg'
              }`}
            >
              +${amt}
            </button>
          ))}
        </div>

        {/* Payout & Return Simulator */}
        <div className="bg-app-elev/80 border border-app-border rounded-xl p-3.5 mb-4 space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-app-fg-muted font-sans">Locked Strike:</span>
            <span className="font-bold text-app-fg">
              ${selectedAsset.price < 1 ? selectedAsset.price.toFixed(selectedAsset.decimals) : selectedAsset.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-app-fg-muted font-sans">Payout Rate:</span>
            <span className="font-bold text-neon-green">1.90x (+90% ROI)</span>
          </div>
          <div className="border-t border-app-border-subtle pt-2 flex items-center justify-between">
            <span className="text-xs font-bold text-app-fg font-sans">Potential Return:</span>
            <div className="text-right">
              <span className="font-bold text-base text-app-fg block">
                ${potentialPayout.toFixed(2)} USDG
              </span>
              <span className="text-[11px] text-neon-green font-semibold">
                (+${potentialProfit.toFixed(2)} profit)
              </span>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-neon-red/10 border border-neon-red/30 flex items-center justify-between gap-2 text-xs text-neon-red font-medium">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {numericAmount > balance && (
              <button
                onClick={() => {
                  setWalletModalTab('deposit');
                  setIsWalletModalOpen(true);
                }}
                className="px-2 py-0.5 rounded bg-neon-red text-white text-[10px] font-bold uppercase shrink-0"
              >
                Faucet
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main LONG / SHORT Glowing Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        
        {/* LONG / BULL Button */}
        <button
          onClick={() => handleTrade('UP')}
          className="btn-cyber group bg-gradient-to-b from-neon-green to-[#00b377] hover:shadow-neon-green text-obsidian-950 rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center font-bold shadow-md transition-all"
        >
          <div className="flex items-center gap-1.5 text-base sm:text-lg font-black tracking-tight">
            <ArrowUp className="w-5 h-5 stroke-[3] transition-transform group-hover:-translate-y-1" />
            <span>LONG (UP)</span>
          </div>
          <span className="text-[10px] font-mono font-extrabold uppercase opacity-80 mt-0.5">
            Target Higher
          </span>
        </button>

        {/* SHORT / BEAR Button */}
        <button
          onClick={() => handleTrade('DOWN')}
          className="btn-cyber group bg-gradient-to-b from-neon-red to-[#d92640] hover:shadow-neon-red text-white rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center font-bold shadow-md transition-all"
        >
          <div className="flex items-center gap-1.5 text-base sm:text-lg font-black tracking-tight">
            <ArrowDown className="w-5 h-5 stroke-[3] transition-transform group-hover:translate-y-1" />
            <span>SHORT (DOWN)</span>
          </div>
          <span className="text-[10px] font-mono font-extrabold uppercase opacity-80 mt-0.5">
            Target Lower
          </span>
        </button>

      </div>

    </div>
  );
};
