import React, { useRef } from "react";

export default function ImagePicker({ value, onChange }) {
  const inputRef = useRef(null);

  // Trigger hidden file input
  const openFilePicker = () => inputRef.current?.click();

  // Convert file to base64 data URI
  const toBase64DataUri = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Handle image selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const dataUri = await toBase64DataUri(file);
      onChange?.(dataUri); // return base64 data URI to parent
    } catch (err) {
      console.error("Image conversion failed:", err);
      alert("Unable to read/convert the image.");
    }
  };

  // Remove profile image
  const handleRemove = (e) => {
    e.stopPropagation(); // prevent triggering file picker
    onChange?.("");
  };

  return (
    <div
      style={{
        textAlign: "center",
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Image container */}
      <div
        onClick={openFilePicker}
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "2px dashed #0b7285",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
          backgroundColor: "#f8fafc",
        }}
      >
        {value ? (
          <img
            src={value}
            alt="profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span
            style={{
              color: "#0b7285",
              fontSize: 12,
              textAlign: "center",
              padding: "2px",
            }}
          >
            Upload
          </span>
        )}
      </div>

      {/* Delete text button */}
      {value && (
        <button
              onClick={handleRemove}
              style={{
                marginTop: -10,
                marginLeft: -20,
                background: "transparent",
                border: "none",
                color: "red",
                fontSize: 16,
                fontWeight: "regular",
                cursor: "pointer",
                lineHeight: 1,
              }}
              title="Remove image"
            >
              X
            </button>
      )}
    </div>
  );
}
