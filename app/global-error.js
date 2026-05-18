"use client";

import { useEffect } from "react";

const CHUNK_RELOAD_KEY = "__chunk_reload_attempted__";

function isChunkLoadError(error) {
  const message = error?.message || "";
  return (
    error?.name === "ChunkLoadError" ||
    message.includes("ChunkLoadError") ||
    message.includes("Loading chunk") ||
    message.includes("Failed to fetch dynamically imported module")
  );
}

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (!isChunkLoadError(error) || typeof window === "undefined") {
      return;
    }

    const lastAttempt = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
    const now = Date.now();

    if (!lastAttempt || now - lastAttempt > 30000) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
      window.location.reload();
    }
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif", padding: "32px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h1>Application error</h1>
          <p>The site hit a client-side error. Try reloading the page.</p>
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#1A2B6D",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#1A2B6D",
                cursor: "pointer",
              }}
            >
              Reload page
            </button>
          </div>
          <pre
            style={{
              marginTop: "24px",
              whiteSpace: "pre-wrap",
              color: "#475569",
              background: "#f8fafc",
              padding: "16px",
              borderRadius: "12px",
              overflowX: "auto",
            }}
          >
            {error?.message || String(error)}
          </pre>
        </div>
      </body>
    </html>
  );
}