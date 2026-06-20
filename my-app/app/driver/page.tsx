"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ably } from "@/lib/ably";
import { Types } from "ably";

// Import the driver profile image
import AlexImage from "../../public/mockup.jpg";
import NoobMasterImage from "../../public/mockup.jpg";

interface DriverRequest {
    requestId: string;
    stars: number;
}

interface DeliveryConfirmedPayload {
    driverName: string;
    status: string;
}

interface TierConfig {
    experience: string;
    deliveries: string;
    testimonies: string[];
}

const TIER_DATA: Record<number, TierConfig> = {
    5: {
        experience: "3.5 Years",
        deliveries: "2,840+",
        testimonies: [
            "Legendary speed and care!",
            "Handled my items like gold.",
            "Arrived 10 minutes early.",
            "Pristine communication.",
            "10/10 service always."
        ]
    },
    4: {
        experience: "1.5 Years",
        deliveries: "1,120+",
        testimonies: [
            "Very polite courier.",
            "Updates me frequently.",
            "Fast shipping, friendly.",
            "Careful with fragile items.",
            "Highly recommended."
        ]
    },
    3: {
        experience: "8 Months",
        deliveries: "340+",
        testimonies: [
            "Delivered safely.",
            "Timing was standard.",
            "Decent service level.",
            "Everything arrived intact.",
            "Professional drop-off."
        ]
    }
};

export default function DriverDashboard() {
    const router = useRouter();
    const intendedName = "NoobMaster67";

    const [request, setRequest] = useState<DriverRequest | null>(null);
    const [stars, setStars] = useState<number>(5);
    const [name, setName] = useState("alex");
    const [displayName, setDisplayName] = useState("alex");
    const [modalType, setModalType] = useState<"incoming" | "cancelled" | null>(null);

    useEffect(() => {
        // For demo purposes, we set the name directly. In a real app, this would come from a profile setup flow.
        if (stars === 5) {
            setName(intendedName);
            setDisplayName("************");
        } else {
            setDisplayName(name);
        }
    }, [stars]);
    // Create mutable refs to hold volatile state values for real-time handlers
    const nameRef = useRef(name);
    const starsRef = useRef(stars);

    // Keep refs in sync with active component state
    useEffect(() => {
        nameRef.current = name;
    }, [name]);

    useEffect(() => {
        starsRef.current = stars;
    }, [stars]);

    const currentTier = TIER_DATA[stars] || TIER_DATA[5];

    // ----------------------------------------------------------------
    // 1. LISTEN FOR CLIENT USER'S REQUESTS
    // ----------------------------------------------------------------
    useEffect(() => {
        const channel = ably.channels.get("online");
        const handleRequest = (msg: Types.Message) => {
            const data = msg.data as DriverRequest | undefined;
            // Always validate against the fresh ref container value
            if (!data || data.stars !== starsRef.current) return;
            setRequest(data);
            setModalType("incoming");
        };
        channel.subscribe("request-driver", handleRequest);
        return () => {
            channel.unsubscribe("request-driver", handleRequest);
        };
    }, []); // Removed stars dependency to keep subscription stable

    // ----------------------------------------------------------------
    // 2. LISTEN FOR SUCCESSFUL OR FAILED USER WORDLE GUESS
    // ----------------------------------------------------------------
    useEffect(() => {
        const channel = ably.channels.get("online");
        
        const handleDeliveryConfirmed = (msg: Types.Message) => {
            const data = msg.data as DeliveryConfirmedPayload | undefined;
            if (!data) return;
            
            // Extract the current exact runtime configuration from ref
            const currentDriverName = nameRef.current.toLowerCase().trim();
            
            if (data.driverName.toLowerCase().trim() === currentDriverName) {
                if (data.status === "accepted") {
                    router.push("/activeDelivery");
                } else if (data.status === "failed") {
                    setRequest(null);
                    setModalType("cancelled");
                }
            }
        };

        channel.subscribe("deliveryConfirmed", handleDeliveryConfirmed);
        return () => {
            channel.unsubscribe("deliveryConfirmed", handleDeliveryConfirmed);
        };
    }, [router]); // Removed volatile name dependency to avoid resetting subscription mid-session

    // ----------------------------------------------------------------
    // ACTION: ACCEPT MATCHING STEP
    // ----------------------------------------------------------------
    const acceptDelivery = () => {
        if (!request) return;
        ably.channels.get("online").publish("acceptDelivery", {
            requestId: request.requestId,
            driverName: name.toLowerCase().trim(),
        });
        setRequest(null);
        setModalType(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50 relative overflow-hidden">
            
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 20s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 w-full max-w-sm flex flex-col items-center relative overflow-hidden z-10">
                <div className="absolute top-0 left-0 right-0 h-2 bg-green-500" />

                {/* Profile Image Group */}
                <div className="relative mb-4 mt-2">
                    <div className="w-24 h-24 rounded-full p-1 bg-white ring-4 ring-green-500 overflow-hidden flex items-center justify-center">
                        <Image
                            src={name === 'Alex'? AlexImage : NoobMasterImage"}
                            alt="Avatar"
                            width={96}
                            height={96}
                            className="rounded-full object-cover w-full h-full"
                            priority
                        />
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
                </div>

                {/* Borderless Input */}
                <input
                    value={displayName}
                    onChange={(e) => { setName(e.target.value); setDisplayName(e.target.value) }}
                    className="text-2xl font-black text-center text-gray-900 focus:outline-none bg-transparent hover:bg-gray-50 rounded-lg px-3 py-1 border border-transparent focus:border-gray-100 w-full mb-1 transition-all capitalize"
                />

                {/* Stars as Tier Toggles */}
                <div className="flex items-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((idx) => (
                        <button
                            key={idx}
                            onClick={() => { setStars(idx); setRequest(null); setModalType(null); }}
                            className="focus:outline-none transition-transform active:scale-125"
                        >
                            <svg className={`w-6 h-6 ${idx <= stars ? "text-yellow-400 fill-current" : "text-gray-200 fill-current"}`} viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* Stats - Rating Dependent */}
                <div className="grid grid-cols-2 gap-4 w-full bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
                    <div className="text-center border-r border-gray-200">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</p>
                        <p className="text-lg font-black text-gray-800">{currentTier.experience}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deliveries</p>
                        <p className="text-lg font-black text-gray-800">{currentTier.deliveries}</p>
                    </div>
                </div>

                {/* Horizontal Scrolling Testimonies */}
                <div className="w-full relative overflow-hidden mb-8 h-12">
                    <div className="animate-marquee" key={stars}>
                        {[...currentTier.testimonies, ...currentTier.testimonies].map((text, i) => (
                            <div 
                                key={i} 
                                className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl mx-2 flex items-center whitespace-nowrap"
                            >
                                <span className="text-yellow-500 mr-2">★</span>
                                <p className="text-xs font-bold text-gray-600 italic">"{text}"</p>
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />
                </div>

                {/* System Status Footer */}
                <div className="w-full border-t border-dashed border-gray-100 pt-5 flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="flex h-2 w-2 relative">
                            <div className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></div>
                            <div className="relative rounded-full h-2 w-2 bg-green-500"></div>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            SYSTEM STANDBY - WAITING FOR REQUESTS
                        </p>
                    </div>
                </div>
            </div>

            {/* ALERTS / MODALS */}
            {modalType && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
                    {modalType === "incoming" && request && (
                        <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider">Matched Order</div>
                                <button onClick={() => setModalType(null)} className="text-gray-300 hover:text-gray-500 text-xl">×</button>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">Request Incoming</h3>
                            <p className="text-sm text-gray-500 mb-8">A client requires a verified <span className="text-black font-bold">{request.stars}-star</span> handler for a local route.</p>
                            <div className="flex gap-3">
                                <button onClick={() => { setRequest(null); setModalType("cancelled"); }} className="flex-1 bg-gray-50 text-gray-400 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all">Decline</button>
                                <button onClick={acceptDelivery} className="flex-1 bg-black text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all">Accept</button>
                            </div>
                        </div>
                    )}

                    {modalType === "cancelled" && (
                        <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">GG broo</h3>
                            <p className="text-sm text-gray-500 mb-8">Your client did not manage to guess your name</p>
                            <button onClick={() => { setModalType(null); setDisplayName(name) }} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl">Back to Reality</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}