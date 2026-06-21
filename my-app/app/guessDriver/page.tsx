"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ably } from "@/lib/ably";

import AlexImage from "../../public/mockup.jpg";

interface DriverData {
    driverName: string;
}

interface DriverProfile {
    image: StaticImageData;
}

const DRIVER_MAP: Record<string, DriverProfile> = {
    alex: { image: AlexImage },
};

const MAX_ATTEMPTS = 6;

export default function GuessDriver() {
    const router = useRouter();

    const [driver, setDriver] = useState<DriverData | null>(null);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [current, setCurrent] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [demotionModal, setDemotionModal] = useState({ show: false, newStars: 5 });

    // 1. Keep a mutable ref of the target name to eliminate stale closures completely
    const targetRef = useRef("");

    useEffect(() => {
        const data = localStorage.getItem("driver");
        if (data) {
            try {
                const parsed = JSON.parse(data) as DriverData;
                setDriver(parsed);
                targetRef.current = parsed.driverName || ""; // Keep ref updated
            } catch (e) {
                console.error("Failed to parse driver data", e);
            }
        }
    }, []);

    const target = useMemo(() => driver?.driverName || "", [driver]);

    // Update ref if target changes dynamically
    useEffect(() => {
        targetRef.current = target;
    }, [target]);

    // -----------------------------
    // KEY INPUT & GAME LOGIC
    // -----------------------------
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const currentTarget = targetRef.current;
            if (gameOver || !currentTarget) return;

            if (e.key === "Enter") {
                if (current.length !== currentTarget.length) return;

                const newGuesses = [...guesses, current];
                setGuesses(newGuesses);
                setCurrent("");

                // WIN CONDITION
                if (current === currentTarget) {
                    setGameOver(true);
                    let userLocation: string | null = null;
                    const addressItem = localStorage.getItem("address");

                    if (addressItem) {
                        try {
                            const parsedAddress = JSON.parse(addressItem) as { mine?: string | null };
                            userLocation = parsedAddress?.mine ? String(parsedAddress.mine) : null;
                        } catch (e) {
                            console.error("Failed to parse address", e);
                        }
                    }
                    // Safely parse address only if it exists to avoid passing null to JSON.parse
                    const rawAddress = localStorage.getItem("address");
                    console.log("user set ", rawAddress ? JSON.parse(rawAddress) : null);

                    ably.channels.get("online").publish("deliveryConfirmed", {
                        driverName: currentTarget,
                        status: "accepted",
                        userLocation: userLocation,
                    });
                    router.push("/trackProgress");
                    return;
                }

                // FAIL CONDITION
                if (newGuesses.length >= MAX_ATTEMPTS) {
                    setGameOver(true);

                    // Send payload using the guaranteed fresh string ref
                    ably.channels.get("online").publish("deliveryConfirmed", {
                        driverName: currentTarget,
                        status: "failed",
                    });

                    const savedStars = localStorage.getItem("stars");
                    const currentStars = savedStars ? Number(savedStars) : 5;
                    const nextStars = Math.max(3, currentStars - 1);

                    localStorage.setItem("stars", String(nextStars));
                    setDemotionModal({ show: true, newStars: nextStars });
                }
            }

            if (e.key === "Backspace") {
                setCurrent((p) => p.slice(0, -1));
            }

            if (/^[a-zA-Z0-9]$/.test(e.key)) {
                if (current.length < currentTarget.length) {
                    setCurrent((p) => p + e.key.toLowerCase());
                }
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [current, guesses, gameOver, router]); // target removed from dependencies because we use targetRef

    const handleCloseDemotionModal = () => {
        setDemotionModal({ show: false, newStars: 5 });
        router.push("/findDriver");
    };

    if (!driver) return <div>Loading...</div>;

    const profile = DRIVER_MAP[target];
    const getColor = (letter: string, i: number): string => {
        if (!target) return "";
        if (target[i] === letter) return "bg-green-500 text-white";
        if (target.includes(letter)) return "bg-yellow-400 text-white";
        return "bg-gray-200";
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative">
            {profile && (
                <Image src={profile.image} alt="driver" width={100} height={100} className="rounded-full mb-4" />
            )}

            <h1 className="font-bold text-xl mb-4">Guess the driver</h1>

            <div className="flex flex-col gap-2">
                {Array.from({ length: MAX_ATTEMPTS }).map((_, row) => {
                    const isActive = row === guesses.length;
                    const rowGuess = guesses[row] || (isActive ? current : "");

                    return (
                        <div key={row} className="flex gap-2">
                            {Array.from({ length: target.length }).map((_, col) => (
                                <div
                                    key={col}
                                    className={`w-10 h-10 border flex items-center justify-center font-bold uppercase ${
                                        row < guesses.length ? getColor(rowGuess[col], col) : ""
                                    }`}
                                >
                                    {rowGuess[col] || ""}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {demotionModal.show && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center shadow-2xl">
                        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Driver Match Failed</h3>
                        <p className="text-sm text-gray-500 mb-8">
                            You have been demoted to a <span className="text-amber-600 font-bold">{demotionModal.newStars}-star</span> tier match configuration.
                        </p>
                        <button onClick={handleCloseDemotionModal} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform">
                            Find New Driver
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}