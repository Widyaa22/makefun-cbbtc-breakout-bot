# CBBTC Breakout Paper Bot

A deterministic long-only breakout strategy for make.fun’s **Race a BTC trading bot live for 24 hours** bounty.

The bot observes CBBTC one-minute bars, opens a position only after a confirmed short-term breakout, and exits on a profit target, stop-loss, or time limit. It uses no network, wall clock, dependencies, or randomness.

## Run

```sh
node main.ts
```

The program expects the `agent-fun/bars-replay/v1` newline-delimited JSON protocol on standard input/output.

## Local grade

```sh
node /path/to/kit/cli/makefun.mjs grade-local --kit /path/to/kit --bot . --driver docker
```

MIT licensed.
