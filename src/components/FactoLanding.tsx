import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { Hero3DVisual } from './Hero3DVisual';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Code2, 
  Radio, 
  Award,
  Layers,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Lock,
  Activity,
  Coins,
  Sparkles,
  Cpu,
  Database,
  Globe
} from 'lucide-react';
import { soundService } from '../services/soundService';

const CONTRACT_ADDRESS_FULL = '0x752792cA385Fe711202B2a450D95A39c2794c4663';
const CONTRACT_ADDRESS_SHORT = '0x7527...4663';

export const FactoLanding: React.FC = () => {
  const { setActivePage, assets, placePosition, balance, depositDemoFunds } = useTrading();
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedSimAsset, setSelectedSimAsset] = useState(assets[0] || { symbol: 'BTC', price: 92450.00, change24h: 3.25 });
  const [simTradeDirection, setSimTradeDirection] = useState<'UP' | 'DOWN' | null>(null);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'rest' | 'ws' | 'solidity'>('rest');

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS_FULL);
    setCopied(true);
    soundService.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchTerminal = () => {
    soundService.playClick();
    setActivePage('trade');
  };

  const handleQuickTrade = (dir: 'UP' | 'DOWN') => {
    setSimTradeDirection(dir);
    soundService.playClick();
    setSimResult('Simulating 5s settlement...');

    setTimeout(() => {
      const isWon = Math.random() > 0.35;
      if (isWon) {
        soundService.playWin();
        setSimResult(`✓ Strike Successful! +$19.00 USDG settled to vault.`);
      } else {
        soundService.playLoss();
        setSimResult(`✕ Strike Expired out-of-money.`);
      }
      setTimeout(() => {
        setSimTradeDirection(null);
        setSimResult(null);
      }, 3500);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-fg font-sans selection:bg-facto-pink selection:text-white pb-20">
      
      {/* 1. FACTO SIGNATURE HERO SECTION */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="facto-panel-elevated bg-app-card border border-app-border rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          
          {/* Subtle Pink/Emerald Accent Glow in Background with Floating and Pulse Animations */}
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-facto-pink/15 via-facto-pink/5 to-transparent rounded-full blur-3xl pointer-events-none animate-float-slow" />
          <div className="absolute bottom-0 left-1/4 w-[450px] h-[350px] bg-gradient-to-tr from-facto-green/10 via-transparent to-transparent rounded-full blur-2xl pointer-events-none animate-pulse-glow" />
          <div className="absolute top-1/3 left-10 w-[250px] h-[250px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none animate-float-slow" style={{ animationDelay: '3s' }} />

          {/* Top Contract Address Pill & Protocol Status (Animated Entrance) */}
          <div className="animate-hero-fade animate-delay-100 flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-app-elev border border-app-border text-xs font-mono text-app-fg-muted shadow-sm hover:border-app-fg/20 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-facto-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-facto-pink"></span>
              </span>
              <span>ROVA PROTOCOL // ROBINHOOD CHAIN (4663)</span>
            </div>

            <button
              onClick={handleCopyContract}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-app-elev border border-app-border hover:border-facto-pink/40 hover:bg-facto-pink/5 text-xs font-mono text-app-fg-muted hover:text-app-fg transition-all active:scale-95"
            >
              <span className="text-app-fg-dim">Contract:</span>
              <span className="font-semibold text-app-fg">{CONTRACT_ADDRESS_SHORT}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-facto-green animate-bounce" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Main Hero Content: 2-Column Grid (Left: Headlines & CTA, Right: 3D Holographic Visual Animation) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 xl:col-span-7">
              <h1 className="animate-hero-fade animate-delay-200 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-[-0.035em] text-app-fg leading-[1.06] mb-6">
                Turn price volatility into <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-facto-pink via-[#ff65bf] to-facto-pink">
                  instant on-chain yield.
                </span>
              </h1>

              <p className="animate-hero-fade animate-delay-300 text-base sm:text-lg lg:text-xl text-app-fg-muted max-w-2xl leading-relaxed mb-8 sm:mb-10 font-normal">
                ROVA lets traders and automated agents execute sub-second micro-predictions across Crypto and Tech Equities, approving every payout against verifiable oracles in under 5 seconds.
              </p>

              {/* Facto Dual Buttons with Dynamic Micro-Animations */}
              <div className="animate-hero-fade animate-delay-400 flex flex-wrap items-center gap-3.5 mb-8 sm:mb-10">
                <button
                  onClick={handleLaunchTerminal}
                  className="facto-btn-dark group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Launch Trading Terminal
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('facto-how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="facto-btn-light group hover:border-app-fg/30 transition-all"
                >
                  <span>How It Works</span>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('facto-simulator');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-xl border border-app-border/40 hover:border-app-border bg-app-elev/40 hover:bg-app-elev text-sm font-medium text-app-fg-muted hover:text-app-fg transition-all"
                >
                  Try Live Demo ↓
                </button>
              </div>

              {/* Live Stats Pill Row in Hero */}
              <div className="animate-hero-fade animate-delay-400 flex flex-wrap items-center gap-3 text-xs font-mono text-app-fg-muted">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-app-elev/60 border border-app-border/60">
                  <Clock className="w-3.5 h-3.5 text-facto-pink" />
                  <span>&lt; 5s Settlement</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-app-elev/60 border border-app-border/60">
                  <Zap className="w-3.5 h-3.5 text-facto-green" />
                  <span>Zero Gas Executions</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-app-elev/60 border border-app-border/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cryptographic Proofs</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Holographic Visualizer */}
            <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-center relative animate-hero-fade animate-delay-300 w-full">
              <Hero3DVisual />
            </div>
          </div>

          {/* Partner & Infrastructure Marquee Strip (No Emojis, Clean SVG Icons, Smooth Ticker) */}
          <div className="animate-hero-fade animate-delay-500 mt-14 pt-8 border-t border-app-border-subtle flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <span className="text-xs font-mono uppercase tracking-wider text-app-fg-dim shrink-0 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-facto-pink" />
              AUDITED PROTOCOL ORACLES:
            </span>
            <div className="overflow-hidden flex-1 relative mask-gradient">
              <div className="animate-marquee items-center gap-8 text-xs font-mono text-app-fg-muted">
                <span className="flex items-center gap-1.5 font-semibold text-app-fg tracking-wide">
                  <Zap className="w-3.5 h-3.5 text-facto-green shrink-0" />
                  ROBINHOOD CHAIN
                </span>
                <span className="text-app-fg-dim">•</span>
                <span className="flex items-center gap-1.5 font-semibold text-app-fg tracking-wide">
                  <Radio className="w-3.5 h-3.5 text-facto-pink shrink-0" />
                  PYTH NETWORK
                </span>
                <span className="text-app-fg-dim">•</span>
                <span className="flex items-center gap-1.5 font-semibold text-app-fg tracking-wide">
                  <Coins className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  USDG TREASURY
                </span>
                <span className="text-app-fg-dim">•</span>
                <span className="flex items-center gap-1.5 font-semibold text-app-fg tracking-wide">
                  <Activity className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  BINANCE FEED
                </span>
                <span className="text-app-fg-dim">•</span>
                <span className="flex items-center gap-1.5 font-semibold text-app-fg tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  VERIFIABLE MERKLE PROOFS
                </span>
                <span className="text-app-fg-dim">•</span>
                {/* Repeat seamless loop */}
                <span className="flex items-center gap-1.5 font-semibold text-app-fg tracking-wide">
                  <Zap className="w-3.5 h-3.5 text-facto-green shrink-0" />
                  ROBINHOOD CHAIN
                </span>
                <span className="text-app-fg-dim">•</span>
                <span className="flex items-center gap-1.5 font-semibold text-app-fg tracking-wide">
                  <Radio className="w-3.5 h-3.5 text-facto-pink shrink-0" />
                  PYTH NETWORK
                </span>
                <span className="text-app-fg-dim">•</span>
                <span className="flex items-center gap-1.5 font-semibold text-app-fg tracking-wide">
                  <Coins className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  USDG TREASURY
                </span>
                <span className="text-app-fg-dim">•</span>
                <span className="flex items-center gap-1.5 font-semibold text-app-fg tracking-wide">
                  <Activity className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  BINANCE FEED
                </span>
                <span className="text-app-fg-dim">•</span>
                <span className="flex items-center gap-1.5 font-semibold text-app-fg tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  VERIFIABLE MERKLE PROOFS
                </span>
                <span className="text-app-fg-dim">•</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 2. FACTO 3-STEP INTERACTIVE ARCHITECTURE SECTION */}
      <section id="facto-how-it-works" className="mx-auto max-w-[1360px] px-4 sm:px-6 pt-16 sm:pt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-facto-pink font-semibold mb-2">
              PRECISION ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-app-fg">
              How ROVA settles every strike.
            </h2>
          </div>
          <p className="text-app-fg-muted max-w-md text-sm sm:text-base">
            From sub-second oracle ingestion to automated smart-contract vault redemption, every step happens permissionlessly on-chain.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="facto-panel p-8 flex flex-col justify-between hover:border-facto-pink/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-app-elev border border-app-border flex items-center justify-center font-mono font-bold text-sm text-app-fg mb-6">
                01
              </div>
              <h3 className="text-xl font-semibold text-app-fg mb-3">
                Sub-Second Oracle Ingestion
              </h3>
              <p className="text-sm text-app-fg-muted leading-relaxed">
                Prices stream over low-latency WebSockets directly from Binance, Coinbase, and Pyth Oracles with millisecond timestamps and cryptographic signatures.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-app-border-subtle flex items-center justify-between text-xs font-mono text-app-fg-dim">
              <span>LATENCY: &lt; 50ms</span>
              <span className="text-facto-green font-semibold">LIVE TICK</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="facto-panel p-8 flex flex-col justify-between hover:border-facto-pink/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-app-elev border border-app-border flex items-center justify-center font-mono font-bold text-sm text-app-fg mb-6">
                02
              </div>
              <h3 className="text-xl font-semibold text-app-fg mb-3">
                Micro-Option Contract Strike
              </h3>
              <p className="text-sm text-app-fg-muted leading-relaxed">
                Traders lock 15s to 600s binary directional predictions. Collateral is escrowed directly in the Robinhood Chain smart contract vault with zero gas.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-app-border-subtle flex items-center justify-between text-xs font-mono text-app-fg-dim">
              <span>PAYOUT: 1.90x FIXED</span>
              <span className="text-facto-pink font-semibold">ZERO SLIPPAGE</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="facto-panel p-8 flex flex-col justify-between hover:border-facto-pink/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-app-elev border border-app-border flex items-center justify-center font-mono font-bold text-sm text-app-fg mb-6">
                03
              </div>
              <h3 className="text-xl font-semibold text-app-fg mb-3">
                Automated USDG Settlement
              </h3>
              <p className="text-sm text-app-fg-muted leading-relaxed">
                Upon expiry timestamp, the oracle resolves the strike delta. Winning payouts are automatically transferred in liquid USDG straight to your wallet.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-app-border-subtle flex items-center justify-between text-xs font-mono text-app-fg-dim">
              <span>SETTLEMENT: &lt; 5 SECONDS</span>
              <span className="text-facto-green font-semibold">100% SOLVENT</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE LIVE SIMULATOR & TEST TERMINAL EMBED */}
      <section id="facto-simulator" className="mx-auto max-w-[1360px] px-4 sm:px-6 pt-16 sm:pt-24">
        <div className="facto-panel-elevated bg-app-card border border-app-border rounded-[24px] p-6 sm:p-10">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-app-border-subtle">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-facto-pink font-semibold">
                LIVE INTERACTIVE TESTNET
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-app-fg mt-1">
                Test a 5-second strike execution
              </h2>
            </div>

            {/* Asset Switcher Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {assets.slice(0, 5).map(asset => (
                <button
                  key={asset.id}
                  onClick={() => {
                    setSelectedSimAsset(asset);
                    soundService.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                    selectedSimAsset.symbol === asset.symbol
                      ? 'bg-app-fg text-app-bg shadow-sm'
                      : 'bg-app-elev text-app-fg-muted hover:text-app-fg'
                  }`}
                >
                  {asset.symbol} ${asset.price.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 items-center">
            
            {/* Left Column: Asset Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-app-elev border border-app-border flex items-center justify-center text-base font-bold font-mono">
                  {selectedSimAsset.symbol.slice(0, 3)}
                </div>
                <div>
                  <div className="text-base font-semibold text-app-fg">{selectedSimAsset.name}</div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-app-fg">
                    ${selectedSimAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-app-elev/70 border border-app-border-subtle space-y-2 text-xs font-mono">
                <div className="flex justify-between text-app-fg-muted">
                  <span>Option Duration:</span>
                  <span className="text-app-fg font-semibold">5 Seconds</span>
                </div>
                <div className="flex justify-between text-app-fg-muted">
                  <span>Fixed Payout Multiplier:</span>
                  <span className="text-facto-green font-bold">1.90x (+$19.00 on $10)</span>
                </div>
                <div className="flex justify-between text-app-fg-muted">
                  <span>Oracle Feed:</span>
                  <span className="text-app-fg">Robinhood Chain / Pyth</span>
                </div>
              </div>
            </div>

            {/* Middle Column: Strike Controls */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-app-fg-dim uppercase tracking-wider text-center">
                CHOOSE DIRECTION FOR 5S STRIKE:
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleQuickTrade('UP')}
                  disabled={simTradeDirection !== null}
                  className="p-5 rounded-2xl bg-facto-green text-white font-semibold flex flex-col items-center justify-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50"
                >
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-base font-bold">STRIKE UP</span>
                  <span className="text-[11px] font-mono opacity-85">1.90x Payout</span>
                </button>

                <button
                  onClick={() => handleQuickTrade('DOWN')}
                  disabled={simTradeDirection !== null}
                  className="p-5 rounded-2xl bg-facto-red text-white font-semibold flex flex-col items-center justify-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50"
                >
                  <TrendingDown className="w-6 h-6" />
                  <span className="text-base font-bold">STRIKE DOWN</span>
                  <span className="text-[11px] font-mono opacity-85">1.90x Payout</span>
                </button>
              </div>

              {simResult && (
                <div className="p-3 rounded-xl bg-app-elev border border-facto-pink/30 text-center text-xs font-mono text-app-fg font-semibold animate-enter">
                  {simResult}
                </div>
              )}
            </div>

            {/* Right Column: Direct Jump to Full Terminal */}
            <div className="p-6 rounded-2xl bg-app-elev border border-app-border flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-facto-pink font-semibold mb-2">
                  <Zap className="w-4 h-4" />
                  <span>READY FOR REAL-TIME TRADING?</span>
                </div>
                <h4 className="text-lg font-semibold text-app-fg mb-2">
                  Enter the Full Pro Terminal
                </h4>
                <p className="text-xs text-app-fg-muted leading-relaxed">
                  Access multi-timeframe candlestick charts, active position trackers, stop-settlement options, and the $1,000 daily reward pool.
                </p>
              </div>

              <button
                onClick={handleLaunchTerminal}
                className="mt-6 facto-btn-dark w-full justify-center"
              >
                <span>Launch Full Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PROTOCOL AUDIT & METRICS BENTO GRID (Facto Layout) */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 pt-16 sm:pt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="facto-panel p-6">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-app-fg mb-1">
              &lt; 5s
            </div>
            <div className="text-sm font-semibold text-app-fg mb-1">
              Settlement Speed
            </div>
            <div className="text-xs text-app-fg-muted font-mono">
              Redemption to on-chain wallet balance in seconds
            </div>
          </div>

          <div className="facto-panel p-6">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-facto-green mb-1">
              100%
            </div>
            <div className="text-sm font-semibold text-app-fg mb-1">
              Vault Solvency
            </div>
            <div className="text-xs text-app-fg-muted font-mono">
              Fully collateralized USDG liquidity reserves
            </div>
          </div>

          <div className="facto-panel p-6">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-facto-pink mb-1">
              1.90x
            </div>
            <div className="text-sm font-semibold text-app-fg mb-1">
              Fixed Option Payout
            </div>
            <div className="text-xs text-app-fg-muted font-mono">
              Zero spread and guaranteed strike execution
            </div>
          </div>

          <div className="facto-panel p-6">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-amber-500 mb-1">
              $1,000
            </div>
            <div className="text-sm font-semibold text-app-fg mb-1">
              Daily Reward Pool
            </div>
            <div className="text-xs text-app-fg-muted font-mono">
              Automated prize distributions at UTC midnight
            </div>
          </div>

        </div>
      </section>

      {/* 5. DEVELOPER & CONTRACT CODE SECTION (Facto API View) */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 pt-16 sm:pt-24">
        <div className="facto-panel-elevated bg-[#0d0e11] text-white rounded-[24px] p-6 sm:p-10 border border-[#232730]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-facto-pink font-semibold">
                <Code2 className="w-4 h-4" />
                <span>ROVA DEVELOPER API & SMART CONTRACT</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mt-1">
                Integrate micro-options into your app
              </h3>
            </div>

            {/* Code Tabs */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-xs font-mono">
              {(['rest', 'ws', 'solidity'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-3 py-1.5 rounded-lg uppercase font-semibold transition-all ${
                    activeCodeTab === tab
                      ? 'bg-facto-pink text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab === 'rest' ? 'REST API' : tab === 'ws' ? 'WebSocket Feed' : 'Solidity Vault'}
                </button>
              ))}
            </div>
          </div>

          {/* Code Snippet Box */}
          <div className="pt-6 font-mono text-xs sm:text-sm text-neutral-300 overflow-x-auto">
            {activeCodeTab === 'rest' && (
              <pre className="text-neutral-300 leading-relaxed">
{`// POST https://api.rova.trade/v1/strike/execute
{
  "userAddress": "${CONTRACT_ADDRESS_FULL}",
  "asset": "BTC-USD",
  "direction": "UP",
  "amountUSDG": 50.00,
  "durationSeconds": 15,
  "oracleProof": "0x89f2a71d8c..."
}

// Response: 200 OK
{
  "strikeId": "strike_99f018a",
  "status": "LOCKED",
  "strikePrice": 92450.00,
  "potentialPayout": 95.00,
  "settlementBlock": 18492019
}`}
              </pre>
            )}

            {activeCodeTab === 'ws' && (
              <pre className="text-neutral-300 leading-relaxed">
{`// wss://stream.rova.trade/v1/live
const ws = new WebSocket("wss://stream.rova.trade/v1/live");

ws.onmessage = (event) => {
  const { symbol, price, timestamp, merkleProof } = JSON.parse(event.data);
  console.log(\`[\${symbol}] $\${price} @ \${timestamp}\`);
};`}
              </pre>
            )}

            {activeCodeTab === 'solidity' && (
              <pre className="text-neutral-300 leading-relaxed">
{`// SPDX-License-Identifier: MIT
interface IRovaPredictionVault {
    function executeStrike(
        bytes32 assetId,
        uint8 direction,
        uint256 amountUSDG,
        uint32 duration
    ) external returns (bytes32 strikeId);

    function settleStrike(bytes32 strikeId, bytes calldata pythPriceUpdate) external;
}`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA BANNER (Facto Style) */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 pt-16 sm:pt-24">
        <div className="facto-panel-elevated bg-facto-pink text-white rounded-[24px] sm:rounded-[32px] p-8 sm:p-14 text-center relative overflow-hidden shadow-xl shadow-facto-pink/20">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] mb-4">
            Start predicting sub-second moves today.
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-base sm:text-lg mb-8">
            Connect your Robinhood Chain wallet, claim instant demo USDG collateral, and trade frictionlessly with zero gas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleLaunchTerminal}
              className="px-8 py-4 rounded-xl bg-black text-white font-semibold hover:bg-neutral-900 active:scale-95 transition-all text-base shadow-lg"
            >
              Launch Prediction Terminal →
            </button>
            <button
              onClick={() => {
                depositDemoFunds(100);
                soundService.playWin();
                setActivePage('trade');
              }}
              className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-neutral-100 active:scale-95 transition-all text-base"
            >
              Get +$100 Demo USDG
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
