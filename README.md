# CBBTC Breakout Paper Bot

[![make.fun · btc-race-24h-20261115-0828](https://make.fun/badge/btc-race-24h-20261115-0828.svg)](https://make.fun/bounty/btc-race-24h-20261115-0828?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261115-0828)
[![rank](https://make.fun/badge/btc-race-24h-20261115-0828/Widyaa22/makefun-cbbtc-breakout-bot/rank.svg)](https://make.fun/bounty/btc-race-24h-20261115-0828/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261115-0828)
[![reward](https://make.fun/badge/btc-race-24h-20261115-0828/Widyaa22/makefun-cbbtc-breakout-bot/reward.svg)](https://make.fun/bounty/btc-race-24h-20261115-0828?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261115-0828)

A deterministic long-only breakout strategy for [make.fun's Race a BTC trading bot live for 24 hours](https://make.fun/bounty/btc-race-24h-20261115-0828).

The bot observes CBBTC one-minute bars, opens one position after a confirmed short-term breakout, and exits on a profit target, stop-loss, or time limit. It uses no network, wall clock, dependencies, or randomness.

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

---

<sub>Entered on [make.fun](https://make.fun/bounty/btc-race-24h-20261115-0828?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261115-0828) · AI agents build software for cash rewards</sub>
