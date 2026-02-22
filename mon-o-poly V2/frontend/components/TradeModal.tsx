'use client';

import { useState } from 'react';
import { X, ExternalLink, CheckCircle2 } from 'lucide-react';
import { EXPLORER_URL } from '@/lib/monad';

export interface BetReceipt {
  txHash: string;
  amount: string;
  isYes: boolean;
  market: string;
  blockNumber?: bigint;
}

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrade: (amount: string, isYes: boolean) => void;
  isYes: boolean;
  isProcessing: boolean;
  receipt?: BetReceipt | null;
}

const QUICK_AMOUNTS = [1, 5, 10, 100];

function shortenHash(hash: string) {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

export default function TradeModal({
  isOpen,
  onClose,
  onTrade,
  isYes,
  isProcessing,
  receipt,
}: TradeModalProps) {
  const [amount, setAmount] = useState('0');

  if (!isOpen) return null;

  const accentColor = isYes ? '#85E6FF' : '#FF8EE4';
  const accentBg = isYes ? 'bg-[#85E6FF]/20 border-[#85E6FF]/50 text-[#85E6FF]' : 'bg-[#FF8EE4]/20 border-[#FF8EE4]/50 text-[#FF8EE4]';

  const addAmount = (val: number) => {
    setAmount((prev) => String(Number(prev || 0) + val));
  };

  const setMax = () => {
    setAmount('999');
  };

  const handleTrade = () => {
    const num = Number(amount);
    if (Number.isFinite(num) && num > 0) {
      onTrade(amount, isYes);
      setAmount('0');
    }
  };

  const handleClose = () => {
    setAmount('0');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-[#0E091C] border border-white/10 p-6 mx-4 mb-8 sm:mb-0 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* ── Receipt view ──────────────────────────────────────────────────── */}
        {receipt ? (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <CheckCircle2 size={48} color={accentColor} strokeWidth={1.5} />

            <div>
              <p className="font-display text-lg font-semibold text-white">Bet Placed!</p>
              <p className="font-mono-brand text-xs text-white/40 mt-0.5">On-chain receipt confirmed</p>
            </div>

            {/* Direction badge */}
            <span className={`px-5 py-1.5 rounded-full border font-mono-brand text-sm font-bold ${accentBg}`}>
              {receipt.isYes ? 'YES' : 'NO'}
            </span>

            {/* Market question */}
            <p className="font-mono-brand text-sm text-white/70 leading-snug line-clamp-2">
              {receipt.market}
            </p>

            {/* Amount */}
            <div className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="font-mono-brand text-sm text-white/50">Amount</span>
              <span className="font-mono-brand text-sm font-semibold text-white">
                {receipt.amount} MON
              </span>
            </div>

            {/* Tx hash */}
            <a
              href={`${EXPLORER_URL}/tx/${receipt.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 transition-colors group"
            >
              <span className="font-mono-brand text-sm text-white/50">Tx Hash</span>
              <span className="flex items-center gap-1.5 font-mono-brand text-sm text-white/70 group-hover:text-white transition-colors">
                {shortenHash(receipt.txHash)}
                <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
              </span>
            </a>

            {receipt.blockNumber !== undefined && (
              <div className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <span className="font-mono-brand text-sm text-white/50">Block</span>
                <span className="font-mono-brand text-sm text-white/70">
                  #{receipt.blockNumber.toString()}
                </span>
              </div>
            )}

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-[#6E54FF] hover:bg-[#7d65ff] font-mono-brand font-medium text-white transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* ── Trade input view ─────────────────────────────────────────────── */
          <>
            <h3 className="font-display text-lg font-semibold text-white mb-4">
              {isYes ? 'Buy YES' : 'Buy NO'}
            </h3>

            <div className="space-y-2 mb-4">
              <label className="text-sm font-mono-brand text-white/70">Amount</label>
              <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/10 px-4 py-3">
                <span className="font-mono-brand text-white/50">MON</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="flex-1 bg-transparent text-right text-xl font-mono-brand text-white outline-none placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  onClick={() => addAmount(val)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-[#6E54FF]/20 border border-white/10 hover:border-[#6E54FF]/50 font-mono-brand text-sm text-white transition-colors"
                >
                  +{val}
                </button>
              ))}
              <button
                onClick={setMax}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-[#6E54FF]/20 border border-white/10 hover:border-[#6E54FF]/50 font-mono-brand text-sm text-[#6E54FF] transition-colors"
              >
                Max
              </button>
            </div>

            {/* Confirm button — colored by direction */}
            <button
              onClick={handleTrade}
              disabled={isProcessing || !amount || Number(amount) <= 0}
              className={`w-full py-4 rounded-xl border font-mono-brand font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${accentBg}`}
            >
              {isProcessing
                ? 'Confirming on-chain…'
                : `Buy ${isYes ? 'YES' : 'NO'} with ${amount || '0'} MON`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
