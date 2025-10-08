# Liquid Sorting – CLI (JavaScript / Node.js)

## What it does
Takes an initial board (tubes) and prints a sequence of moves `(from, to)` that sorts colors into uniform tubes. No UI, no frameworks.

## Install & Run
```bash
npm i             # no deps, command kept for uniform workflow
npm start         # runs with ./sample.json
# or custom file:
node src/cli.js path/to/your.json
# debug trace:
node src/cli.js sample.json --trace
```

## Input format
```json
{
  "V": 4,
  "tubes": [
    [1, 2, 2, 1],
    [2, 1, 1, 2],
    [],
    []
  ]
}
```
- Bottom is the first element; top is the last.
- Empty tube = `[]`.

## Output
Printed to stdout as `(a, b)` pairs, e.g.
```
(0, 2) (1, 3) (0, 3) ...
```

## Notes
- Solver: DFS with memoization + simple move ordering.
- Not guaranteed shortest path; just a valid one.
