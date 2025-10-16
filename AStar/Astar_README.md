# A\* Search (Node.js)

Implements Uniform Cost Search (UCS) and A\* with Euclidean and Manhattan heuristics.

## Files

- `astar.js` – main script
- `astar_small.txt`, `astar_medium.txt` – sample graphs

## Usage (Windows PowerShell)

Run from this folder:

```
node astar.js
```

The script runs all three modes on both `astar_small.txt` and `astar_medium.txt` and prints, per mode:

- Optimal cost (or `NO PATH`)
- Path (node ids)
- Nodes expanded
- Pushes to priority queue
- Max frontier size
- Runtime in seconds

## Input format

- Vertices: `id,cell` where coordinates are computed as `x = cell // 10`, `y = cell % 10`
- Edges: `u,v,w` (undirected)
- Start and goal: `S,<id>` and `D,<id>`

Example:

```
# vertices: id,cell
1,11
2,12

# edges: u,v,w
1,2,7

# source and destination
S,1
D,2
```

## Heuristics

- UCS (h=0)
- A\* Euclidean: straight-line distance in grid coordinates
- A\* Manhattan: L1 distance in grid coordinates
