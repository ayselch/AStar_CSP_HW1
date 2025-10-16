# Homework 1: A\* Search + CSP

Two classic AI algorithms implemented in Node.js.

## Folder layout

- `AStar/` – A\* search in three modes (UCS, Euclidean, Manhattan)
- `CSP/` – Graph coloring via Backtracking + MRV + LCV + AC-3

## Quick start (Windows PowerShell)

Run from the repository root.

### A\* Search (Node.js)

- Requirements: Node.js 16+
- The script reads bundled inputs automatically: `AStar/astar_small.txt` and `AStar/astar_medium.txt`.

```
cd AStar
node astar.js
```

Expected output per mode includes: optimal cost, path, expanded nodes, pushes, max frontier, and runtime.

### CSP (Node.js)

- Requirements: Node.js 16+

```
cd ..\CSP
node csp.js csp_small.txt
node csp.js csp_tight.txt
```

Outputs either a variable→color assignment or `failure`.

## Input formats

### A\*

- Vertices section lines: `vertexId,cellId` (integers). Coordinates derived as: x = cellId // 10, y = cellId % 10.
- Edges section lines: `u,v,w` (undirected, weight w integer)
- Start/goal lines: `S,<id>` and `D,<id>`

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

### CSP

- First non-comment line: `colors=<k>`
- Subsequent lines: `u,v` edges defining an undirected graph

Examples are provided in `CSP/csp_small.txt` and `CSP/csp_tight.txt`.

---

For more details, see `AStar/README.md` and `CSP/README.md`.
