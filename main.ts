import { runBars, type BarsState } from './vendor/makefun-bars.ts';

// Deterministic long-only CBBTC breakout strategy. A short-window breakout opens
// one position; exit is a fixed target, stop, or 45-bar maximum holding time.
const LOOKBACK_BARS = 10;
const ENTRY_BREAKOUT_BPS = 12;
const TAKE_PROFIT_BPS = 120;
const STOP_LOSS_BPS = 40;
const MAX_HOLD_BARS = 45;
const COOLDOWN_BARS = 10;
const OPEN_SLIPPAGE_BPS = 10_000;

const closes: bigint[] = [];
let orderPending = false;
let holdingBars = 0;
let cooldownBars = 0;

function markedGainBps(state: BarsState, position: { qty: bigint; cost: bigint }): bigint {
  return (state.value('CBBTC', position.qty) * 10_000n) / position.cost - 10_000n;
}

await runBars({
  onBatch(state, batch) {
    for (const fill of batch.fills) {
      if (fill.client_id === 'entry' || fill.client_id === 'exit') orderPending = false;
    }

    const close = state.close('CBBTC');
    if (close === null || state.warmingUp) return [];
    closes.push(close);
    if (closes.length > LOOKBACK_BARS + 1) closes.shift();
    if (cooldownBars > 0) cooldownBars--;

    const position = state.positions.get('CBBTC');
    if (position !== undefined) {
      holdingBars++;
      const gainBps = markedGainBps(state, position);
      const exitNow = gainBps >= BigInt(TAKE_PROFIT_BPS) || gainBps <= -BigInt(STOP_LOSS_BPS) || holdingBars >= MAX_HOLD_BARS;
      if (!orderPending && exitNow) {
        orderPending = true;
        cooldownBars = COOLDOWN_BARS;
        holdingBars = 0;
        return [{ side: 'sell', client_id: 'exit', symbol: 'CBBTC', qty: position.qty, max_slippage_bps: OPEN_SLIPPAGE_BPS }];
      }
      return [];
    }

    if (orderPending || cooldownBars > 0 || closes.length < LOOKBACK_BARS + 1) return [];
    const breakoutBps = (close * 10_000n) / closes[0]! - 10_000n;
    if (breakoutBps < BigInt(ENTRY_BREAKOUT_BPS)) return [];

    const notional = state.cash < state.weightRoom('CBBTC') ? state.cash : state.weightRoom('CBBTC');
    if (notional < BigInt(state.hello.fees.min_notional_quote_units)) return [];
    orderPending = true;
    holdingBars = 0;
    return [{ side: 'buy', client_id: 'entry', symbol: 'CBBTC', notional_quote_units: notional, max_slippage_bps: OPEN_SLIPPAGE_BPS }];
  },
});
