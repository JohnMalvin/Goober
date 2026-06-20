"use client";

import Image from "next/image";
import logo from "../../public/logo.svg";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clicks, setClicks] = useState(0);
  const [buttonPos, setButtonPos] = useState({ left: "50%", top: "80%" });

  const goToSignup = () => {
    router.push("/signup");
  };

  const runLogin = async () => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/order");
    } catch {
      setError("idk broo, something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const randomPosition = () => {
    const min = 10;
    const max = 90;
    const left = Math.floor(Math.random() * (max - min + 1)) + min;
    const top = Math.floor(Math.random() * (max - min + 1)) + min;
    return { left: `${left}%`, top: `${top}%` };
  };

  const handleLogin = async () => {
    if (loading) return;

    setError("");

    if (clicks < 6) {
      setClicks((prev) => prev + 1);
      setButtonPos(randomPosition());
      return;
    }

    setLoading(true);
    await runLogin();
  };

  return (
    <div className="min-h-[95vh] min-w-screen bg-white md:flex items-center justify-center flex">

      {/* MOBILE */}
      <div className="relative w-full flex flex-col justify-center px-6 py-12 md:w-1/2">

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-black">
            Sign in
          </h1>

          <p className="text-sm text-black/40 mt-1">
            Continue your delayed experience
          </p>

          <div className="w-10 h-[2px] bg-[#00C852] mt-3 rounded-full" />
        </div>

        {/* FORM */}
        <div className="space-y-3">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-black/10 rounded-md
            outline-none focus:border-[#00C852] focus:ring-2 focus:ring-[#00C852]/15 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-black/10 rounded-md
            outline-none focus:border-[#00C852] focus:ring-2 focus:ring-[#00C852]/15 transition"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="hidden"
          >
            Continue
          </button>

          {error && (
            <p className="text-sm text-red-500 mt-2">
              {error}
            </p>
          )}
        </div>

        {/* links */}
        <div className="flex justify-between mt-4 text-[11px] text-black/40">
          <a className="hover:text-[#00C852] transition" href="#">
            Forgot?
          </a>

          <button
            className="hover:text-[#00C852] transition"
            onClick={goToSignup}
          >
            Create account
          </button>
        </div>

        {/* footer */}
        <div className="mt-10 text-center text-[10px] text-black/25 leading-relaxed">
          Expect delays. Food may arrive cold.<br />
          No refunds for emotional damage.
        </div>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          position: "fixed",
          left: buttonPos.left,
          top: buttonPos.top,
          transform: "translate(-50%, -50%)",
        }}
        className={`z-50 px-5 py-3 bg-black text-white text-sm rounded-full shadow-2xl transition duration-200 ${
          loading ? "cursor-wait opacity-70" : "hover:bg-[#00C852] hover:text-black w-[40vw] mt-10"
        }`}
      >
        {loading ? "Signing in..." : clicks < 1 ? 'Login' : clicks < 2 ? `Oopsieee` : clicks < 3 ? 'Sike' : clicks < 4 ? 'Surely this time' : clicks < 5 ? 'Try harder bro' : clicks < 6 ? 'Just click it man' : 'Skill Issue'}
      </button>
    </div>
  );
}