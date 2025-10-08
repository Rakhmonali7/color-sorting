import { serialize, isGoal } from './state.js';
import { canPour, applyPour } from './rules.js';

export function solve(initial, V, opts={}){
  const maxDepth = opts.maxDepth ?? 400;
  const trace = !!opts.trace;
  const visited = new Set();
  const path = [];

  function scoreMove([i,j], st, V){
    const tgt = st[j], src = st[i];
    const topT = tgt.length ? tgt[tgt.length-1] : null;
    const topS = src.length ? src[src.length-1] : null;
    if(topT===topS) return 0;       // merge same color
    if(tgt.length===0) return 1;    // pour into empty
    return 2;
  }

  function dfs(state, depth, last){
    if(isGoal(state,V)) return true;
    if(depth>=maxDepth) return false;

    const key = serialize(state);
    if(visited.has(key)) return false;
    visited.add(key);

    const N = state.length;
    const candidates = [];
    for(let i=0;i<N;i++){
      for(let j=0;j<N;j++){
        if(i===j) continue;
        if(!canPour(state[i], state[j], V)) continue;
        if(last && last[0]===j && last[1]===i) continue; // avoid immediate undo
        candidates.push([i,j]);
      }
    }
    candidates.sort((a,b)=>scoreMove(a,state,V)-scoreMove(b,state,V));

    for(const m of candidates){
      const { next, amount } = applyPour(state, m[0], m[1], V);
      if(amount===0) continue;
      path.push(m);
      if(trace) console.log(`move #${path.length}: (${m[0]}, ${m[1]})`);
      if(dfs(next, depth+1, m)) return true;
      path.pop();
    }
    return false;
  }

  return dfs(initial, 0, null) ? path.slice() : null;
}
