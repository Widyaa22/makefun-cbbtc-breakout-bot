import { runBars, type BarsState } from './vendor/makefun-bars.ts';
const LOOK=10, ENTRY=12, TAKE=120, STOP=40, MAXH=45, COOL=10;
const hist: bigint[]=[]; let pending=false, heldBars=0, cooldown=0;
function gain(s:BarsState,p:{qty:bigint,cost:bigint}): bigint { return s.value('CBBTC',p.qty)*10000n/p.cost-10000n; }
await runBars({
 onBatch(s,b) {
  for(const f of b.fills) if(f.client_id==='in'||f.client_id==='out') pending=false;
  const c=s.close('CBBTC'); if(c===null||s.warmingUp) return [];
  hist.push(c); if(hist.length>LOOK+1) hist.shift(); if(cooldown>0) cooldown--;
  const p=s.positions.get('CBBTC');
  if(p!==undefined) { heldBars++; const g=gain(s,p);
    if(!pending&&(g>=BigInt(TAKE)||g<=-BigInt(STOP)||heldBars>=MAXH)) { pending=true; cooldown=COOL; heldBars=0; return [{side:'sell',client_id:'out',symbol:'CBBTC',qty:p.qty,max_slippage_bps:10000}]; }
    return [];
  }
  if(pending||cooldown>0||hist.length<LOOK+1) return [];
  const ret=c*10000n/hist[0]! -10000n;
  if(ret>=BigInt(ENTRY)) { const amt=s.cash<s.weightRoom('CBBTC')?s.cash:s.weightRoom('CBBTC');
    if(amt>=BigInt(s.hello.fees.min_notional_quote_units)) {pending=true;heldBars=0;return [{side:'buy',client_id:'in',symbol:'CBBTC',notional_quote_units:amt,max_slippage_bps:10000}];}
  } return [];
 }
});
