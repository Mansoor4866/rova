import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { X, Copy, Check, PlusCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, AlertCircle, Zap } from 'lucide-react';
import { soundService } from '../services/soundService';

export const WalletModal: React.FC = () => {
  const {
    isWalletModalOpen,
    setIsWalletModalOpen,
    walletModalTab,
    setWalletModalTab,
    balance,
    depositDemoFunds,
    withdrawDemoFunds
  } = useTrading();

  const [withdrawAmount, setWithdrawAmount] = useState<string>('50');
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isWalletModalOpen) return null;

  const depositAddress = "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168";

  const handleClose = () => {
    setIsWalletModalOpen(false);
    setSuccessMsg(null);
    setErrorMsg(null);
    soundService.playClick();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    soundService.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFaucetDeposit = (amt: number) => {
    depositDemoFunds(amt);
    setSuccessMsg(`Successfully credited +$${amt} USDG!`);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount) || 0;
    const res = withdrawDemoFunds(amt);
    if (!res.success) {
      setErrorMsg(res.message || 'Withdrawal failed');
      setSuccessMsg(null);
    } else {
      setSuccessMsg(`Successfully withdrawn $${amt.toFixed(2)} USDG to your wallet.`);
      setErrorMsg(null);
      setTimeout(() => setSuccessMsg(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-6 animate-enter">
      <div className="w-full max-w-[460px] overflow-y-auto rounded-b-none p-6 sm:rounded-b-[24px] bg-app-card rounded-2xl border border-app-border shadow-card-glow relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-app-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-app-fg tracking-tight font-sans">
                ROVA Wallet Hub
              </h3>
              <p className="text-xs text-app-fg-muted">
                Robinhood Chain (Chain ID: 4663)
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

        {/* Balance Card */}
        <div className="rounded-xl bg-app-elev border border-app-border p-4 my-4 flex items-center justify-between font-mono">
          <div>
            <span className="text-[10px] uppercase text-app-fg-dim block font-sans font-bold">Settlement Collateral</span>
            <span className="text-2xl font-black text-app-fg">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-xs bg-neon-cyan/15 border border-neon-cyan/30 px-3 py-1 rounded-lg font-bold text-neon-cyan">
            USDG
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-app-elev p-1 rounded-xl mb-4 border border-app-border-subtle">
          <button
            onClick={() => {
              setWalletModalTab('deposit');
              setSuccessMsg(null);
              setErrorMsg(null);
              soundService.playClick();
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              walletModalTab === 'deposit'
                ? 'bg-gradient-to-r from-neon-cyan to-app-accent text-obsidian-950 shadow-xs'
                : 'text-app-fg-muted hover:text-app-fg'
            }`}
          >
            Deposit & Faucet
          </button>
          <button
            onClick={() => {
              setWalletModalTab('withdraw');
              setSuccessMsg(null);
              setErrorMsg(null);
              soundService.playClick();
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              walletModalTab === 'withdraw'
                ? 'bg-gradient-to-r from-neon-cyan to-app-accent text-obsidian-950 shadow-xs'
                : 'text-app-fg-muted hover:text-app-fg'
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-neon-green/10 border border-neon-green/30 text-xs text-neon-green font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-neon-red/10 border border-neon-red/30 text-xs text-neon-red font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Deposit */}
        {walletModalTab === 'deposit' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-app-fg-muted uppercase tracking-wider mb-2 block font-sans">
                Instant Testnet Faucet (Claim USDG)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleFaucetDeposit(amt)}
                    className="py-2.5 rounded-xl bg-app-elev hover:bg-app-elev-2 text-xs font-mono font-bold text-app-fg border border-app-border hover:border-neon-cyan/50 transition-all"
                  >
                    +${amt}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-app-fg-dim">
                Select any tier to instantly refill testnet balance.
              </p>
            </div>

            <div className="border-t border-app-border-subtle pt-3">
              <label className="text-xs font-bold text-app-fg-muted uppercase tracking-wider mb-1.5 block font-sans">
                Robinhood Smart Contract Address
              </label>
              <div className="flex items-center gap-2 bg-app-elev border border-app-border rounded-xl p-2 font-mono text-xs">
                <span className="truncate text-app-fg-muted flex-1">{depositAddress}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-app-card hover:bg-app-elev text-app-fg border border-app-border transition-colors shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Withdraw */}
        {walletModalTab === 'withdraw' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-app-fg-muted uppercase tracking-wider mb-1.5 block font-sans">
                Withdrawal Amount (USDG)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-app-fg-dim">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  max={balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-app-elev border border-app-border rounded-xl pl-8 pr-16 py-2.5 font-mono font-bold text-base text-app-fg focus:outline-none focus:border-neon-cyan"
                />
                <button
                  onClick={() => setWithdrawAmount(balance.toFixed(2))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-app-card border border-app-border text-[11px] font-mono font-bold text-neon-cyan hover:bg-app-elev"
                >
                  Max
                </button>
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-app-accent hover:opacity-95 text-obsidian-950 font-extrabold text-sm transition-all shadow-md font-sans"
            >
              Execute Withdrawal
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
