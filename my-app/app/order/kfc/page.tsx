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
import hero from "@/public/kfc.png";
import pc from "@/public/pc.png";
import mockup from "@/public/mockup.jpg";
import bucket from "@/public/bucket.png";
import cs from "@/public/cs.png";
import { useRouter } from "next/navigation";

// ─── RESTAURANT ───────────────────────────────────────────────────────────────

const RESTAURANT = {
  name: "KFC",
  tag: "American · Fast Food · Chicken",
  rating: 4.6,
  reviews: "3.1k",
  time: "15–25 min",
  fee: "$0 delivery fee",
  minOrder: "$8.00",
  heroImage: hero,
};

// ─── MENU DATA ────────────────────────────────────────────────────────────────

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: typeof mockup;
  popular?: boolean;
  calories?: string;
};

const MENU: MenuItem[] = [
  // ── Featured ──────────────────────────────────────────────────────────────
  {
    id: "kr_bucket",
    name: "Original Recipe 8pc Bucket",
    description: "Eight pieces of KFC's Original Recipe chicken — crispy, juicy, and hand-breaded.",
    price: 19.99,
    category: "Featured",
    image: bucket,
    popular: true,
    calories: "2400 cal",
  },
  {
    id: "kc_sand",
    name: "Chicken Sandwich",
    description: "Crispy chicken fillet with pickles and mayo on a toasted brioche bun.",
    price: 6.99,
    category: "Featured",
    image: cs,
    popular: true,
    calories: "560 cal",
  },
  {
    id: "popcorn",
    name: "Popcorn Chicken",
    description: "Bite-sized pieces of seasoned, crispy chicken — perfect for sharing.",
    price: 4.99,
    category: "Featured",
    image: pc,
    calories: "320 cal",
  },

  // ── Chicken ───────────────────────────────────────────────────────────────
  {
    id: "kr_2pc",
    name: "Original Recipe 2pc Meal",
    description: "Two pieces of Original Recipe chicken with a side and a drink.",
    price: 8.49,
    category: "Chicken",
    image: mockup,
    calories: "900 cal",
  },
  {
    id: "kr_3pc",
    name: "Original Recipe 3pc Meal",
    description: "Three pieces of Original Recipe chicken with a side and a drink.",
    price: 10.99,
    category: "Chicken",
    image: mockup,
    popular: true,
    calories: "1250 cal",
  },

  // ── Buckets ───────────────────────────────────────────────────────────────
  {
    id: "family_bucket",
    name: "Family Bucket (12pc)",
    description: "Twelve pieces of Original Recipe chicken — feeds the whole family.",
    price: 29.99,
    category: "Buckets",
    image: mockup,
    calories: "3600 cal",
  },

  // ── Sides ─────────────────────────────────────────────────────────────────
  {
    id: "mashed",
    name: "Mashed Potatoes",
    description: "Creamy mashed potatoes with signature gravy.",
    price: 2.49,
    category: "Sides",
    image: mockup,
    calories: "200 cal",
  },
  {
    id: "coleslaw",
    name: "Coleslaw",
    description: "Creamy coleslaw made with crisp cabbage and carrots.",
    price: 2.29,
    category: "Sides",
    image: mockup,
    calories: "160 cal",
  },

  // ── Drinks ────────────────────────────────────────────────────────────────
  {
    id: "coke",
    name: "Coca-Cola",
    description: "Refreshing Coca-Cola, served chilled.",
    price: 1.99,
    category: "Drinks",
    image: mockup,
    calories: "150 cal",
  },

  // ── Desserts ──────────────────────────────────────────────────────────────
  {
    id: "biscuit",
    name: "Buttermilk Biscuit",
    description: "Flaky, buttery biscuit — a classic KFC side.",
    price: 1.49,
    category: "Desserts",
    image: mockup,
    calories: "260 cal",
  },
];

const CATEGORIES = ["Featured", "Chicken", "Buckets", "Sides", "Drinks", "Desserts"];

// ─── TYPES ────────────────────────────────────────────────────────────────────

type CartItem = MenuItem & { qty: number };
type OrderStage = "menu" | "cart" | "checkout" | "confirmed";

// ─── PAGE COMPONENT ───────────────────────────────────────────────────────────

export default function OrderKfcPage() {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [stage, setStage] = useState<OrderStage>("menu");
  const [activeSection, setActiveSection] = useState("Featured");
  const [note, setNote] = useState("");
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [countdown, setCountdown] = useState<number | null>(null);
    const [orderMessage, setOrderMessage] = useState("");
  
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("stars", "5");
      }
    }, []);

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
            Your KFC order is being prepared. Estimated arrival:{" "}
            <strong>15–25 min</strong>.
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
          <span className="ml-auto text-sm text-gray-400">KFC</span>
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
                    unoptimized
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
                            unoptimized
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
            <span>{"$" + subtotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </main>
  );
}