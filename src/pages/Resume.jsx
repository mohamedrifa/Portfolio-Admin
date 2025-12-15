import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import { ref, get, child } from "firebase/database";
import { resumeTemplate } from "../utils/ResumeTemplate";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Resume = () => {
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoader(true);
    get(child(ref(db), `users/${id}`))
      .then((snap) => snap.exists() && setResume(snap.val()))
      .finally(() => setLoader(false));
  }, [id]);

  const resumeHTML = useMemo(
    () => (resume ? resumeTemplate(resume) : ""),
    [resume]
  );

  const shareResume = async (id) => {
    const link = `${window.location.origin}/resume/${id}`;
    if (navigator.share) {
      await navigator.share({ title: "My Resume", url: link });
    } else {
      await navigator.clipboard.writeText(link);
      alert("Resume link copied to clipboard!");
    }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    const response = await fetch(`${BACKEND_URL}/generate-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: resumeTemplate(resume),
        fileName: "resume.pdf",
      }),
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
    setDownloading(false);
    alert("PDF Saved Successfully!");
    window.URL.revokeObjectURL(url);
  };


  if(loader) {
    return (<div style={styles.page}>
      <p style={styles.loading}>Loading Resume...</p>
    </div>
  );
  }
  if (!resume) {
    return (
      <div style={styles.page}>
        <p style={styles.loading}>Resume not found.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {resume && (
        <div style={styles.fabContainer}>
          <button
            style={styles.fabSecondary}
            onClick={() => shareResume(id)}
            title="Share Resume"
          >
            Share
          </button>
          <button
            style={styles.fabPrimary}
            onClick={() => downloadPDF()}
            disabled={downloading}
            title="Download Resume"
          >
            {downloading ? "Saving..." : "Save PDF"}
          </button>
        </div>
      )}

      <div style={styles.resumeWrapper}>
        <div
          dangerouslySetInnerHTML={{ __html: resumeHTML }}
          style={styles.resume}
        />
      </div>
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0b1220",
    padding: "32px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  loading: {
    color: "#cbd5f5",
    marginBottom: 16,
    fontSize: 16,
  },

  actions: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },

  resumeWrapper: {
    width: "100%",
    maxWidth: 900,
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
  },

  resume: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    overflow: "hidden",
  },
  fabContainer: {
    position: "fixed",
    bottom: 24,
    right: 24,
    display: "flex",
    flexDirection: "row",
    gap: 12,
    zIndex: 1000,
  },

  fabPrimary: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(37,99,235,0.4)",
  },

  fabSecondary: {
    borderRadius: 5,
    backgroundColor: "#1e293b",
    color: "#cbd5f5",
    border: "1px solid #334155",
    fontSize: 18,
    cursor: "pointer",
  },
};


export default Resume;
