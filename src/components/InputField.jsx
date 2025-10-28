import React, { useState } from "react";

export default function InputField({
  label,
  value,
  onChangeText,        // RN-style
  onChange,            // web-style
  placeholder,
  secureTextEntry = false,
  multiline = false,
  keyboardType,        // RN-style
  type,                // web-style
  autoCapitalize,
  theme = {
    card: "#fff",
    text: "#0f172a",
    subtle: "#6b7280",
    border: "#e5e7eb",
    primary: "#2563eb",
  },
  id,
}) {
  const [focused, setFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  // Normalize `type`/`keyboardType`
  const resolvedType = (() => {
    if (secureTextEntry) return isSecure ? "password" : "text";
    if (type) return type;
    if (keyboardType === "email-address" || keyboardType === "email") return "email";
    if (keyboardType === "numeric" || keyboardType === "number-pad") return "number";
    return "text";
  })();

  const autoCap =
    autoCapitalize === "none" ? "off" :
    autoCapitalize === "characters" ? "characters" :
    autoCapitalize === "words" ? "words" :
    autoCapitalize === "sentences" ? "sentences" : undefined;

  // Normalize change handler
  const handleChange = (e) => {
    onChangeText?.(e.target.value);
    onChange?.(e); // keep default web handler too
  };

  const sharedProps = {
    id,
    value,
    onChange: handleChange,
    placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      ...styles.input,
      color: theme.text,
    },
    "aria-invalid": false,
    autoCapitalize: autoCap,
    autoComplete: resolvedType === "email" ? "email" : "off",
  };

  return (
    <div style={styles.container}>
      {label ? (
        <label htmlFor={id} style={{ ...styles.label, color: theme.subtle }}>
          {label}
        </label>
      ) : null}

      <div
        data-inputwrap
        style={{
          ...styles.inputWrap,
          borderColor: focused ? theme.primary : theme.border,
          backgroundColor: theme.card,
          "--placeholderColor": theme.subtle,
        }}
      >
        {multiline ? (
          <textarea
            {...sharedProps}
            rows={4}
            style={{ ...sharedProps.style, resize: "vertical" }}
          />
        ) : (
          <input
            {...sharedProps}
            type={resolvedType}
            inputMode={
              resolvedType === "number" ? "numeric" :
              resolvedType === "email" ? "email" : undefined
            }
          />
        )}

        {secureTextEntry ? (
          <button
            type="button"
            onClick={() => setIsSecure(!isSecure)}
            style={styles.eyeBtn}
            aria-label={isSecure ? "Show password" : "Hide password"}
          >
            {isSecure ? (
              <EyeOffIcon color={theme.subtle} />
            ) : (
              <EyeIcon color={theme.primary} />
            )}
          </button>
        ) : null}
      </div>

      <style>{`
        div[data-inputwrap] ::placeholder {
          color: var(--placeholderColor);
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

function EyeIcon({ color = "#6b7280", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function EyeOffIcon({ color = "#6b7280", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18M10.6 10.6a3 3 0 1 0 4.8 4.8M9.88 4.26A8.73 8.73 0 0 1 12 4c6.5 0 10.5 7 10.5 7a17.1 17.1 0 0 1-2.2 2.85M6.6 6.6C3.67 8.75 1.5 12 1.5 12s4 7 10.5 7c1.26 0 2.45-.23 3.54-.64" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const styles = {
  container: { margin: "8px 0" },
  label: { marginBottom: 6, fontWeight: 700, fontSize: 13 },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: "solid",
    padding: "0 12px",
  },
  input: {
    flex: 1,
    minHeight: 40,
    padding: "12px 0",
    fontSize: 15,
    border: "none",
    outline: "none",
    background: "transparent",
  },
  eyeBtn: {
    paddingLeft: 8,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    lineHeight: 0,
  },
};
