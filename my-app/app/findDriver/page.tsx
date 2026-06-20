"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ably } from "@/lib/ably";
import { Types } from "ably";

interface AcceptDeliveryPayload {
	requestId: string;
	driverName: string;
}

export default function FindDriver() {
	const router = useRouter();

	const [dots, setDots] = useState("");
	const [pulse, setPulse] = useState(0);
	const [stars] = useState<number>(() => {
		if (typeof window === "undefined") return 5;
		const saved = localStorage.getItem("stars");
		return saved ? Number(saved) : 5;
	});

	// -----------------------------
	// DOT ANIMATION
	// -----------------------------
	useEffect(() => {
		const interval = setInterval(() => {
			setDots((p) => (p.length >= 3 ? "" : p + "."));
		}, 400);
		return () => clearInterval(interval);
	}, []);

	// -----------------------------
	// SCAN ANIMATION
	// -----------------------------
	useEffect(() => {
		const interval = setInterval(() => {
			setPulse((p) => (p + 1) % 3);
		}, 600);
		return () => clearInterval(interval);
	}, []);

	// -----------------------------
	// SEND REQUEST (STAR BASED)
	// -----------------------------
	useEffect(() => {
		const channel = ably.channels.get("online");

		channel.publish("request-driver", {
			requestId: "req_" + Date.now(),
			stars,
		});
	}, [stars]);

	// -----------------------------
	// RECEIVE DRIVER ACCEPT
	// -----------------------------
	useEffect(() => {
		const channel = ably.channels.get("online");

		const handleAccept = (msg: Types.Message) => {
			const driver = msg.data as AcceptDeliveryPayload;

			localStorage.setItem("driver", JSON.stringify(driver));
			router.push("/guessDriver");
		};

		channel.subscribe("acceptDelivery", handleAccept);

		return () => {
			channel.unsubscribe("acceptDelivery", handleAccept);
		};
	}, [router]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
			<div className="relative w-44 h-44 flex items-center justify-center">
				<div className="absolute w-full h-full rounded-full border-2 border-green-400 animate-ping" />
				<div className="absolute w-42 h-42 rounded-full border border-gray-200 animate-pulse" />

				<div className="absolute flex items-center justify-center w-full h-full">
					<div
						className={`w-3 h-3 bg-green-400 rounded-full transition-all ${
							pulse === 0 ? "opacity-20 scale-50" : ""
						} ${pulse === 1 ? "opacity-60 scale-75" : ""} ${
							pulse === 2 ? "opacity-100 scale-100" : ""
						}`}
					/>
				</div>

				<div className="relative z-10 flex flex-col items-center">
					<div className="w-10 h-10 rounded-full bg-black" />
					<div className="w-14 h-16 bg-gray-900 rounded-t-3xl mt-1" />
				</div>
			</div>

			<h1 className="mt-10 text-xl font-extrabold">
				Finding {stars}-star driver{dots}
			</h1>
		</div>
	);
}