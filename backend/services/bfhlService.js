// services/bfhlService.js

const { isValidEdge } = require("../utils/validator");
const { buildGraph, findComponents, findRoot } = require("../utils/graph");
const { componentHasCycle, buildTree, getDepth } = require("../utils/tree");

const identity = {
  user_id: process.env.BFHL_USER_ID || "yourname_ddmmyyyy",
  email_id: process.env.BFHL_EMAIL_ID || "your@email.com",
  college_roll_number: process.env.BFHL_ROLL_NUMBER || "xxx"
};

function processData(data) {
  const seen = new Set();
  const duplicateSet = new Set();
  const validEdges = [];
  const duplicates = [];
  const invalid = [];

  // Step 1: Validate + duplicates
  for (const entry of data) {
    const edge = typeof entry === "string" ? entry.trim() : entry;

    if (!isValidEdge(edge)) {
      invalid.push(edge);
      continue;
    }

    if (seen.has(edge)) {
      if (!duplicateSet.has(edge)) {
        duplicateSet.add(edge);
        duplicates.push(edge);
      }
      continue;
    }

    seen.add(edge);
    validEdges.push(edge);
  }

  // Step 2: Graph
  const { graph, childSet, nodes } = buildGraph(validEdges);
  const components = findComponents(graph, nodes);

  // Step 3: Build hierarchies
  const hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;
  let maxDepth = -1;
  let largestRoot = "";

  for (const component of components) {
    const root = findRoot(component, childSet);
    const cycle = componentHasCycle(component, graph);

    if (cycle) {
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      });
      totalCycles++;
      continue;
    }

    const tree = { [root]: buildTree(root, graph) };
    const depth = getDepth(tree[root]);

    if (depth > maxDepth || (depth === maxDepth && (!largestRoot || root < largestRoot))) {
      maxDepth = depth;
      largestRoot = root;
    }

    hierarchies.push({
      root,
      tree,
      depth
    });

    totalTrees++;
  }

  return {
    ...identity,

    hierarchies,
    invalid_entries: invalid,
    duplicate_edges: duplicates,

    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestRoot
    }
  };
}

module.exports = { processData };
