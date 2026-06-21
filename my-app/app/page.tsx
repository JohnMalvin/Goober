"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-white relative overflow-hidden">

      {/* subtle glow accents */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-green-400/10 blur-[120px] rounded-full bottom-[-120px] right-[-120px]" />

      {/* content */}
      <div className="text-center z-10 px-6">

        <h1 className="text-7xl sm:text-8xl font-bold tracking-widest text-white drop-shadow-[0_0_30px_rgba(34,197,94,0.25)]">
          Goober
        </h1>

        <p className="mt-4 text-zinc-400 text-sm tracking-wide font-mono">
          a journey to eternity
        </p>

        <button
          onClick={() => router.push("/signup")}
          className="mt-10 px-8 py-4 rounded-2xl bg-green-500 text-black font-bold tracking-wide
                     hover:bg-green-400 active:scale-95 transition
                     shadow-[0_0_25px_rgba(34,197,94,0.35)]"
        >
          Get Started
        </button>

        {/* decorative terminal line */}
        <div className="mt-10 text-xs font-mono text-zinc-600">
          system.status: online • vibe: unstable • mode: goober
        </div>
      </div>

      {/* animated grid overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}