import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../services/auth";
import ResumeForm from "../components/Resume/ResumeForm";

export default function Home() {
  const { user } = useAuth();
  const [btnHover, setBtnHover] = useState(false);

  const styles = {
    page: {
      width: "100%",
      height: "100%",
      margin: "0 auto",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "#0b1220", // subtle dark canvas looks crisp with light cards
    },
    container: {
      width: "100%",
    },
    card: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      boxShadow: "0 1px 2px rgba(2,6,23,0.04)",
      position: "sticky",
      top: 16,
    },
    cardRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      flexWrap: "wrap",
    },
    userText: {
      margin: 0,
      color: "#0f172a",
      fontSize: 14,
      lineHeight: 1.5,
    },
    nameChip: {
      display: "inline-block",
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      color: "#0f172a",
      padding: "2px 8px",
      borderRadius: 999,
      fontWeight: 800,
      marginLeft: 6,
    },
    signOutBtn: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #e2e8f0",
      cursor: "pointer",
      background: btnHover ? "#f8fafc" : "#ffffff",
      color: "#0f172a",
      fontWeight: 700,
      transition: "background 120ms ease",
    },
    formWrap: {
      background: "transparent",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardRow}>
            <p style={styles.userText}>
              You’re signed in as{" "}
              <span style={styles.nameChip}>
                {user?.displayName || user?.email || "User"}
              </span>
              .
            </p>
            <button
              onClick={() => signOut(auth)}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={styles.signOutBtn}
            >
              Sign out
            </button>
          </div>
        </div>

        <div style={styles.formWrap}>
          <ResumeForm />
        </div>
      </div>
    </div>
  );
}
