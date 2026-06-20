"use client";

import Image from "next/image";
import logo from "@/public/vercel.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [weak, setWeak] = useState(true);

    
    const validateGooberPassword = (password: string) => {

    if (!/[A-Z]/.test(password)) {
        setError("Must include uppercase letter");
        return false;
    }

    if (!/[a-z]/.test(password)) {
        setError("Must include lowercase letter");
        return false;
    }

    if (!/\d/.test(password)) {
    setError("Password must include number");
    return false;
    }
        
    if (password.length < 14) {
        setError("Password must be at least 14 characters");
        return false;
    }

    const digits = password.match(/\d/g)?.map(Number) || [];

    if (digits.length < 3) {
        setError("Must include at least 3 digits");
        return false;
    }

    const isDescending = digits.every((d, i) => {
        return i === 0 || digits[i - 1] >= d;
    });

    if (digits.length >= 2 && !isDescending) {
        setError("Digits must be in descending order");
        return false;
    }
    
    const symbols = password.match(/[^a-zA-Z0-9]/g) || [];
    
    if (symbols.length < 2) {
        setError("Must include at least 2 symbols");
        return false;
    }
    
    if (weak) {
        setError("ur password too weak broo, think harder");
        setWeak(false); // next time it will pass if it meets the criteria
        return false;
    } 

    return true;
    };
    const handleSignup = async () => {
      const res = validateGooberPassword(password);

      if (!res) return;
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      router.push("/login");

    } catch {
      setError("Server error. Try again.");
    } finally {
        setLoading(false);
        router.push("/login");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center">

      {/* MOBILE GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,82,0.10),transparent_60%)] md:hidden" />

      {/* LEFT */}
      <div className="relative w-full flex flex-col justify-center px-6 py-12 md:w-1/2">

        {/* title */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-black">
            Create account
          </h1>

          <p className="text-sm text-black/40 mt-1">
            Join the delayed food experience
          </p>

          <div className="w-10 h-[2px] bg-[#00C852] mt-3 rounded-full" />
        </div>

        {/* form */}
        <div className="space-y-3">

          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-black/10 rounded-md"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-black/10 rounded-md"
          />

          {/* PASSWORD FIELD WITH EYE ICON */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-black/10 rounded-md pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* ERROR MESSAGE (ONLY ONE) */}
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-3 bg-black text-white text-sm rounded-md
            hover:bg-[#00C852] hover:text-black transition font-medium"
          >
            {loading ? "Creating..." : "Create account"}
          </button>

        </div>

        {/* login link */}
        <div className="text-center mt-4 text-[11px] text-black/40">
          Already have an account?{" "}
          <a href="/login" className="text-black hover:text-[#00C852] font-medium">
            Sign in
          </a>
        </div>

        {/* footer */}
        <div className="mt-10 text-center text-[10px] text-black/25">
          By continuing, you accept our Terms and emotional delivery conditions
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,82,0.18),transparent_60%)]" />

        <div className="relative text-center max-w-xs">

          <Image
            src={logo}
            alt="logo"
            width={44}
            height={44}
            className="invert mx-auto mb-6 opacity-90"
          />

          <h2 className="text-2xl font-medium leading-snug">
            Start ordering<br />bad decisions.
          </h2>

          <p className="text-white/40 text-sm mt-4">
            Fast sign up. Slow delivery.
          </p>
        </div>
      </div>

    </div>
  );
}