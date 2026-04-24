import { useMemo, useState } from "react";
import "./App.css";

const defaultInput = `A->B
A->C
B->D
C->E
E->F
X->Y
Y->Z
Z->X
P->Q
Q->R
G->H
G->H
G->I
hello
1->2
A->`;

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

function parseInput(value) {
  return value
    .split(/[\n,]+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function TreeNode({ label, childrenMap }) {
  const entries = Object.entries(childrenMap || {});

  return (
    <li>
      <span className="node-label">{label}</span>
      {entries.length > 0 && (
        <ul>
          {entries.map(([child, nested]) => (
            <TreeNode key={child} label={child} childrenMap={nested} />
          ))}
        </ul>
      )}
    </li>
  );
}

function HierarchyCard({ hierarchy }) {
  const treeEntries = Object.entries(hierarchy.tree || {});

  return (
    <article className="hierarchy-card">
      <div className="card-heading">
        <h3>{hierarchy.root}</h3>
        {hierarchy.has_cycle ? (
          <span className="status status-cycle">Cycle</span>
        ) : (
          <span className="status">Depth {hierarchy.depth}</span>
        )}
      </div>

      {hierarchy.has_cycle ? (
        <p className="muted">Cycle detected in this group.</p>
      ) : (
        <ul className="tree-view">
          {treeEntries.map(([root, nested]) => (
            <TreeNode key={root} label={root} childrenMap={nested} />
          ))}
        </ul>
      )}
    </article>
  );
}

function App() {
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const parsedItems = useMemo(() => parseInput(input), [input]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${apiBaseUrl}/bfhl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsedItems })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "API request failed.");
      }

      setResult(payload);
    } catch (requestError) {
      setError(
        `${requestError.message}. Make sure the backend is running at ${apiBaseUrl}.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="input-panel">
          <div>
            <p className="eyebrow">SRM Full Stack Challenge</p>
            <h1>Hierarchy Builder</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="edges">Node entries</label>
            <textarea
              id="edges"
              value={input}
              onChange={event => setInput(event.target.value)}
              rows={18}
              spellCheck="false"
            />
            <div className="form-footer">
              <span>{parsedItems.length} entries ready</span>
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        <div className="result-panel">
          {error && <div className="error-box">{error}</div>}

          {!result && !error && (
            <div className="empty-state">
              <h2>API response appears here</h2>
              <p>Submit the sample data or paste your own uppercase node edges.</p>
            </div>
          )}

          {result && (
            <>
              <div className="summary-grid">
                <div>
                  <span>Total trees</span>
                  <strong>{result.summary.total_trees}</strong>
                </div>
                <div>
                  <span>Total cycles</span>
                  <strong>{result.summary.total_cycles}</strong>
                </div>
                <div>
                  <span>Largest root</span>
                  <strong>{result.summary.largest_tree_root || "-"}</strong>
                </div>
              </div>

              <section className="meta-strip">
                <span>{result.user_id}</span>
                <span>{result.email_id}</span>
                <span>{result.college_roll_number}</span>
              </section>

              <section className="list-section">
                <h2>Hierarchies</h2>
                <div className="hierarchy-grid">
                  {result.hierarchies.map(hierarchy => (
                    <HierarchyCard key={hierarchy.root} hierarchy={hierarchy} />
                  ))}
                </div>
              </section>

              <section className="list-section split">
                <div>
                  <h2>Invalid entries</h2>
                  <p>{result.invalid_entries.length ? result.invalid_entries.join(", ") : "None"}</p>
                </div>
                <div>
                  <h2>Duplicate edges</h2>
                  <p>{result.duplicate_edges.length ? result.duplicate_edges.join(", ") : "None"}</p>
                </div>
              </section>

              <section className="list-section">
                <h2>Raw JSON</h2>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
