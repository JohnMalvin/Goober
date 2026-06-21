"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Clock,
  Plus,
  Minus,
  X,
  ShoppingBag,
  ChevronRight,
  Check,
} from "lucide-react";
import hero from "../../../public/mcd.png";
import qp from "../../../public/qp.png";
import dc from "../../../public/dc.png";
import bm from "../../../public/bm.png";
import mockup from "../../../public/mockup.jpg";
import { useRouter } from "next/navigation";

// ─── RESTAURANT ───────────────────────────────────────────────────────────────

const RESTAURANT = {
  name: "McDonald's",
  tag: "American · Fast Food · Burgers",
  rating: 4.7,
  reviews: "2.4k",
  time: "10–20 min",
  fee: "$0 delivery fee",
  minOrder: "$10.00",
  heroImage: hero,         // swap with: import heroImg from "./mcd-hero.jpg"
};

// ─── MENU DATA ────────────────────────────────────────────────────────────────

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: typeof mockup;      // swap any image: import bigMacImg from "./big-mac.jpg"
  popular?: boolean;
  calories?: string;
};

const MENU: MenuItem[] = [
  // ── Featured ──────────────────────────────────────────────────────────────
  {
    id: "bm",
    name: "Big Mac",
    description: "Two beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun.",
    price: 7.49,
    category: "Featured",
    image: bm,            // swap → import bigMacImg from "./images/big-mac.jpg"
    popular: true,
    calories: "550 cal",
  },
  {
    id: "qpc",
    name: "Quarter Pounder",
    description: "Fresh beef patty, two slices of cheese, onions, pickles, mustard and ketchup.",
    price: 8.29,
    category: "Featured",
    image: qp,            // swap → import qpcImg from "./images/quarter-pounder.jpg"
    popular: true,
    calories: "530 cal",
  },
  {
    id: "mcdbl",
    name: "Double Cheese Burger",
    description: "Two beef patties, one slice of cheese, pickles, onions, mustard and ketchup.",
    price: 4.49,
    category: "Featured",
    image: dc,            // swap → import mcdblImg from "./images/mcdouble.jpg"
    calories: "400 cal",
  },

  // ── Chicken ───────────────────────────────────────────────────────────────
  {
    id: "mc1",
    name: "McChicken",
    description: "A crispy chicken patty with mayo and shredded lettuce.",
    price: 4.99,
    category: "Chicken",
    image: mockup,            // swap → import mcChickenImg from "./images/mcchicken.jpg"
    calories: "400 cal",
  },
  {
    id: "cs",
    name: "Crispy Chicken Sandwich",
    description: "Crispy chicken fillet with crinkle-cut pickles and butter on a toasted potato roll.",
    price: 6.49,
    category: "Chicken",
    image: mockup,            // swap → import crispyChickenImg from "./images/crispy-chicken.jpg"
    popular: true,
    calories: "470 cal",
  },
  {
    id: "cns6",
    name: "6pc Chicken McNuggets",
    description: "Tender white meat chicken, lightly breaded and seasoned.",
    price: 5.79,
    category: "Chicken",
    image: mockup,            // swap → import nuggets6Img from "./images/nuggets-6.jpg"
    calories: "250 cal",
  },
  {
    id: "cns10",
    name: "10pc Chicken McNuggets",
    description: "Ten pieces of our classic Chicken McNuggets.",
    price: 8.49,
    category: "Chicken",
    image: mockup,            // swap → import nuggets10Img from "./images/nuggets-10.jpg"
    calories: "420 cal",
  },

  // ── Sides ─────────────────────────────────────────────────────────────────
  {
    id: "frl",
    name: "Large Fries",
    description: "World famous golden fries, crispy on the outside, fluffy on the inside.",
    price: 4.19,
    category: "Sides",
    image: mockup,            // swap → import largeFriesImg from "./images/fries-large.jpg"
    popular: true,
    calories: "490 cal",
  },
  {
    id: "frm",
    name: "Medium Fries",
    description: "The classic McDonald's fries, medium size.",
    price: 3.39,
    category: "Sides",
    image: mockup,            // swap → import medFriesImg from "./images/fries-medium.jpg"
    calories: "320 cal",
  },
  {
    id: "as",
    name: "Apple Slices",
    description: "Cool, crisp apple slices — a refreshing side.",
    price: 1.49,
    category: "Sides",
    image: mockup,            // swap → import appleImg from "./images/apple-slices.jpg"
    calories: "15 cal",
  },

  // ── Drinks ────────────────────────────────────────────────────────────────
  {
    id: "coke",
    name: "Coca-Cola Large",
    description: "Ice cold Coca-Cola, large.",
    price: 2.99,
    category: "Drinks",
    image: mockup,            // swap → import cokeImg from "./images/coke.jpg"
    calories: "290 cal",
  },
  {
    id: "mcf",
    name: "McCafé Latte",
    description: "Espresso with steamed milk, your choice of size.",
    price: 3.79,
    category: "Drinks",
    image: mockup,            // swap → import latteImg from "./images/latte.jpg"
    calories: "180 cal",
  },
  {
    id: "shake",
    name: "Chocolate Shake",
    description: "A thick, creamy chocolate milkshake.",
    price: 4.49,
    category: "Drinks",
    image: mockup,            // swap → import shakeImg from "./images/shake.jpg"
    calories: "530 cal",
  },

  // ── Desserts ──────────────────────────────────────────────────────────────
  {
    id: "mc_flurry",
    name: "McFlurry Oreo",
    description: "Creamy vanilla soft serve swirled with Oreo cookie pieces.",
    price: 4.19,
    category: "Desserts",
    image: mockup,            // swap → import mcflurryImg from "./images/mcflurry.jpg"
    popular: true,
    calories: "510 cal",
  },
  {
    id: "cone",
    name: "Vanilla Soft Serve Cone",
    description: "Classic vanilla soft serve in a crispy cone.",
    price: 1.29,
    category: "Desserts",
    image: mockup,            // swap → import coneImg from "./images/cone.jpg"
    calories: "200 cal",
  },
];

const CATEGORIES = ["Featured", "Chicken", "Sides", "Drinks", "Desserts"];

// ─── TYPES ────────────────────────────────────────────────────────────────────

type CartItem = MenuItem & { qty: number };
type OrderStage = "menu" | "cart" | "checkout" | "confirmed";

// ─── PAGE COMPONENT ───────────────────────────────────────────────────────────

export default function OrderMcdPage() {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [stage, setStage] = useState<OrderStage>("menu");
  const [activeSection, setActiveSection] = useState("Featured");
  const [note, setNote] = useState("");
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [countdown, setCountdown] = useState<number | null>(null);
    const [orderMessage, setOrderMessage] = useState("");
  
    const [loading, setLoading] = useState(false);
    localStorage.setItem("stars", "5");

    const router = useRouter();

    useEffect(() => {
        if (countdown === null) return;
        if (countdown === 0) {
            router.push("/findDriver");
            return;
        }
    }, [countdown, router]);

    const startOrderCountdown = (
        onComplete: () => void
        ) => {
        let count = 3;

        setOrderMessage(`Processing Order in... ${count}`);

        const interval = setInterval(() => {
            count--;

            if (count > 0) {
            setOrderMessage(`Processing Order in... ${count}`);
            } else {
            clearInterval(interval);
            onComplete();
            }
        }, 1000);

        return () => clearInterval(interval);
    };
    
    const handleOrder = () => {
    setLoading(true);
    setCountdown(3);

    let count = 3;

    const interval = setInterval(() => {
      count--;

      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        router.push("/findDriver");
      }
    }, 1000);
  };
  // ── cart helpers ────────────────────────────────────────────────────────────
  const addToCart = (item: MenuItem) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: prev[item.id]
        ? { ...prev[item.id], qty: prev[item.id].qty + 1 }
        : { ...item, qty: 1 },
    }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id].qty === 1) delete next[id];
      else next[id] = { ...next[id], qty: next[id].qty - 1 };
      return next;
    });
  };

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  // ── scroll-spy ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== "menu") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            setActiveSection(e.target.getAttribute("data-section") ?? "");
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [stage]);

  const scrollToSection = (cat: string) =>
    sectionRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" });

  // ─── CONFIRMED ──────────────────────────────────────────────────────────────
  if (stage === "confirmed") {
    return (
      <main className="bg-white min-h-screen max-w-md mx-auto flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-24 h-24 bg-[#06C167] rounded-full flex items-center justify-center">
          <Check size={44} strokeWidth={3} className="text-white" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold">Order placed!</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Your McDonald's order is being prepared. Estimated arrival:{" "}
            <strong>15–20 min</strong>.
          </p>
        </div>

        <div className="w-full bg-gray-50 rounded-2xl p-5 text-left space-y-2">
          {cartItems.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span>{i.qty}× {i.name}</span>
              <span className="font-semibold">${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-extrabold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Link
                href="/"
          className="w-full bg-gray-600 text-white font-bold py-4 rounded-2xl text-center block"
            >
          {orderMessage || `Processing your order... ${countdown !== null ? countdown : ""}`}
            </Link>
        

        <p className="text-gray-500 mt-4">
          Get ready for an eternity waits.
        </p>
      </main>
    );
  }

  // ─── CHECKOUT ───────────────────────────────────────────────────────────────
  if (stage === "checkout") {
    return (
      <main className="bg-white min-h-screen max-w-md mx-auto pb-32">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 pt-10 pb-4 flex items-center gap-3">
          <button
            onClick={() => setStage("cart")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-extrabold text-lg">Checkout</h1>
        </header>

        <div className="px-4 mt-5 space-y-4">
          {/* delivery address */}
          <section className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
              Deliver to
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">123 Main Street</p>
                <p className="text-gray-500 text-sm">New York, NY 10001</p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </section>

          {/* order summary */}
          <section className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
              Your order
            </p>
            <div className="space-y-2">
              {cartItems.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{i.qty}× {i.name}</span>
                  <span className="font-semibold">${(i.price * i.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* note */}
          <section className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
              Note for restaurant
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any special requests? (optional)"
              rows={3}
              className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-gray-400"
            />
          </section>

          {/* payment */}
          <section className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
              Payment
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-black rounded text-white text-[9px] font-bold flex items-center justify-center">
                  VISA
                </div>
                <span className="text-sm font-semibold">•••• 4242</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </section>

          {/* price breakdown */}
          <section className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery fee</span>
              <span className="text-[#06C167] font-semibold">Free</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Service fee (5%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-extrabold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </section>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-4">
          <button
                    onClick={() => {
                        setStage("confirmed");
                        handleOrder();
                    }}
            className="w-full bg-black text-white font-extrabold py-4 rounded-2xl text-base flex items-center justify-between px-6"
          >
            <span>Place order</span>
            <span>${total.toFixed(2)}</span>
          </button>
        </div>
      </main>
    );
  }

  // ─── CART ───────────────────────────────────────────────────────────────────
  if (stage === "cart") {
    return (
      <main className="bg-white min-h-screen max-w-md mx-auto pb-36">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 pt-10 pb-4 flex items-center gap-3">
          <button
            onClick={() => setStage("menu")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-extrabold text-lg">Your cart</h1>
          <span className="ml-auto text-sm text-gray-400">McDonald's</span>
        </header>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 pt-32 px-6 text-center">
            <ShoppingBag size={48} className="text-gray-200" />
            <p className="font-bold text-lg">Your cart is empty</p>
            <p className="text-gray-400 text-sm">
              Add items from the menu to get started.
            </p>
            <button
              onClick={() => setStage("menu")}
              className="bg-black text-white px-6 py-3 rounded-full font-semibold text-sm"
            >
              Browse menu
            </button>
          </div>
        ) : (
          <div className="px-4 mt-5 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4"
              >
                {/* thumbnail — uses item's own image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{item.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center"
                  >
                    {item.qty === 1 ? <X size={14} /> : <Minus size={14} />}
                  </button>
                  <span className="w-5 text-center font-bold text-sm">{item.qty}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 bg-black rounded-full flex items-center justify-center"
                  >
                    <Plus size={14} className="text-white" />
                  </button>
                </div>
              </div>
            ))}

            {/* price breakdown */}
            <div className="bg-gray-50 rounded-2xl p-4 mt-2 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery fee</span>
                <span className="text-[#06C167] font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Service fee (5%)</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-extrabold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-4">
            <button
              onClick={() => setStage("checkout")}
              className="w-full bg-black text-white font-extrabold py-4 rounded-2xl text-base flex items-center justify-between px-6"
            >
              <span>Go to checkout</span>
              <span>${total.toFixed(2)}</span>
            </button>
          </div>
        )}
      </main>
    );
  }

  // ─── MENU (default) ─────────────────────────────────────────────────────────
  return (
    <main className="bg-white min-h-screen max-w-md mx-auto pb-32">

      {/* Hero — loading="eager" fixes LCP warning */}
      <div className="relative h-56">
        <Image
          src={RESTAURANT.heroImage}
          alt={RESTAURANT.name}
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
          loading="eager"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        <Link
          href="/"
          className="absolute top-12 left-4 bg-white rounded-full p-2 shadow"
        >
          <ArrowLeft size={20} />
        </Link>

        {cartCount > 0 && (
          <button
            onClick={() => setStage("cart")}
            className="absolute top-12 right-4 bg-white rounded-full p-2 shadow"
          >
            <div className="relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Restaurant info */}
      <div className="px-4 pt-5 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-extrabold">{RESTAURANT.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{RESTAURANT.tag}</p>

        <div className="flex items-center gap-3 mt-3 text-sm">
          <span className="flex items-center gap-1 font-semibold">
            <Star size={13} className="fill-black" />
            {RESTAURANT.rating}
          </span>
          <span className="text-gray-400">({RESTAURANT.reviews} reviews)</span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-1 text-gray-500">
            <Clock size={13} />
            {RESTAURANT.time}
          </span>
        </div>

        <div className="flex gap-2 mt-3">
          <span className="bg-[#EBF9F2] text-[#06C167] text-xs font-bold px-3 py-1 rounded-full">
            {RESTAURANT.fee}
          </span>
          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
            Min. {RESTAURANT.minOrder}
          </span>
        </div>
      </div>

      {/* Sticky category tabs */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="flex">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToSection(cat)}
              className={`shrink-0 px-4 py-3.5 text-sm font-bold border-b-2 transition-colors ${
                activeSection === cat
                  ? "border-black text-black"
                  : "border-transparent text-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu sections */}
      <div className="px-4">
        {CATEGORIES.map((cat) => {
          const items = MENU.filter((m) => m.category === cat);
          return (
            <div
              key={cat}
              data-section={cat}
              ref={(el) => { sectionRefs.current[cat] = el; }}
              className="pt-6 pb-2"
            >
              <h2 className="text-lg font-extrabold mb-4">{cat}</h2>

              <div className="space-y-3">
                {items.map((item) => {
                  const qty = cart[item.id]?.qty ?? 0;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 py-3 border-b border-gray-50 last:border-0"
                    >
                      {/* text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{item.name}</p>
                          {item.popular && (
                            <span className="bg-[#FFF3CD] text-[#856404] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-extrabold text-sm">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.calories && (
                            <span className="text-gray-400 text-xs">
                              {item.calories}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* item image + add button — each item uses item.image */}
                      <div className="relative shrink-0">
                        <div className="relative w-24 h-20 rounded-xl overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>

                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(item)}
                            className="absolute -bottom-2 -right-2 bg-black rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                          >
                            <Plus size={16} className="text-white" />
                          </button>
                        ) : (
                          <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-black rounded-full px-2 py-1 shadow-md">
                            <button onClick={() => removeFromCart(item.id)}>
                              <Minus size={12} className="text-white" />
                            </button>
                            <span className="text-white text-xs font-bold w-4 text-center">
                              {qty}
                            </span>
                            <button onClick={() => addToCart(item)}>
                              <Plus size={12} className="text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-6 pt-2 bg-gradient-to-t from-white via-white to-transparent">
          <button
            onClick={() => setStage("cart")}
            className="w-full bg-black text-white font-extrabold py-4 rounded-2xl flex items-center justify-between px-5 shadow-xl"
          >
            <span className="bg-white/20 rounded-lg px-2 py-0.5 text-sm">
              {cartCount}
            </span>
            <span>View cart</span>
            <span>${subtotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </main>
  );
}