const fs = require("fs");

function readInput(filename) {
  const text = fs.readFileSync(filename, "utf8");
  const lines = text.split(/\r?\n/);
  let colors = null;
  const edges = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("colors=")) {
      colors = parseInt(line.split("=")[1]);
    } else {
      const [u, v] = line.split(",").map(Number);
      edges.push([u, v]);
    }
  }
  return { colors, edges };
}

function buildGraph(edges) {
  const graph = {};
  for (const [u, v] of edges) {
    if (!graph[u]) graph[u] = new Set();
    if (!graph[v]) graph[v] = new Set();
    graph[u].add(v);
    graph[v].add(u);
  }
  return graph;
}

function initDomains(graph, k) {
  const domains = {};
  for (const node in graph) {
    domains[node] = Array.from({ length: k }, (_, i) => i + 1);
  }
  return domains;
}

function selectUnassignedVar(domains, assignment) {
  const unassigned = Object.keys(domains).filter(
    (v) => !(v in assignment)
  );
  return unassigned.reduce((a, b) =>
    domains[a].length <= domains[b].length ? a : b
  );
}

function orderValues(varName, domains, graph) {
  const neighbors = graph[varName];
  const countConflicts = (value) => {
    let count = 0;
    for (const nb of neighbors) {
      if (domains[nb] && domains[nb].includes(value)) count++;
    }
    return count;
  };
  return [...domains[varName]].sort((a, b) => countConflicts(a) - countConflicts(b));
}

function ac3(graph, domains) {
  const queue = [];
  for (const x in graph) {
    for (const y of graph[x]) queue.push([x, y]);
  }

  while (queue.length) {
    const [x, y] = queue.shift();
    if (revise(domains, x, y)) {
      if (domains[x].length === 0) return false;
      for (const z of graph[x]) {
        if (z !== y) queue.push([z, x]);
      }
    }
  }
  return true;
}

function revise(domains, x, y) {
  let revised = false;
  for (const val of [...domains[x]]) {
    const allSame = domains[y].every((v) => v === val);
    if (allSame) {
      domains[x] = domains[x].filter((v) => v !== val);
      revised = true;
    }
  }
  return revised;
}

function backtrack(assignment, graph, domains) {
  if (Object.keys(assignment).length === Object.keys(graph).length) {
    return assignment;
  }

  const varName = selectUnassignedVar(domains, assignment);

  for (const value of orderValues(varName, domains, graph)) {
    const consistent = [...graph[varName]].every(
      (nb) => assignment[nb] !== value
    );

    if (consistent) {
      const localDomains = JSON.parse(JSON.stringify(domains));
      assignment[varName] = value;

      if (ac3(graph, localDomains)) {
        const result = backtrack(assignment, graph, localDomains);
        if (result) return result;
      }
      delete assignment[varName];
    }
  }

  return null;
}

function solveCSP(filename) {
  const { colors, edges } = readInput(filename);
  const graph = buildGraph(edges);
  const domains = initDomains(graph, colors);
  const result = backtrack({}, graph, domains);

  if (result) console.log("SOLUTION:", result);
  else console.log("failure");
}

if (process.argv.length < 3) {
  console.log("Usage: node csp.js <input_file>");
} else {
  solveCSP(process.argv[2]);
}
