import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset, AssetCategory } from '../types';
import { TrendingUp, TrendingDown, Layers, Sparkles } from 'lucide-react';
import { soundService } from '../services/soundService';

export const AssetTickerBar: React.FC = () => {
  const { assets, selectedAsset, setSelectedAsset } = useTrading();
  const [activeCategory, setActiveCategory] = useState<AssetCategory | 'all'>('all');

  const filteredAssets = activeCategory === 'all'
    ? assets
    : assets.filter(a => a.category === activeCategory);

  const handleSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    soundService.playClick();
  };

  return (
    <div className="border-b border-app-border bg-app-card/60 backdrop-blur-sm py-2 px-4 sm:px-6">
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar py-0.5">
          {(['all', 'stocks', 'crypto', 'memes'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                soundService.playClick();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-neon-cyan to-app-accent text-obsidian-950 shadow-neon-cyan/20 shadow-xs font-bold'
                  : 'bg-app-elev text-app-fg-muted hover:text-app-fg hover:bg-app-elev-2'
              }`}
            >
              {cat === 'all' ? 'All Feeds' : cat}
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-[1px] h-6 bg-app-border shrink-0" />

        {/* Tickers Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filteredAssets.map((asset) => {
            const isSelected = selectedAsset.symbol === asset.symbol;
            const isPositive = asset.change24h >= 0;

            return (
              <button
                key={asset.symbol}
                onClick={() => handleSelect(asset)}
                className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border shrink-0 transition-all ${
                  isSelected
                    ? 'bg-app-elev-2 border-neon-cyan shadow-neon-cyan/15 shadow-sm ring-1 ring-neon-cyan/30'
                    : 'bg-app-card/70 border-app-border hover:border-app-border-subtle hover:bg-app-elev'
                }`}
              >
                {/* Logo with rounded badge */}
                <div className="w-5 h-5 rounded-full overflow-hidden bg-app-elev flex items-center justify-center shrink-0 border border-app-border">
                  <img
                    src={asset.logoUrl}
                    alt={asset.symbol}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-[9px] font-bold text-app-fg-muted uppercase">
                    {asset.symbol.slice(0, 2)}
                  </span>
                </div>

                {/* Symbol & Price */}
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-xs text-app-fg tracking-tight">
                    {asset.symbol}
                  </span>
                  <span className="font-mono text-[11px] text-app-fg-muted font-medium">
                    ${asset.price < 1 ? asset.price.toFixed(asset.decimals) : asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* 24h Change Badge */}
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                  isPositive
                    ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                    : 'bg-neon-red/10 text-neon-red border border-neon-red/20'
                }`}>
                  {isPositive ? '+' : ''}{asset.change24h.toFixed(1)}%
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
