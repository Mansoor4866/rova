import React, { useEffect, useRef, useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Candle } from '../types';
import { TrendingUp, TrendingDown, Crosshair, Activity, Zap, BarChart2, LineChart } from 'lucide-react';

export const TradingChart: React.FC = () => {
  const { selectedAsset, activePositions, theme, chartMode, setChartMode } = useTrading();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [activeTimeframe, setActiveTimeframe] = useState<'15s' | '1m' | '5m' | '1h'>('15s');

  const currentAssetPositions = activePositions.filter(p => p.assetSymbol === selectedAsset.symbol);

  // Initialize initial history points
  useEffect(() => {
    const basePrice = selectedAsset.price;
    const now = Date.now();
    const initialPoints: Candle[] = [];
    const pointsCount = 65;

    let runningPrice = basePrice;
    for (let i = pointsCount; i >= 0; i--) {
      const noise = (Math.random() - 0.49) * (basePrice * 0.0008);
      const open = runningPrice;
      const close = runningPrice + noise;
      const high = Math.max(open, close) + Math.random() * (basePrice * 0.0003);
      const low = Math.min(open, close) - Math.random() * (basePrice * 0.0003);
      runningPrice = close;

      initialPoints.push({
        time: now - i * 500,
        open,
        high,
        low,
        close,
        price: close
      });
    }
    setCandles(initialPoints);
  }, [selectedAsset.symbol]);

  // Append new tick on price change
  useEffect(() => {
    setCandles(prev => {
      const now = Date.now();
      const last = prev[prev.length - 1];
      const open = last ? last.close : selectedAsset.price;
      const close = selectedAsset.price;
      const high = Math.max(open, close, last ? last.high : close);
      const low = Math.min(open, close, last ? last.low : close);

      const updated = [...prev, {
        time: now,
        open,
        high,
        low,
        close,
        price: close
      }];

      if (updated.length > 100) {
        return updated.slice(updated.length - 100);
      }
      return updated;
    });
  }, [selectedAsset.price]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }

      const drawWidth = rect.width;
      const drawHeight = rect.height;

      ctx.clearRect(0, 0, drawWidth, drawHeight);

      if (candles.length < 2) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      let minPrice = Math.min(...candles.map(c => c.price));
      let maxPrice = Math.max(...candles.map(c => c.price));

      currentAssetPositions.forEach(p => {
        if (p.strikePrice < minPrice) minPrice = p.strikePrice;
        if (p.strikePrice > maxPrice) maxPrice = p.strikePrice;
      });

      const priceRange = maxPrice - minPrice || 1;
      const paddingY = drawHeight * 0.16;
      const effectiveHeight = drawHeight - paddingY * 2;

      const getX = (index: number) => {
        return (index / (candles.length - 1)) * (drawWidth - 75) + 12;
      };

      const getY = (price: number) => {
        return drawHeight - paddingY - ((price - minPrice) / priceRange) * effectiveHeight;
      };

      const isDark = theme === 'dark';

      // 1. Draw Grid Lines
      ctx.strokeStyle = isDark ? '#162032' : '#edf2f7';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      const gridLevels = 4;
      for (let i = 0; i <= gridLevels; i++) {
        const y = paddingY + (effectiveHeight / gridLevels) * i;
        ctx.beginPath();
        ctx.moveTo(12, y);
        ctx.lineTo(drawWidth - 70, y);
        ctx.stroke();

        const priceAtLevel = maxPrice - (i / gridLevels) * priceRange;
        ctx.fillStyle = isDark ? '#54647c' : '#94a3b8';
        ctx.font = '10px "Geist Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(
          priceAtLevel < 1 ? priceAtLevel.toFixed(selectedAsset.decimals) : priceAtLevel.toFixed(2),
          drawWidth - 65,
          y + 3
        );
      }
      ctx.setLineDash([]);

      const isUp = candles[candles.length - 1].price >= candles[0].price;
      const primaryColor = isUp ? '#00e599' : '#ff3b57';
      const glowGradientStart = isUp
        ? (isDark ? 'rgba(0, 229, 153, 0.28)' : 'rgba(16, 185, 129, 0.22)')
        : (isDark ? 'rgba(255, 59, 87, 0.28)' : 'rgba(244, 63, 94, 0.22)');

      if (chartMode === 'area') {
        // Area Gradient
        const gradient = ctx.createLinearGradient(0, paddingY, 0, drawHeight);
        gradient.addColorStop(0, glowGradientStart);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(getX(0), drawHeight);
        for (let i = 0; i < candles.length; i++) {
          ctx.lineTo(getX(i), getY(candles[i].price));
        }
        ctx.lineTo(getX(candles.length - 1), drawHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Main Curve with Smooth Quadratic Bezier
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(candles[0].price));
        for (let i = 1; i < candles.length; i++) {
          const prevX = getX(i - 1);
          const prevY = getY(candles[i - 1].price);
          const currX = getX(i);
          const currY = getY(candles[i].price);
          const midX = (prevX + currX) / 2;
          ctx.quadraticCurveTo(prevX, prevY, midX, (prevY + currY) / 2);
        }
        ctx.lineTo(getX(candles.length - 1), getY(candles[candles.length - 1].price));
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

      } else {
        // Candlestick Mode
        const candleWidth = Math.max(3, (drawWidth - 85) / candles.length * 0.7);
        candles.forEach((c, i) => {
          const x = getX(i);
          const openY = getY(c.open);
          const closeY = getY(c.close);
          const highY = getY(c.high);
          const lowY = getY(c.low);
          const candleUp = c.close >= c.open;
          const color = candleUp ? '#00e599' : '#ff3b57';

          // Wick
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, highY);
          ctx.lineTo(x, lowY);
          ctx.stroke();

          // Body
          ctx.fillStyle = color;
          const topY = Math.min(openY, closeY);
          const bodyHeight = Math.max(2, Math.abs(closeY - openY));
          ctx.fillRect(x - candleWidth / 2, topY, candleWidth, bodyHeight);
        });
      }

      // Head Tick Pulse Dot
      const latestX = getX(candles.length - 1);
      const latestY = getY(candles[candles.length - 1].price);

      const pulseSize = 9 + Math.sin(Date.now() / 180) * 4;
      ctx.beginPath();
      ctx.arc(latestX, latestY, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = isUp ? 'rgba(0, 229, 153, 0.3)' : 'rgba(255, 59, 87, 0.3)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(latestX, latestY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.fill();

      // Laser Strike Lines for active positions
      currentAssetPositions.forEach(pos => {
        const strikeY = getY(pos.strikePrice);
        const isTradeUp = pos.direction === 'UP';
        const inProfit = isTradeUp
          ? selectedAsset.price > pos.strikePrice
          : selectedAsset.price < pos.strikePrice;

        const strikeColor = isTradeUp ? '#00e599' : '#ff3b57';

        // Laser Horizontal Target Line
        ctx.save();
        ctx.strokeStyle = strikeColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.shadowColor = strikeColor;
        ctx.shadowBlur = inProfit ? 12 : 6;
        ctx.beginPath();
        ctx.moveTo(12, strikeY);
        ctx.lineTo(drawWidth - 70, strikeY);
        ctx.stroke();
        ctx.restore();

        // Laser Badge
        const tagText = `TARGET ${pos.direction} $${pos.strikePrice.toFixed(selectedAsset.decimals > 2 ? 4 : 2)}`;
        ctx.fillStyle = strikeColor;
        ctx.font = 'bold 10px "Geist Mono", monospace';
        const tagWidth = ctx.measureText(tagText).width + 16;

        ctx.beginPath();
        ctx.roundRect(16, strikeY - 11, tagWidth, 22, 6);
        ctx.fillStyle = inProfit ? strikeColor : (isDark ? '#111622' : '#0f172a');
        ctx.fill();
        ctx.strokeStyle = strikeColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = inProfit ? '#07090e' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(tagText, 16 + tagWidth / 2, strikeY + 4);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [candles, selectedAsset, currentAssetPositions, theme, chartMode]);

  const isPositive = selectedAsset.change24h >= 0;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-card-glow flex flex-col justify-between relative overflow-hidden">
      
      {/* Chart Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-app-border-subtle">
        
        {/* Symbol & Price HUD */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-app-elev flex items-center justify-center shrink-0 border border-app-border">
            <img
              src={selectedAsset.logoUrl}
              alt={selectedAsset.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-xs font-bold text-app-fg-muted uppercase">
              {selectedAsset.symbol.slice(0, 3)}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-app-fg tracking-tight font-sans">
                {selectedAsset.name}
              </h1>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-app-elev border border-app-border text-neon-cyan uppercase">
                {selectedAsset.symbol}
              </span>
            </div>
            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="font-mono font-black text-xl sm:text-2xl text-app-fg tracking-tight">
                ${selectedAsset.price < 1
                  ? selectedAsset.price.toFixed(selectedAsset.decimals)
                  : selectedAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`font-mono text-xs font-bold flex items-center gap-0.5 ${
                isPositive ? 'text-neon-green' : 'text-neon-red'
              }`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isPositive ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart Mode & Timeframe Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          
          {/* Chart Mode Toggle */}
          <div className="flex items-center bg-app-elev border border-app-border-subtle rounded-xl p-0.5">
            <button
              onClick={() => setChartMode('area')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                chartMode === 'area'
                  ? 'bg-neon-cyan/20 text-neon-cyan'
                  : 'text-app-fg-muted hover:text-app-fg'
              }`}
              title="Smooth Line & Glow"
            >
              <LineChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartMode('candles')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                chartMode === 'candles'
                  ? 'bg-neon-cyan/20 text-neon-cyan'
                  : 'text-app-fg-muted hover:text-app-fg'
              }`}
              title="Candlestick Mode"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center bg-app-elev border border-app-border-subtle rounded-xl p-0.5">
            {(['15s', '1m', '5m', '1h'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeTimeframe === tf
                    ? 'bg-app-card text-app-fg shadow-xs border border-app-border'
                    : 'text-app-fg-muted hover:text-app-fg'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Main Radar Canvas Chart Area */}
      <div className="w-full h-[290px] sm:h-[370px] relative my-2">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* Watermark */}
        <div className="absolute top-4 left-4 pointer-events-none opacity-5 flex items-center gap-2">
          <Crosshair className="w-12 h-12 text-app-fg" />
          <span className="text-4xl font-black font-sans tracking-widest">ROVA</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-app-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs text-app-fg-muted font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Oracle: <strong className="text-app-fg font-sans">DexScreener / Binance High-Freq Feed</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-neon-cyan font-bold">Robinhood Chain (USDG)</span>
        </div>
      </div>

    </div>
  );
};
