// ResetPassword.tsx (FULL FIXED)
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE = `${API_BASE_URL}/api/auth`;

export default function ResetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<"check" | "verify" | "reset">("check");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    try {
      if (!API_BASE_URL) throw new Error("VITE_API_URL is not configured.");

      setLoading(true);
      setMsg(null);

      const res = await fetch(`${API_BASE}/reset-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Greška");

      setMsg("Kod je poslat na email (ako korisnik postoji).");
      setStep("verify");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Greška");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    try {
      if (!API_BASE_URL) throw new Error("VITE_API_URL is not configured.");

      setLoading(true);
      setMsg(null);

      const res = await fetch(`${API_BASE}/reset-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Greška");

      setMsg("Kod je validan. Unesite novu šifru.");
      setStep("reset");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Greška");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    try {
      if (!API_BASE_URL) throw new Error("VITE_API_URL is not configured.");

      setLoading(true);
      setMsg(null);

      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, code, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Greška");

      setMsg("Šifra je promijenjena. Možete se prijaviti.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Greška");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-[#294a70]">Reset šifre</h1>

        {step === "check" && (
          <>
            <p className="text-gray-600 mt-2">Unesite korisničko ime ili email.</p>
            <input
              className="mt-4 w-full border rounded-lg p-3"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="username ili email"
            />
            <button
              disabled={loading}
              onClick={handleCheck}
              className="mt-4 w-full px-4 py-3 rounded-lg bg-[#294a70] text-white font-semibold disabled:opacity-50"
            >
              {loading ? "..." : "Pošalji kod"}
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <p className="text-gray-600 mt-2">Unesite kod koji ste dobili.</p>
            <input
              className="mt-4 w-full border rounded-lg p-3"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="kod"
            />
            <button
              disabled={loading}
              onClick={handleVerify}
              className="mt-4 w-full px-4 py-3 rounded-lg bg-[#294a70] text-white font-semibold disabled:opacity-50"
            >
              {loading ? "..." : "Verifikuj kod"}
            </button>
          </>
        )}

        {step === "reset" && (
          <>
            <p className="text-gray-600 mt-2">Unesite novu šifru.</p>
            <input
              type="password"
              className="mt-4 w-full border rounded-lg p-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="nova šifra"
            />
            <button
              disabled={loading}
              onClick={handleReset}
              className="mt-4 w-full px-4 py-3 rounded-lg bg-[#ffab1f] text-black font-semibold disabled:opacity-50"
            >
              {loading ? "..." : "Promijeni šifru"}
            </button>
          </>
        )}

        {msg && <div className="mt-4 text-sm text-gray-700">{msg}</div>}
      </div>
    </div>
  );
}
