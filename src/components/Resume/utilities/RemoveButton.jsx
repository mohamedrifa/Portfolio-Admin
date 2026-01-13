import React from "react";

export default function RemoveButton({ onClick, title = "✕" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "0 10px",
        borderRadius: "6px",
        border: "1px solid #fecaca",
        background: "#fff",
        cursor: "pointer",
        fontWeight: 700,
        color: "#ef4444",
      }}
      aria-label="Remove"
    >
      {title}
    </button>
  );
}
