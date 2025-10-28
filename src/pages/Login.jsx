import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import InputField from "../components/InputField";
import Button from "../components/Button"; // <-- fix path/name

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/", { replace: true });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleEmailLogin} style={styles.card}>
        <h1>Login</h1>

        <InputField
          id="email"
          label="Email"
          value={email}
          onChangeText={setEmail}      // works with updated component
          type="email"                 // or keyboardType="email"
          placeholder="you@example.com"
          autoCapitalize="none"
        />

        <InputField
          id="password"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Your password"
          autoCapitalize="none"
        />

        {err && <p style={styles.error}>{err}</p>}

        <Button type="submit" style={styles.primaryBtn} disabled={loading}>
          {loading ? "Logging in…" : "Log In"}
        </Button>
      </form>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#0f172a", padding: 16 },
  card: { width: 400, maxWidth: 500, background: "#fff", borderRadius: 12, padding: 30, boxShadow: "0 10px 30px rgba(0,0,0,.15)", display: "flex", flexDirection: "column", gap: 12 },
  primaryBtn: { padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 },
  error: { color: "#b91c1c", background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 10px", fontSize: 12 },
};
