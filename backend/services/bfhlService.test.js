const assert = require("node:assert/strict");
const test = require("node:test");
const { processData } = require("./bfhlService");

test("matches the assignment sample hierarchy response", () => {
  const result = processData([
    "A->B", "A->C", "B->D", "C->E", "E->F",
    "X->Y", "Y->Z", "Z->X",
    "P->Q", "Q->R",
    "G->H", "G->H", "G->I",
    "hello", "1->2", "A->"
  ]);

  assert.deepEqual(result.hierarchies, [
    {
      root: "A",
      tree: { A: { B: { D: {} }, C: { E: { F: {} } } } },
      depth: 4
    },
    {
      root: "X",
      tree: {},
      has_cycle: true
    },
    {
      root: "P",
      tree: { P: { Q: { R: {} } } },
      depth: 3
    },
    {
      root: "G",
      tree: { G: { H: {}, I: {} } },
      depth: 2
    }
  ]);
  assert.deepEqual(result.invalid_entries, ["hello", "1->2", "A->"]);
  assert.deepEqual(result.duplicate_edges, ["G->H"]);
  assert.deepEqual(result.summary, {
    total_trees: 3,
    total_cycles: 1,
    largest_tree_root: "A"
  });
});

test("reports repeated duplicate edges only once", () => {
  const result = processData(["A->B", "A->B", "A->B"]);

  assert.deepEqual(result.duplicate_edges, ["A->B"]);
});

test("discards later multi-parent edges while keeping valid groups", () => {
  const result = processData(["A->D", "B->D", "B->E"]);

  assert.deepEqual(result.hierarchies, [
    { root: "A", tree: { A: { D: {} } }, depth: 2 },
    { root: "B", tree: { B: { E: {} } }, depth: 2 }
  ]);
});
