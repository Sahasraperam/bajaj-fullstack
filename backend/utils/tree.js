// utils/tree.js

function hasCycle(node, graph, visited, stack, allowedNodes = null) {
  if (stack.has(node)) return true;
  if (visited.has(node)) return false;

  visited.add(node);
  stack.add(node);

  for (let neighbor of (graph[node] || [])) {
    if (allowedNodes && !allowedNodes.has(neighbor)) continue;

    if (hasCycle(neighbor, graph, visited, stack, allowedNodes)) {
      return true;
    }
  }

  stack.delete(node);
  return false;
}

function componentHasCycle(component, graph) {
  const allowedNodes = new Set(component);
  const visited = new Set();

  for (const node of component) {
    if (!visited.has(node) && hasCycle(node, graph, visited, new Set(), allowedNodes)) {
      return true;
    }
  }

  return false;
}

function buildTree(node, graph, visited = new Set()) {
  if (visited.has(node)) return {};

  visited.add(node);

  const children = graph[node] || [];
  const result = {};

  for (let child of children) {
    result[child] = buildTree(child, graph, visited);
  }

  return result;
}

function getDepth(tree) {
  if (!tree || Object.keys(tree).length === 0) return 1;

  let max = 0;

  for (let key in tree) {
    max = Math.max(max, getDepth(tree[key]));
  }

  return max + 1;
}

module.exports = { hasCycle, componentHasCycle, buildTree, getDepth };
