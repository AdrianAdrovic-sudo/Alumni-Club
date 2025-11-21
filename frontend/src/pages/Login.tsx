import '../css/Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function togglePassword() {
    setShowPassword(v => !v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // Store token + user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMsg(`Logged in as ${data.user.role}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg(err.message);
      } else {
        setMsg("Login failed");
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login">
        <h2>Login</h2>
        <h4>Unesite svoje podatke kako biste nastavili.</h4>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Korisničko ime:</label>
          <input
            type="text"
            placeholder="Korisničko ime"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Šifra:</label>
          <div className="passwordContainer">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Šifra"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={togglePassword} className="toggleEye">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Potvrdi</button>

          <p>Zaboravili ste sifru?</p>
        </form>

        {msg && <p style={{ marginTop: "10px" }}>{msg}</p>}
      </div>
    </div>
  );
}
