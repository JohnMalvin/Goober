"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  Clock,
  Search,
  ChevronDown,
  SlidersHorizontal,
  Star,
  Home,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  User,
  Heart,
} from "lucide-react";
import mockup from "../../public/mockup.jpg";
import mcd from "@/public/mcd.png";
import hj from "@/public/hungjack.png";
import kfc from "@/public/kfc.png";
import sub from "../../public/sub.png";
import dom from "../../public/dom.png";
import gyg from "../../public/gyg.png";

const CATEGORIES = [
  { id: "pickup", label: "Pickup", emoji: "🛍️" },
  { id: "grocery", label: "Grocery", emoji: "🛒" },
  { id: "essentials", label: "Essentials", emoji: "🏪" },
  { id: "fruit", label: "Fruit", emoji: "🍎" },
  { id: "drinks", label: "Drinks", emoji: "🧃" },
  { id: "sushi", label: "Sushi", emoji: "🍱" },
];

const RESTAURANTS = [
  {
    id: "mcdonalds",
    slug: "mcd",
    name: "McDonald's",
    tag: "American · Fast Food",
    rating: 4.7,
    time: "10–20 min",
    fee: "$0 delivery fee",
    promo: "2 for $5 Mix & Match",
    img: mcd,
  },
  {
    id: "kfc",
    slug: "kfc",
    name: "KFC",
    tag: "Chicken · American",
    rating: 4.6,
    time: "15–25 min",
    fee: "$0 delivery fee",
    promo: null,
    img: kfc,
  },
  {
    id: "burger-king",
    slug: "burger-king",
    name: "Burger King",
    tag: "Burgers · American",
    rating: 4.5,
    time: "15–25 min",
    fee: "$0 delivery fee",
    promo: null,
    img: hj,
  },
  {
    id: "subway",
    slug: "subway",
    name: "Subway",
    tag: "Sandwiches · Healthy",
    rating: 4.4,
    time: "20–30 min",
    fee: "$1.49 delivery fee",
    promo: "Buy 2 get 1 free",
    img: sub,
  },
  
  {
    id: "dominos",
    slug: "dominos",
    name: "Domino's Pizza",
    tag: "Pizza · Italian",
    rating: 4.3,
    time: "25–35 min",
    fee: "$0 delivery fee",
    promo: "50% off large pizzas",
    img: dom,
  },
  {
    id: "guzman",
    slug: "guzman",
    name: "Guzman y Gomez",
    tag: "Mexican · Burritos",
    rating: 4.8,
    time: "10–20 min",
    fee: "$1.99 delivery fee",
    promo: null,
    img: gyg,
  },
];

// type Tab = "Delivery" | "Pickup" | "Dine-In";

export default function HomePage() {
//   const [activeTab, setActiveTab] = useState<Tab>("Delivery");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <main className="bg-white min-h-screen max-w-md mx-auto relative pb-24 font-sans">
      {/* ── TOP NAV ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 pt-10 pb-3">
        {/* Mode tabs */}
        {/* <div className="flex gap-1 mb-4">
          {(["Delivery", "Pickup", "Dine-In"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div> */}

        {/* Location + time row */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-2 text-sm font-semibold flex-1">
            <MapPin size={14} className="text-black" />
            <span className="truncate">MCIC</span>
            <ChevronDown size={14} className="ml-auto shrink-0" />
          </button>

          <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-2 text-sm font-semibold">
            <Clock size={14} />
            Now
            <ChevronDown size={14} />
          </button>

          <button className="bg-gray-100 rounded-full p-2">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </header>

      {/* ── SEARCH ── */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search restaurants, cuisines..."
            className="bg-transparent text-sm flex-1 outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* ── PROMO BANNER ── */}
      <section className="px-4 mt-5">
        <div className="relative rounded-2xl overflow-hidden bg-[#F5A623] h-40">
          <Image
            src = {mockup}
            alt="Promotion"
            fill
            className="object-cover opacity-30"
          />
          <div className="relative z-10 p-5 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/80">
                Limited offer
              </p>
              <h2 className="text-xl font-extrabold text-white leading-tight mt-1">
                Unlimited $0 delivery fee
                <br />+ 5% off with Eats Pass
              </h2>
              <p className="text-xs text-white/80 mt-1">
                Eat, save, and support restaurants
              </p>
            </div>
            <button className="self-start bg-white text-black text-xs font-bold px-4 py-2 rounded-full">
              Try 1 month free →
            </button>
          </div>

          {/* dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block rounded-full transition-all ${
                  i === 0 ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="mt-6 px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setActiveCategory(activeCategory === cat.id ? null : cat.id)
              }
              className={`flex flex-col items-center gap-1.5 shrink-0 transition-all ${
                activeCategory === cat.id ? "opacity-100" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                  activeCategory === cat.id
                    ? "bg-black"
                    : "bg-gray-100"
                }`}
              >
                {cat.emoji}
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── POPULAR NEAR YOU ── */}
      <section className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold">Popular near you</h2>
          <button className="text-sm font-semibold underline">See all</button>
        </div>

        <div className="flex flex-col gap-5">
          {RESTAURANTS.map((r, key) => (
            <Link key={r.id} href={`/order/${r.slug}`} className="block">
              <article className="group cursor-pointer">
                {/* Image */}
                <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-200">
                  <Image
                    key={key}
                    src={r.img}
                    alt={r.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {r.promo && (
                    <div className="absolute bottom-3 left-3 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full shadow">
                      {r.promo}
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(r.id);
                    }}
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow"
                  >
                    <Heart
                      size={16}
                      className={
                        wishlist.has(r.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="mt-2.5 px-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base">{r.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <Star size={13} className="fill-black text-black" />
                      {r.rating}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-0.5">{r.tag}</p>
                  <p className="text-gray-500 text-sm">
                    {r.time} · {r.fee}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex items-center justify-around px-2 py-3 z-50">
        {[
          { icon: Home, label: "Home", active: true },
          { icon: Search, label: "Search", active: false },
          { icon: ShoppingBag, label: "Grocery", active: false },
          { icon: ClipboardList, label: "Orders", active: false },
          { icon: User, label: "Account", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`flex flex-col items-center gap-1 px-3 ${
              active ? "text-black" : "text-gray-400"
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}