import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { web3WalletService, WalletOption } from '../services/web3Wallet';
import { X, Wallet, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2, QrCode, Sparkles, ExternalLink } from 'lucide-react';
import { soundService } from '../services/soundService';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ isOpen, onClose }) => {
  const { setWalletAddress, setIsWalletConnected } = useTrading() as unknown as {
    setWalletAddress: (addr: string) => void;
    setIsWalletConnected: (connected: boolean) => void;
  };

  const [connectingWallet, setConnectingWallet] = useState<WalletOption | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);

  if (!isOpen) return null;

  const wallets = web3WalletService.getDetectedWallets();

  const handleSelectWallet = async (wallet: WalletOption) => {
    setErrorMsg(null);
    setConnectingWallet(wallet);
    soundService.playClick();

    if (wallet.id === 'walletconnect') {
      setShowQrCode(true);
      return;
    }

    try {
      const res = await web3WalletService.connect(wallet.id);
      if (res.success && res.address) {
        setWalletAddress(res.address.slice(0, 6) + '...' + res.address.slice(-4));
        setIsWalletConnected(true);
        soundService.playWin();
        onClose();
      } else {
        setErrorMsg(res.error || 'Connection rejected or failed. Please try again.');
      }
    } catch (e: unknown) {
      setErrorMsg((e as { message?: string })?.message || 'Error requesting wallet connection.');
    } finally {
      setConnectingWallet(null);
    }
  };

  const handleSimulateQrScan = () => {
    soundService.playClick();
    setTimeout(() => {
      const mockAddr = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setWalletAddress(mockAddr.slice(0, 6) + '...' + mockAddr.slice(-4));
      setIsWalletConnected(true);
      soundService.playWin();
      setShowQrCode(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6 animate-enter">
      <div className="w-full max-w-[480px] overflow-hidden rounded-b-none p-6 sm:rounded-b-[24px] bg-app-card rounded-2xl border border-app-border shadow-card-glow relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-app-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-app-accent p-0.5 shadow-neon-cyan/20 shadow-md">
              <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
                <Wallet className="w-4 h-4 text-neon-cyan" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-app-fg tracking-tight font-sans">
                Connect Robinhood Wallet
              </h3>
              <p className="text-xs text-app-fg-muted font-mono">
                Select your installed Robinhood Chain wallet
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowQrCode(false);
              setConnectingWallet(null);
              onClose();
              soundService.playClick();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-app-elev border border-app-border text-app-fg-muted hover:text-app-fg hover:border-app-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-neon-red/10 border border-neon-red/30 text-xs text-neon-red font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* WalletConnect QR Code View */}
        {showQrCode ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-neon-cyan/40 shadow-neon-cyan/20 shadow-lg flex items-center justify-center relative">
              {/* Generated QR representation */}
              <div className="w-full h-full bg-obsidian-950 rounded-xl flex flex-col items-center justify-center p-3 text-neon-cyan">
                <QrCode className="w-24 h-24 text-neon-cyan animate-pulse" />
                <span className="text-[10px] font-mono text-app-fg mt-1">Robinhood Mobile Scan</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm text-app-fg">Scan with Robinhood Mobile App</h4>
              <p className="text-xs text-app-fg-muted mt-1 max-w-[280px] mx-auto">
                Open Robinhood Wallet on your phone and scan to approve instant connection.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setShowQrCode(false)}
                className="px-4 py-2 rounded-xl bg-app-elev text-xs font-bold text-app-fg-muted hover:text-app-fg"
              >
                Back to Wallets
              </button>
              <button
                onClick={handleSimulateQrScan}
                className="btn-cyber px-5 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-app-accent text-obsidian-950 font-extrabold text-xs shadow-md"
              >
                Simulate Mobile Approval
              </button>
            </div>
          </div>
        ) : (
          /* List of Robinhood Supported Wallets */
          <div className="py-4 space-y-2.5 max-h-[380px] overflow-y-auto no-scrollbar">
            {wallets.map((wallet) => {
              const isConnecting = connectingWallet?.id === wallet.id;

              return (
                <button
                  key={wallet.id}
                  onClick={() => handleSelectWallet(wallet)}
                  disabled={Boolean(connectingWallet)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                    isConnecting
                      ? 'bg-neon-cyan/15 border-neon-cyan ring-1 ring-neon-cyan/40 shadow-neon-cyan/20'
                      : 'bg-app-elev/70 border-app-border hover:border-app-border-subtle hover:bg-app-elev hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Wallet Icon */}
                    <div className="w-10 h-10 rounded-xl bg-app-card border border-app-border flex items-center justify-center p-2 shrink-0">
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://robinhood.com/favicon.ico';
                        }}
                      />
                    </div>

                    {/* Name & Desc */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-app-fg font-sans">
                          {wallet.name}
                        </span>
                        {wallet.badge && (
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            wallet.badge === 'Recommended'
                              ? 'bg-neon-green/15 text-neon-green border border-neon-green/30'
                              : wallet.badge === 'Detected'
                              ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30'
                              : 'bg-app-elev-2 text-app-fg-muted'
                          }`}>
                            {wallet.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-app-fg-muted block mt-0.5">
                        {wallet.description}
                      </span>
                    </div>
                  </div>

                  {/* Status Arrow / Spinner */}
                  <div className="shrink-0 pl-2">
                    {isConnecting ? (
                      <div className="flex items-center gap-1.5 text-xs text-neon-cyan font-mono font-bold">
                        <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />
                        <span className="hidden sm:inline">Requesting...</span>
                      </div>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-app-fg-dim group-hover:text-neon-cyan transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer Info */}
        <div className="border-t border-app-border-subtle pt-3.5 flex items-center justify-between text-xs text-app-fg-dim font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
            <span>Robinhood Chain (EVM 4663)</span>
          </span>
          <a
            href="https://robinhoodchain.blockscout.com"
            target="_blank"
            rel="noreferrer"
            className="text-neon-cyan hover:underline flex items-center gap-1 font-sans"
          >
            <span>Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
