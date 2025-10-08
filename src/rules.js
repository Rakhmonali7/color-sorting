import { cloneState, freeSpace, topRun } from './state.js';

export function canPour(A,B,V){
  if(A.length===0) return false;
  if(freeSpace(B,V)===0) return false;
  const {color} = topRun(A);
  const topB = B.length ? B[B.length-1] : null;
  return topB===null || topB===color;
}

export function applyPour(state, from, to, V){
  const s = cloneState(state);
  const A = s[from], B = s[to];
  const { color, height } = topRun(A);
  if(color===null) return { next:s, amount:0 };
  const k = Math.min(height, freeSpace(B,V));
  for(let i=0;i<k;i++) B.push(A.pop());
  return { next:s, amount:k };
}

// Small helper used by CLI trace mode to replay
if(!globalThis.__applyPour){
  globalThis.__applyPour = function(state, from, to, V = state.__V ?? null){
    if(V==null) V = Math.max(...state.map(t=>t.length));
    return applyPour(state, from, to, V).next;
  };
}
