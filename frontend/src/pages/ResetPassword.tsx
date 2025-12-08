import "../css/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:4000/api/auth";

export default function ResetPassword() {
  const [step, setStep] = useState<1 | 2>(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (!username || !email) {
      setError("Unesite korisničko ime i email.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/reset-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Provjera podataka nije uspjela.");
      }

      setMsg(
        data.message ||
          "Ako postoji nalog sa ovim podacima, kod je poslat na email."
      );
      setStep(2);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Provjera podataka nije uspjela.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (!code) {
      setError("Unesite kod koji ste dobili na email.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Unesite novu šifru i potvrdu.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Šifre se ne poklapaju.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/reset-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, code, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Promjena šifre nije uspjela.");
      }

      setMsg(
        data.message || "Šifra je uspješno promijenjena. Preusmjeravam na login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Promjena šifre nije uspjela.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login">
        <h2>Reset šifre</h2>
        <h4>
          {step === 1
            ? "Unesite korisničko ime i email naloga."
            : "Unesite kod sa emaila i novu šifru."}
        </h4>

        {step === 1 && (
          <form onSubmit={handleCheck}>
            <label htmlFor="username">Korisničko ime:</label>
            <input
              id="username"
              type="text"
              placeholder="Korisničko ime"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              placeholder="Email adresa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Provjeravam..." : "Dalje"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleConfirm}>
            <label htmlFor="code">Kod sa emaila:</label>
            <input
              id="code"
              type="text"
              placeholder="Na primjer 123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <label htmlFor="newPassword">Nova šifra:</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Nova šifra"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label htmlFor="confirmPassword">Ponovite novu šifru:</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Ponovi šifru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Snimam..." : "Sačuvaj šifru"}
            </button>
          </form>
        )}

        {msg && <div className="message success">{msg}</div>}
        {error && <div className="message error">{error}</div>}

        <button
          type="button"
          style={{ marginTop: "12px" }}
          onClick={() => navigate("/login")}
        >
          Vrati se na prijavu
        </button>
      </div>
    </div>
  );
}
