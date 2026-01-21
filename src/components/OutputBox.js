import React from "react";

export default function OutputBox({ sql, result }) {
  return (
    <div style={{ marginTop: "25px" }}>
      {sql && (
        <>
          <h3 style={{ marginBottom: "5px", color: "#333" }}>Generated SQL:</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "12px",
              overflowX: "auto",
              boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {sql}
          </pre>
        </>
      )}
      {result && (
        <>
          <h3 style={{ marginTop: "15px", marginBottom: "5px", color: "#333" }}>Result:</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "12px",
              overflowX: "auto",
              boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
