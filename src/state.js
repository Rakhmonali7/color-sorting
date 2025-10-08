// State helpers
export function cloneState(state){ return state.map(t=>t.slice()); }
export function serialize(state){ return state.map(t=>t.join('|')).join('||'); }
export function freeSpace(tube,V){ return V - tube.length; }
export function topRun(tube){
  if(tube.length===0) return {color:null,height:0};
  const color = tube[tube.length-1];
  let height=1;
  for(let i=tube.length-2;i>=0 && tube[i]===color;i--) height++;
  return {color,height};
}
export function isGoal(state,V){
  return state.every(t=> t.length===0 || (t.length===V && t.every(x=>x===t[0])));
}
export function printState(state,V){
  console.log(`N=${state.length}, V=${V}`);
  state.forEach((t,i)=>console.log(`${i.toString().padStart(2,'0')}: [${t.join(', ')}]`));
}
