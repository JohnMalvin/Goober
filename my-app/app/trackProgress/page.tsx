"use client";

import { ably } from "@/lib/ably";
import { useEffect, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const origin = "26.5351,-80.0742";       // McDonald's Boynton Beach
const destination = "26.7554,-80.0642";  // 1234 Ocean Dr, Boynton Beach

const MOCK_DRIVER = {
  name: "Alex",
  plate: "BQ22WN",
  vehicle: "Toyota RAV4",
  rating: 93,
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function UberTracker() {
  // null = not yet mounted; avoids SSR/client mismatch on time-dependent values
  const [mounted, setMounted] = useState(false);
  const [etaText, setEtaText] = useState<string | null>(null);
  const [distText, setDistText] = useState<string | null>(null);
  const [arrivalTime, setArrivalTime] = useState<string | null>(null);
  const [showNotif, setShowNotif] = useState(false); // false on server, true after mount

  // Build the embed iframe URL (Directions mode, driving)
  // Only constructed client-side (inside useEffect) so SSR never writes it
  const [mapSrc, setMapSrc] = useState("");
  const WRONG_CLIENT = "-34.4278,150.8931"; // Redfern
  const WRONG_DRIVER = "-33.9167,151.2417"; // Randwick

  const CLIENT = "-33.9171,151.2313"; // MCIC (UNSW)
  const DRIVER = "-33.8790,151.2065"; // Haymarket

  const [origin, setorigin] = useState(DRIVER);       // McDonald's Boynton Beach
  const [destination, setdestination] = useState(CLIENT);


  // lidsten change data
  useEffect(() => {
    const channel = ably.channels.get("my-channel");

    const handler = (message: any) => {
      console.log("Received changeData:", message.data);
      setorigin(WRONG_DRIVER);
      const newLoc = `${message?.data.guessLat},${message?.data.guessLng}`
      // alert(newLoc);
      setorigin(newLoc);
    };

    channel.subscribe("changeData", handler);

    return () => {
      channel.unsubscribe("changeData", handler);
    };
  }, []);

  // send change data
  async function sendChangeData() {
    const channel = ably.channels.get("my-channel");

    await channel.publish("changeData", {
      id: 123,
      status: "updated",
      timestamp: Date.now(),
    });

    console.log("changeData sent");
  }

  // send change data
  async function sendGeoguesser() {
    const channel = ably.channels.get("geo");

    await channel.publish("changeData", {
      id: 123,
      status: "updated",
      timestamp: Date.now(),
    });

    console.log("changeData sent");
  }

  function change() {
    setorigin(WRONG_DRIVER);
  }

  useEffect(() => {
    // Mark as mounted — now safe to render any client-only content
    setMounted(true);
    setShowNotif(true);

    // Build map src client-side only
    if (GOOGLE_API_KEY) {
      setMapSrc(
        `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_API_KEY}&origin=${origin}&destination=${destination}&mode=driving`
      );
    }

    // Fetch ETA via /api/eta (server-side route keeps key hidden)
    async function fetchETA() {
      try {
        const url = `/api/eta?origin=${origin}&destination=${destination}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "OK") {
          const leg = data.routes[0].legs[0];
          setEtaText(leg.duration.text);
          setDistText(leg.distance.text);

          const mins = Math.round(leg.duration.value / 60);
          const arrival = new Date();
          arrival.setMinutes(arrival.getMinutes() + mins);
          // Use en-US locale explicitly so server + client agree if locale ever matters
          setArrivalTime(
            arrival.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
          );
        } else {
          // Fallback when no API key or request fails
          setEtaText("~8 min");
          setDistText("1.4 km");
          const t = new Date();
          t.setMinutes(t.getMinutes() + 8);
          setArrivalTime(t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
        }
      } catch {
        setEtaText("~8 min");
        setDistText("1.4 km");
        const t = new Date();
        t.setMinutes(t.getMinutes() + 8);
        setArrivalTime(t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
      }
    }

    fetchETA();
  }, [origin, destination]);

  return (
    <div className="mx-auto max-w-[390px] min-h-[780px] bg-white font-sans overflow-hidden shadow-xl border border-gray-100">



      {/* Heading */}
      <div className="px-5 pb-4 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">Heading your way...</h1>
        <p className="text-sm text-gray-600 mt-1">
          Estimated arrival{" "}
          <strong className="text-black">
            {arrivalTime ?? <span className="text-gray-400">–</span>}
          </strong>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1.5 px-5 py-3 bg-white">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-1 flex-1 bg-emerald-500 rounded-sm" />
        ))}
        <div className="h-1 flex-1 bg-gray-100 rounded-sm" />
      </div>

      {/* Status Banner */}
      <div className="bg-white px-5 py-3 border-t border-b border-gray-100">
        <p className="text-sm text-gray-900">
          <strong>{MOCK_DRIVER.name}</strong> has your order. You'll get an alert when it's at your door.
        </p>
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          Latest arrival by 4:20 PM
          <span className="w-4 h-4 rounded-full border border-gray-300 inline-flex items-center justify-center text-[10px]">i</span>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[280px] w-full overflow-hidden bg-gray-50">

        {/* ETA badge overlaid on map */}
        {/* <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">🚗 driving</p>
          <p className="text-base font-bold text-gray-900">{etaText ?? "–"}</p>
          {distText && <p className="text-xs text-gray-500">{distText}</p>}
        </div> */}

        {/* Notification banner — client-only to avoid hydration mismatch */}
        {/* {mounted && showNotif && (
          <div className="absolute top-3 right-3 w-48 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 flex items-start gap-2 shadow-md z-10 border border-gray-100">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-sm shrink-0">📱</div>
            <p className="text-[11px] text-gray-800 leading-normal flex-1">Keep phone nearby for {MOCK_DRIVER.name}.</p>
            <button className="text-gray-400 text-base leading-none" onClick={() => setShowNotif(false)}>✕</button>
          </div>
        )} */}

        {/* Google Maps Embed — only rendered client-side so src is never SSR'd */}
        {mounted && mapSrc ? (
          <iframe
            src={mapSrc}
            className="w-full h-full border-0 scale-100 origin-bottom-right"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Delivery route map"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
            {mounted ? "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local" : ""}
          </div>
        )}

        <button className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-600 z-10 font-bold">◎</button>
      </div>

      {/* Driver Card */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3.5">
        <div className="relative">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-orange-200 border-2 border-white shadow-sm">
            <svg width="56" height="56" viewBox="0 0 54 54">
              <rect width="54" height="54" fill="#c8a882" />
              <ellipse cx="27" cy="22" rx="10" ry="11" fill="#a07050" />
              <ellipse cx="27" cy="50" rx="18" ry="14" fill="#8a5a30" />
            </svg>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white px-1.5 py-0.5 rounded-full text-[10px] font-bold text-gray-900 shadow-sm whitespace-nowrap">
            {MOCK_DRIVER.rating}% 👍
          </div>
        </div>

        <div className="flex-1">
          <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <span className="text-emerald-600">{MOCK_DRIVER.name}</span>
            <span className="text-gray-300">•</span>
            <span>{MOCK_DRIVER.plate}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{MOCK_DRIVER.vehicle}</p>
        </div>

        <svg width="54" height="34" viewBox="0 0 54 34">
          <rect x="5" y="12" width="44" height="16" rx="4" fill="#555" />
          <path d="M12 12 L16 4 L38 4 L42 12 Z" fill="#444" />
          <circle cx="14" cy="28" r="5" fill="#222" />
          <circle cx="40" cy="28" r="5" fill="#222" />
        </svg>
      </div>

      {/* Action Row */}
      <div className="flex gap-2.5 px-5 py-4 border-b-[8px] border-gray-50">
        <button className="w-11 h-11 shrink-0 rounded-full border border-gray-200 flex items-center justify-center bg-white">📞</button>
        <button onClick={sendGeoguesser} className="h-11 flex-1 rounded-full border border-gray-200 font-medium text-sm text-gray-900 bg-white">💬 Send a message</button>
        <button className="h-11 px-5 rounded-full border border-gray-200 font-medium text-sm text-gray-900 bg-white">⊕ Tip</button>
      </div>

      {/* Delivery Details */}
      <div className="px-5 py-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Delivery details</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Pickup</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">McDonald's — Boynton Beach</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-900 mt-1 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Dropoff</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">1234 Ocean Dr, Boynton Beach</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}