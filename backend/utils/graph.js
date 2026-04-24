// utils/graph.js

function ensureNode(graph, node) {
  if (!graph[node]) graph[node] = [];
}

function buildGraph(validEdges) {
  const graph = {};
  const childSet = new Set();
  const parentByChild = new Map();
  const nodes = [];
  const nodeSet = new Set();

  function rememberNode(node) {
    if (!nodeSet.has(node)) {
      nodeSet.add(node);
      nodes.push(node);
    }
    ensureNode(graph, node);
  }

  for (const edge of validEdges) {
    const [parent, child] = edge.split("->");

    if (parentByChild.has(child)) {
      continue;
    }

    rememberNode(parent);
    rememberNode(child);
    graph[parent].push(child);
    childSet.add(child);
    parentByChild.set(child, parent);
  }

  return { graph, childSet, nodes };
}

function findComponents(graph, nodes) {
  const seen = new Set();
  const undirected = {};

  for (const node of nodes) {
    undirected[node] = undirected[node] || [];
    for (const child of graph[node] || []) {
      undirected[node].push(child);
      undirected[child] = undirected[child] || [];
      undirected[child].push(node);
    }
  }

  const components = [];

  for (const start of nodes) {
    if (seen.has(start)) continue;

    const component = [];
    const queue = [start];
    seen.add(start);

    for (let index = 0; index < queue.length; index++) {
      const node = queue[index];
      component.push(node);

      for (const neighbor of undirected[node] || []) {
        if (!seen.has(neighbor)) {
          seen.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    components.push(component);
  }

  return components;
}

function findRoot(component, childSet) {
  const roots = component.filter(node => !childSet.has(node)).sort();
  return roots[0] || [...component].sort()[0];
}

module.exports = { buildGraph, findComponents, findRoot };
