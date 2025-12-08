import "../css/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  function togglePassword() {
    setShowPassword((v) => !v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Neuspešna prijava");
      }

      login(data.user, data.token);

      setMsg(`Dobrodošao/la, ${data.user.username}!`);

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/Dashboard");
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg(err.message);
      } else {
        setMsg("Neuspešna prijava");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login">
        <h2>Prijava</h2>
        <h4>Unesite svoje podatke kako biste nastavili.</h4>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Korisničko ime:</label>
          <input
            type="text"
            placeholder="Korisničko ime"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Šifra:</label>
          <div className="passwordContainer">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Šifra"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={togglePassword} className="toggleEye">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Prijavljujem..." : "Prijavi se"}
          </button>

          <p
          className="forgot-password"
           onClick={() => navigate("/reset-password")}
            > 
              Zaboravili ste šifru?
            </p>

        </form>

        {msg && (
          <div className={`message ${msg.includes("Dobrodošao") ? "success" : "error"}`}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}