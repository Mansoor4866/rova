import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Rova3DCanvas } from './3d/Rova3DCanvas';
import { 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  Layers,
  Cpu,
  Radio,
  Sliders,
  TrendingUp,
  Award
} from 'lucide-react';
import { soundService } from '../services/soundService';

const CONTRACT_ADDRESS_FULL = '0x752792cA385Fe711202B2a450D95A39c2794c4663';
const CONTRACT_ADDRESS_SHORT = '0x7527...RovaPredictionContract';

export const LandingHero: React.FC = () => {
  const { setActivePage, assets } = useTrading();
  const [copied, setCopied] = useState(false);
  const [colorScheme, setColorScheme] = useState<'crimson' | 'cyan' | 'purple' | 'emerald'>('crimson');
  const [activeModal, setActiveModal] = useState<'features' | 'how' | 'arch' | 'pricing' | null>(null);

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS_FULL);
    setCopied(true);
    soundService.playClick();
    setTimeout(() => setCopied(false), 2200);
  };

  const handleLaunchTerminal = () => {
    soundService.playClick();
    setActivePage('trade');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-[#050608] text-white selection:bg-rose-600 selection:text-white">
      
      {/* 3D WebGL Particle Vortex Background */}
      <Rova3DCanvas colorScheme={colorScheme} speedMultiplier={1} />

      {/* Cyber Grid & Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255, 30, 70, 0.08) 0%, transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px'
        }}
      />

      {/* Top Floating Mini Bar: Contract Address & Interactive Mode */}
      <div className="relative z-10 mx-auto max-w-[1240px] w-full px-4 sm:px-6 pt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Contract Address Chip (Matches Knox top nav pill) */}
        <button
          onClick={handleCopyContract}
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-black/60 px-3.5 py-1.5 backdrop-blur-md hover:border-rose-500/40 hover:bg-black/80 transition-all shadow-sm"
          title="Click to copy Verified Contract Address"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="font-mono text-xs text-neutral-300 group-hover:text-white transition-colors">
            CA: <span className="text-white font-medium">{CONTRACT_ADDRESS_SHORT}</span>
          </span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
          )}
        </button>

        {/* 3D Visual Shader Palette Selector */}
        <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 p-1 rounded-full backdrop-blur-md text-[11px] font-mono">
          <span className="px-2 text-neutral-400 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-rose-500" /> 3D HUD:
          </span>
          {(['crimson', 'cyan', 'purple', 'emerald'] as const).map((scheme) => (
            <button
              key={scheme}
              onClick={() => {
                setColorScheme(scheme);
                soundService.playClick();
              }}
              className={`px-2.5 py-0.5 rounded-full transition-all capitalize font-medium ${
                colorScheme === scheme
                  ? scheme === 'crimson'
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : scheme === 'cyan'
                    ? 'bg-cyan-500 text-black font-bold shadow-xs'
                    : scheme === 'purple'
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'bg-emerald-500 text-black font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {scheme}
            </button>
          ))}
        </div>
      </div>

      {/* Center 3D Hero Display (Identical Knox Hero Structure) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8 sm:py-16 my-auto">
        
        {/* Glow Radial Backdrop behind headline */}
        <div className="absolute w-[600px] h-[300px] bg-gradient-to-r from-rose-600/15 via-transparent to-rose-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Main Massive Knox-style Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter uppercase font-sans text-white leading-[0.92] select-none">
          <span className="block drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
            EVALUATE. PREDICT.
          </span>
          <span className="block mt-1 sm:mt-2">
            RO<span className="text-rose-500 drop-shadow-[0_0_35px_rgba(244,63,94,0.7)]">VA.</span>
          </span>
        </h1>

        {/* Sub-contract Badge Pill with glowing icon */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center">
          <button
            onClick={handleCopyContract}
            className="group flex items-center gap-2.5 rounded-md border border-white/15 bg-black/70 px-4 py-2 text-xs sm:text-sm font-mono backdrop-blur-md hover:border-rose-500/50 hover:bg-black/90 transition-all shadow-lg"
          >
            <span className="w-2.5 h-2.5 bg-rose-600 rounded-xs" />
            <span className="text-neutral-300 group-hover:text-white transition-colors">
              CA: <span className="font-semibold text-white">{CONTRACT_ADDRESS_SHORT}</span>
            </span>
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs ml-1">
                <Check className="w-3.5 h-3.5" /> COPIED
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors ml-1" />
            )}
          </button>
        </div>

        {/* Hero Cyberpunk Split Action Button (Knox red arrow + white button) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleLaunchTerminal}
            className="group flex items-center rounded-none bg-white text-black font-mono font-bold tracking-wider uppercase text-sm sm:text-base hover:bg-neutral-100 transition-all duration-200 shadow-[0_0_35px_rgba(244,63,94,0.35)] hover:shadow-[0_0_50px_rgba(244,63,94,0.55)] active:scale-[0.98]"
          >
            {/* Split red arrow box */}
            <span className="flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 bg-rose-600 text-white group-hover:bg-rose-500 transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Text label */}
            <span className="px-6 sm:px-8 py-3.5 text-black">
              LAUNCH PREDICTION EXCHANGE
            </span>
          </button>

          {/* Quick Secondary Button */}
          <button
            onClick={() => setActiveModal('features')}
            className="flex items-center gap-2 rounded-none border border-white/20 bg-black/50 px-6 py-3.5 font-mono text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white hover:border-white/40 hover:bg-black/80 transition-all backdrop-blur-md"
          >
            <Cpu className="w-4 h-4 text-rose-500" />
            <span>SYSTEM ARCHITECTURE</span>
          </button>
        </div>

        {/* Live Markets Quick Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-2xl text-xs font-mono text-neutral-400">
          <span className="text-neutral-500 uppercase tracking-widest text-[10px]">Live Streams:</span>
          {assets.slice(0, 4).map((a) => (
            <button
              key={a.id}
              onClick={handleLaunchTerminal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/5 bg-white/[0.03] hover:border-rose-500/30 hover:bg-white/[0.06] transition-colors"
            >
              <span className="font-semibold text-white">{a.symbol}</span>
              <span className="text-neutral-300">${a.price.toLocaleString()}</span>
              <span className={a.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {a.change24h >= 0 ? '+' : ''}{a.change24h.toFixed(2)}%
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Bottom Proof & Metrics Ticker (Identical to Knox Footer Strip) */}
      <div className="relative z-10 border-t border-white/10 bg-black/75 backdrop-blur-md">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10 font-sans">
          
          {/* Item 1: ENS Proofs */}
          <div className="pt-3 sm:pt-0 sm:px-4 first:pl-0 flex flex-col justify-center">
            <div className="flex items-baseline justify-between sm:justify-start gap-3">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                ENS Proofs
              </span>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                ON-CHAIN AUDIT
              </span>
            </div>
            <div className="text-xs text-neutral-400 font-mono mt-0.5">
              Verifiable merkle state logs
            </div>
          </div>

          {/* Item 2: Robinhood USDC */}
          <div className="pt-3 sm:pt-0 sm:px-4 flex flex-col justify-center">
            <div className="flex items-baseline justify-between sm:justify-start gap-3">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Robinhood USDC
              </span>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                ZERO KYC
              </span>
            </div>
            <div className="text-xs text-neutral-400 font-mono mt-0.5">
              Permissionless collateral settlement
            </div>
          </div>

          {/* Item 3: Latency */}
          <div className="pt-3 sm:pt-0 sm:px-4 flex flex-col justify-center">
            <div className="flex items-baseline justify-between sm:justify-start gap-3">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                &lt; 5s
              </span>
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">
                GATEWAY AGGREGATOR
              </span>
            </div>
            <div className="text-xs text-neutral-400 font-mono mt-0.5">
              Redemption to sub-second ticks
            </div>
          </div>

          {/* Item 4: ERC-4663 */}
          <div className="pt-3 sm:pt-0 sm:px-4 last:pr-0 flex flex-col justify-center">
            <div className="flex items-baseline justify-between sm:justify-start gap-3">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                ERC-4663
              </span>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                ORACLE CONSENSUS
              </span>
            </div>
            <div className="text-xs text-neutral-400 font-mono mt-0.5">
              Micro-prediction option contracts
            </div>
          </div>

        </div>
      </div>

      {/* Interactive System Specs & Features Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-enter">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-neutral-950 p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
                <h2 className="text-lg font-bold font-mono uppercase text-white tracking-wider">
                  ROVA PROTOCOL // ARCHITECTURE & SPECS
                </h2>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-neutral-400 hover:text-white font-mono text-sm px-2.5 py-1 rounded bg-white/5 border border-white/10"
              >
                ESC [✕]
              </button>
            </div>

            <div className="mt-5 space-y-4 font-mono text-xs text-neutral-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-rose-400 font-bold flex items-center gap-1.5 mb-1 text-sm">
                    <Radio className="w-4 h-4" /> Real-time Price Oracles
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Sub-second WebSocket feeds aggregated across Binance, Coinbase, and Pyth Oracles with millisecond timestamp verification.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5 mb-1 text-sm">
                    <ShieldCheck className="w-4 h-4" /> Automated Settlement
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Smart contract vault executes instant payouts upon expiry (5s to 60s windows) with 100% solvency guaranteed on-chain.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-cyan-400 font-bold flex items-center gap-1.5 mb-1 text-sm">
                    <Zap className="w-4 h-4" /> 1.95x Payout Ratio
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Zero gas micro-prediction options designed for rapid market execution with frictionless USDG settlement.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="text-amber-400 font-bold flex items-center gap-1.5 mb-1 text-sm">
                    <Award className="w-4 h-4" /> $1,000 Global Reward Pool
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Daily leaderboard rewards distributed automatically to top volume and high-winrate prediction traders.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Contract: <code className="text-rose-400">{CONTRACT_ADDRESS_FULL}</code></span>
                <button
                  onClick={handleCopyContract}
                  className="text-white hover:text-rose-400 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white text-xs font-mono"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  handleLaunchTerminal();
                }}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs flex items-center gap-2"
              >
                <span>Enter Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
