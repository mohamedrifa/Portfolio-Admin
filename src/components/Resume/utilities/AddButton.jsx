import React from "react";

export default function AddButton({ title = "+ Add new record", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: "#0e134b",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: "14px",
        padding: 0,
      }}
    >
      {title}
    </button>
  );
}
