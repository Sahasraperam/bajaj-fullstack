// utils/validator.js

function isValidEdge(edge) {
  if (!edge || typeof edge !== "string") return false;

  edge = edge.trim();

  if (!/^[A-Z]->[A-Z]$/.test(edge)) return false;

  const [parent, child] = edge.split("->");

  if (parent === child) return false;

  return true;
}

module.exports = { isValidEdge };