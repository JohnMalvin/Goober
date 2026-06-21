"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import avatar from "../../public/mockup.jpg";
import { ably } from "@/lib/ably";

export default function ProfilePage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [user] = useState({
    name: "Nina",
    location: "Sydney, NSW",
  });

  const ongoingOrder = {
    status: "Preparing your order",
    eta: "08 days",
    driver: "Not Not Alex",
    plate: "NSW-7395",
    restaurant: "KFC",
  };

  const history = [
    {
      id: 1,
      restaurant: "Hakata Gensuke",
      name: "Tonkotsu Ramen",
      date: "Yesterday",
      price: "$16.90",
    },
    {
      id: 2,
      restaurant: "Chatime",
      name: "Brown Sugar Milk Tea + Pearls",
      date: "2 days ago",
      price: "$7.80",
    },
    {
      id: 3,
      restaurant: "Domino's Pizza",
      name: "Meat Lovers Pizza",
      date: "Last week",
      price: "$21.50",
    },
  ];

  useEffect(() => {
    // Initialize audio object safely on client side
    const audio = new Audio("/ping.mp3");
    audioRef.current = audio;

    // Function to unlock audio on first user click
    const unlockAudio = () => {
      audio.play()
        .then(() => {
          // Audio is unlocked! Pause it immediately so it doesn't blare right away
          audio.pause();
          audio.currentTime = 0;
          // Remove event listeners once unlocked
          window.removeEventListener("click", unlockAudio);
          window.removeEventListener("touchstart", unlockAudio);
        })
        .catch((e) => console.log("Unlocking failed:", e));
    };

    // Listen for the first user interaction
    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);

    // Ably Setup
    const channel = ably.channels.get("geo");

    const handler = (message: any) => {
      console.log("Received changeData:", message.data);
      
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.log("Audio play blocked even after unlock attempt:", err);
        });
      }
      
      setShowPopup(true);
    };

    channel.subscribe("changeData", handler);

    return () => {
      channel.unsubscribe("changeData", handler);
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  const handleRedirect = () => {
    // Stop the audio if it's currently playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Resets the track back to the beginning
    }
    router.push("/geoguesser2");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center px-4 py-12 text-slate-800 relative">
      <div className="w-full max-w-md space-y-8">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="relative w-24 h-24 rounded-full ring-4 ring-emerald-500 ring-offset-2 overflow-hidden shadow-inner">
            <Image
              src={avatar}
              alt="profile"
              fill
              priority
              className="object-cover"
            />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">{user.location}</p>
        </div>

        {/* ONGOING ORDER */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 px-1">
            Ongoing Order
          </h2>

          <div className="bg-white shadow-md rounded-2xl border border-slate-100 p-5 space-y-4">
            {/* Header row */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {ongoingOrder.status}
                </span>
                <h3 className="font-bold text-slate-900 mt-2 text-lg">{ongoingOrder.restaurant}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Estimated Time</p>
                <p className="text-xl font-black text-emerald-600">{ongoingOrder.eta}</p>
              </div>
            </div>

            {/* Courier info row */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">Driver</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{ongoingOrder.driver}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-tight font-mono">License Plate</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5 font-mono">{ongoingOrder.plate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* HISTORY */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 px-1">
            Order History
          </h2>

          <div className="space-y-3">
            {history.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-4 flex justify-between items-center border border-slate-100"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-emerald-600 tracking-wide uppercase">
                    {order.restaurant}
                  </p>
                  <p className="text-sm font-bold text-slate-800">{order.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{order.date}</p>
                </div>

                <p className="text-sm font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg self-center">
                  {order.price}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* POPUP MODAL CONTAINER */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600 text-xl font-bold">
              📍
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">You are Punished</h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you a good boy?
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleRedirect}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md active:scale-[0.98] transition-all text-sm"
              >
                yes daddy
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}