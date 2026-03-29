"use client";

import { useState } from "react";

export default function AIDashboard() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/admin/ai/generate");
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="prompt">$ sudo systemctl restart ai-generator</div>
      <h1 style={{ marginBottom: "2rem" }}>AI GENERATION CONTROL</h1>

      <div className="card">
        <p style={{ marginBottom: "1.5rem" }}>
          $ execute --daily-generation --force
        </p>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            background: loading ? "#30363d" : "var(--accent-color)",
            color: "white",
            padding: "0.8rem 1.5rem",
            border: "none",
            fontFamily: "var(--font-mono)",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "[RUNNING...]" : "$ START GENERATION"}
        </button>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <div className="prompt">$ tail /var/log/ai-generator.log</div>
          <div className="card" style={{ padding: "1rem", background: "#000", fontFamily: "monospace", overflow: "auto" }}>
            {results.map((result, idx) => (
              <div key={idx} style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "#8b949e" }}>[{new Date().toLocaleTimeString()}]</span>{" "}
                <span style={{ color: result.status === "success" ? "#238636" : result.status === "failed" ? "#ff4444" : "#e6edf3" }}>
                  {result.status.toUpperCase()}:
                </span>{" "}
                Category: {result.category} {result.reason ? `(${result.reason})` : ""}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
