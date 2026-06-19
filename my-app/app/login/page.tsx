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

  const goToSignup = () => {
    router.push("/signup");
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(""); // clear old error

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

      router.push("/welcome");

    } catch {
      setError("idk broo, something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white md:flex">

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
            className="w-full py-3 bg-black text-white text-sm rounded-md
            hover:bg-[#00C852] hover:text-black transition font-medium"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>

          {/* 🔴 ERROR MESSAGE */}
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

    </div>
  );
}