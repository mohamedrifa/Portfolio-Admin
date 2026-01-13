import React, { useState, useRef, useEffect } from "react";

export default function InputField({
  label,
  value,
  onChangeText,
  multiline = false,
  placeholder,
  theme = {
    card: "#fff",
    text: "#0f172a",
    subtle: "#6b7280",
    border: "#e5e7eb",
    primary: "#2563eb",
  },
}) {
  const [focused, setFocused] = useState(false);
  const [activeStyles, setActiveStyles] = useState({});
  const editorRef = useRef(null);

  // Initialize editor content
  useEffect(() => {
    if (multiline && editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value, multiline]);

  const handleChange = () => {
    onChangeText?.(editorRef.current.innerHTML);
    updateActiveStyles();
  };

  const execCommand = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
    updateActiveStyles();
  };

  // Update which styles are active at the caret
  const updateActiveStyles = () => {
    const styles = {
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    };
    setActiveStyles(styles);
  };

  // Update active styles on keyup, mouseup, or click
  useEffect(() => {
    if (!multiline) return;
    const editor = editorRef.current;
    editor.addEventListener("keyup", updateActiveStyles);
    editor.addEventListener("mouseup", updateActiveStyles);
    editor.addEventListener("click", updateActiveStyles);
    return () => {
      editor.removeEventListener("keyup", updateActiveStyles);
      editor.removeEventListener("mouseup", updateActiveStyles);
      editor.removeEventListener("click", updateActiveStyles);
    };
  }, [multiline]);

  const getButtonStyle = (command) => ({
    fontWeight: command === "bold" ? "bold" : "normal",
    fontStyle: command === "italic" ? "italic" : "normal",
    textDecoration: command === "underline" ? "underline" : "none",
    color: theme.text,
    backgroundColor: theme.card,
    border: activeStyles[command]
      ? `2px solid ${theme.primary}`
      : "1px solid transparent",
    borderRadius: 4,
    padding: "4px 8px",
    cursor: "pointer",
  });


  return (
    <div style={{ margin: "8px 0" }}>
      {label && (
        <label
          style={{
            color: theme.subtle,
            fontWeight: 700,
            marginBottom: 6,
            display: "block",
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          borderRadius: 10,
          border: `1.5px solid ${focused ? theme.primary : theme.border}`,
          backgroundColor: theme.card,
          overflow: "hidden",
        }}
      >
        {multiline && (
          <div
            style={{
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              padding: "4px 8px",
              gap: 4,
              backgroundColor: theme.card,
            }}
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => execCommand("bold")}
              style={getButtonStyle("bold")}
            >
              B
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => execCommand("italic")}
              style={getButtonStyle("italic")}
            >
              I
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => execCommand("underline")}
              style={getButtonStyle("underline")}
            >
              U
            </button>
          </div>
        )}

        {multiline ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              minHeight: 120,
              outline: "none",
              padding: 8,
              color: theme.text,
              backgroundColor: theme.card,
            }}
            data-placeholder={placeholder}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChangeText?.(e.target.value)}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: theme.text,
            }}
          />
        )}
      </div>
    </div>
  );
}
