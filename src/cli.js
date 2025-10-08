#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { solve } from './solver.js';
import { printState, isGoal } from './state.js';

function loadInput(filePath){
  const abs = path.resolve(process.cwd(), filePath);
  const raw = fs.readFileSync(abs, 'utf8');
  return JSON.parse(raw);
}

function main(){
  const [,, maybeFile, ...rest] = process.argv;
  const args = new Set(rest);
  const trace = args.has('--trace');

  const file = maybeFile ?? 'sample.json';
  const { V, tubes } = loadInput(file);
  const moves = solve(tubes, V, { maxDepth: 500, trace });

  if(!moves){
    console.log('No solution found within depth limit.');
    return;
  }
  console.log(moves.map(([a,b])=>`(${a}, ${b})`).join(' '));

  if(trace){
    console.log('\\nFinal state:');
    const finalState = moves.reduce((s,[a,b])=>globalThis.__applyPour(s,a,b), tubes);
    printState(finalState, V);
    console.log('Solved =', isGoal(finalState, V));
  }
}

main();
