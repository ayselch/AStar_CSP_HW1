const fs = require("fs");

function readGraph(fileName) {
  const vertices = {};
  const edges = {};
  let start = null;
  let end = null;

  const lines = fs.readFileSync(fileName, "utf8").split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;

    if (line.startsWith("S,")) {
      start = parseInt(line.split(",")[1]);
    } else if (line.startsWith("D,")) {
      end = parseInt(line.split(",")[1]);
    } else {
      const parts = line.split(",").map((x) => parseInt(x));
      if (parts.length === 2) {
        const [id, cell] = parts;
        vertices[id] = cell;
        if (!edges[id]) edges[id] = [];
      } else if (parts.length === 3) {
        const [u, v, w] = parts;
        if (!edges[u]) edges[u] = [];
        if (!edges[v]) edges[v] = [];
        edges[u].push([v, w]);
        edges[v].push([u, w]);
      }
    }
  }

  return { vertices, edges, start, end };
}

function computeCoords(vertices) {
  const coords = {};
  for (const vid in vertices) {
    const cell = vertices[vid];
    const x = Math.floor(cell / 10);
    const y = cell % 10;
    coords[vid] = [x, y];
  }
  return coords;
}

function hZero(n, g, coords) {
  return 0;
}

function hEuclidean(n, g, coords) {
  const [x1, y1] = coords[n];
  const [x2, y2] = coords[g];
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function hManhattan(n, g, coords) {
  const [x1, y1] = coords[n];
  const [x2, y2] = coords[g];
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function astar(graph, coords, start, goal, heuristic) {
  const gCost = { [start]: 0 };
  const parent = { [start]: null };
  const queue = [[0, start]];

  let expanded = 0;
  let pushes = 0;
  let maxFrontier = 1;
  const t0 = performance.now();

  while (queue.length > 0) {
    queue.sort((a, b) => a[0] - b[0]); 
    const [fVal, current] = queue.shift();
    expanded++;

    if (current == goal) {
      const totalTime = (performance.now() - t0) / 1000;
      return makeResult(true, parent, goal, gCost[goal], expanded, pushes, maxFrontier, totalTime);
    }

    for (const [neigh, weight] of graph[current] || []) {
      const newG = gCost[current] + weight;
      if (newG < (gCost[neigh] ?? Infinity)) {
        gCost[neigh] = newG;
        parent[neigh] = current;
        const fScore = newG + heuristic(neigh, goal, coords);
        queue.push([fScore, neigh]);
        pushes++;
      }
    }

    if (queue.length > maxFrontier) maxFrontier = queue.length;
  }

  const totalTime = (performance.now() - t0) / 1000;
  return makeResult(false, parent, goal, null, expanded, pushes, maxFrontier, totalTime);
}

function makeResult(found, parent, goal, cost, expanded, pushes, frontier, runtime) {
  const path = [];
  if (found) {
    let node = goal;
    while (node != null) {
      path.push(node);
      node = parent[node];
    }
    path.reverse();
  }
  return { found, path: found ? path : null, cost, expanded, pushes, maxFrontier: frontier, runtime };
}

function showResult(data, mode) {
  console.log(`\nMODE: ${mode}`);
  console.log(`Optimal cost: ${data.found ? data.cost : "NO PATH"}`);
  if (data.found) console.log("Path:", data.path.join(" -> "));
  console.log(`Expanded: ${data.expanded}`);
  console.log(`Pushes: ${data.pushes}`);
  console.log(`Max frontier: ${data.maxFrontier}`);
  console.log(`Runtime (s): ${data.runtime.toFixed(6)}`);
}

function run(file) {
  const { vertices, edges, start, end } = readGraph(file);
  const coords = computeCoords(vertices);

  const modes = [
    [hZero, "UCS (h=0)"],
    [hEuclidean, "A* Euclidean"],
    [hManhattan, "A* Manhattan"],
  ];

  for (const [func, name] of modes) {
    const res = astar(edges, coords, start, end, func);
    showResult(res, name);
  }
}

console.log("============== ASTAR SMALL ==============");
run("astar_small.txt");
console.log("\n========================================");
console.log("============== ASTAR MEDIUM ==============");
run("astar_medium.txt");
