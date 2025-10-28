import React, { useState } from "react";

const palettes = {
  primary: { bg: "#2563EB", bgPressed: "#1E40AF", text: "#FFFFFF" },
  neutral: { bg: "#E5E7EB", bgPressed: "#D1D5DB", text: "#0F172A" },
  danger:  { bg: "#EF4444", bgPressed: "#B91C1C", text: "#FFFFFF" },
};

export default function Button({
  title,
  onPress,
  style,
  textStyle,
  variant = "primary",
  disabled = false,
  children, // optional: if provided, renders instead of title
  type = "button", // so it doesn't submit forms unless you want to
}) {
  const [pressed, setPressed] = useState(false);
  const palette = palettes[variant] || palettes.primary;

  return (
    <button
      type={type}
      onClick={onPress}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        ...styles.btn,
        backgroundColor: pressed ? palette.bgPressed : palette.bg,
        color: palette.text,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      <span style={{ ...styles.txt, ...textStyle }}>
        {children ?? title}
      </span>
    </button>
  );
}

const styles = {
  btn: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    outline: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "8px 0",
    boxShadow:
      "0 4px 6px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)", // similar to RN iOS/Android shadow
    transition: "background-color 120ms ease, transform 60ms ease",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
  },
  txt: {
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: 0.3,
    lineHeight: 1,
  },
};
