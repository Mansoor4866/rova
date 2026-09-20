import React from 'react';
import { useTrading } from '../context/TradingContext';
import { ArrowUp, ArrowDown, CheckCircle2, XCircle, History } from 'lucide-react';

export const TradeHistory: React.FC = () => {
  const { settledPositions } = useTrading();

  if (settledPositions.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-line p-6 text-center shadow-xs">
        <History className="w-8 h-8 text-fg-3 mx-auto mb-2 opacity-50" />
        <h3 className="font-bold text-sm text-fg">No Settled Predictions Yet</h3>
        <p className="text-xs text-fg-2 mt-1">
          Place your first UP or DOWN prediction above to start trading!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-line p-4 sm:p-6 shadow-xs">
      
      <div className="flex items-center justify-between pb-3 border-b border-line/60 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-fg-2" />
          <h2 className="font-bold text-sm sm:text-base text-fg tracking-tight">
            Prediction History & Ledger
          </h2>
        </div>
        <span className="text-xs font-mono text-fg-2">
          {settledPositions.length} Settled Trades
        </span>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line text-fg-3 font-mono uppercase text-[10px]">
              <th className="pb-2 font-medium">Asset / Direction</th>
              <th className="pb-2 font-medium">Strike Price</th>
              <th className="pb-2 font-medium">Settled Price</th>
              <th className="pb-2 font-medium">Amount</th>
              <th className="pb-2 font-medium">Payout</th>
              <th className="pb-2 font-medium text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 font-mono">
            {settledPositions.slice(0, 15).map((pos) => {
              const isWon = pos.status === 'WON';
              const isUp = pos.direction === 'UP';

              return (
                <tr key={pos.id} className="hover:bg-elev/40 transition-colors">
                  
                  {/* Asset & Direction */}
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`p-1 rounded text-white ${isUp ? 'bg-up' : 'bg-down'}`}>
                        {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      </span>
                      <span className="font-bold text-fg font-sans">{pos.assetSymbol}</span>
                      <span className="text-[10px] text-fg-3">({pos.durationSeconds}s)</span>
                    </div>
                  </td>

                  {/* Strike Price */}
                  <td className="py-2.5 text-fg-2 font-medium">
                    ${pos.strikePrice.toFixed(2)}
                  </td>

                  {/* Settled Price */}
                  <td className="py-2.5 text-fg font-medium">
                    ${pos.closePrice ? pos.closePrice.toFixed(2) : '-'}
                  </td>

                  {/* Trade Amount */}
                  <td className="py-2.5 text-fg-2">
                    ${pos.amount.toFixed(2)}
                  </td>

                  {/* Payout */}
                  <td className="py-2.5">
                    <span className={`font-bold ${isWon ? 'text-up' : 'text-fg-3'}`}>
                      {isWon ? `+$${(pos.payout || 0).toFixed(2)}` : '$0.00'}
                    </span>
                  </td>

                  {/* Result Badge */}
                  <td className="py-2.5 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      isWon
                        ? 'bg-up/10 text-up border border-up/20'
                        : 'bg-down/10 text-down border border-down/20'
                    }`}>
                      {isWon ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          WON
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          LOST
                        </>
                      )}
                    </span>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
