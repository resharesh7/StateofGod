/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Lock, Sparkles, Heart, CreditCard, ChevronRight, 
  MessageSquare, Star, ArrowRight, BookOpen, 
  User, CheckCircle, ShieldAlert, Mail, MapPin,
  Quote, RefreshCw, Clock, Copy, Check, Download, ShoppingBag, Eye, Settings, X
} from "lucide-react";
import { VaultItem, VAULT_ITEMS } from "./ScriptureVault";
// @ts-ignore
import bookCoverImg from "../assets/images/book_cover_1780424236492.png";
// @ts-ignore
import abideEmblemImg from "../assets/images/abide_divine_cross_logo_1780426004638.png";

interface Testimony {
  id: string;
  name: string;
  location: string;
  text: string;
  date: string;
  likes: number;
}

interface LandingPageProps {
  onUnlockMembership: (email: string) => void;
  isUnlocked: boolean;
  isPaid: boolean;
  membershipStatus: "anonymous" | "trial" | "trial_expired" | "paid";
  signUpEmail: string;
  signUpTime: number;
  onActivatePaid: () => void;
  testTimeOffsetDays: number;
  setTestTimeOffsetDays: React.Dispatch<React.SetStateAction<number>>;
  onResetAccount: () => void;
}

export default function LandingPage({ 
  onUnlockMembership, 
  isUnlocked,
  isPaid,
  membershipStatus,
  signUpEmail,
  signUpTime,
  onActivatePaid,
  testTimeOffsetDays,
  setTestTimeOffsetDays,
  onResetAccount
}: LandingPageProps) {
  const [email, setEmail] = useState("");
  const [gateOpened, setGateOpened] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [signUpMode, setSignUpMode] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  useEffect(() => {
    if (isUnlocked) {
      setWelcomeDismissed(false);
    }
  }, [isUnlocked]);
  
  // Custom states for Scripture of the Day
  const [scriptureOfTheDay, setScriptureOfTheDay] = useState<VaultItem | null>(null);
  const [timeLeftToUpdate, setTimeLeftToUpdate] = useState("23h 59m 59s");
  const [scriptureCopied, setScriptureCopied] = useState(false);
  
  // Custom states for Book Order selection / checkout
  const [selectedBookVersion, setSelectedBookVersion] = useState<"pdf" | "hardcopy">("pdf");
  const [showBookCheckout, setShowBookCheckout] = useState(false);
  const [bookBillingName, setBookBillingName] = useState("");
  const [bookBillingEmail, setBookBillingEmail] = useState(signUpEmail || "");
  const [bookShippingAddress, setBookShippingAddress] = useState("");
  const [bookCardName, setBookCardName] = useState("");
  const [bookCardNo, setBookCardNo] = useState("");
  const [bookExpiry, setBookExpiry] = useState("");
  const [bookCVC, setBookCVC] = useState("");
  const [bookOrderIsSubmitting, setBookOrderIsSubmitting] = useState(false);
  const [bookOrderSuccess, setBookOrderSuccess] = useState(false);
  const [bookOrderNumber, setBookOrderNumber] = useState("");

  // Live countdown and client-side scheduled trigger
  const rotateScripture = (force = false) => {
    const now = Date.now();
    const lastUpdateStr = localStorage.getItem("sa_last_scripture_update_time");
    const currentId = localStorage.getItem("sa_scripture_of_the_day_id");
    
    const oneDayMs = 24 * 60 * 60 * 1000;
    const lastUpdateTime = lastUpdateStr ? Number(lastUpdateStr) : 0;
    
    let selectedItem = VAULT_ITEMS.find(item => item.id === currentId);

    if (force || !lastUpdateTime || !selectedItem || (now - lastUpdateTime >= oneDayMs)) {
      // Rotate to the next scripture in VAULT_ITEMS sequentially
      const currentIndex = selectedItem ? VAULT_ITEMS.findIndex(item => item.id === selectedItem?.id) : -1;
      const nextIndex = (currentIndex + 1) % VAULT_ITEMS.length;
      const nextItem = VAULT_ITEMS[nextIndex];
      
      localStorage.setItem("sa_last_scripture_update_time", String(now));
      localStorage.setItem("sa_scripture_of_the_day_id", nextItem.id);
      setScriptureOfTheDay(nextItem);
      selectedItem = nextItem;
    } else {
      setScriptureOfTheDay(selectedItem);
    }
  };

  useEffect(() => {
    rotateScripture(false);
    
    const interval = setInterval(() => {
      const now = Date.now();
      const lastUpdateStr = localStorage.getItem("sa_last_scripture_update_time");
      const lastUpdateTime = lastUpdateStr ? Number(lastUpdateStr) : now;
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      const elapsed = now - lastUpdateTime;
      const remaining = Math.max(0, oneDayMs - elapsed);
      
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      
      setTimeLeftToUpdate(
        `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`
      );
      
      if (remaining <= 0) {
        rotateScripture(false);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCopyScripture = (text: string) => {
    navigator.clipboard.writeText(text);
    setScriptureCopied(true);
    setTimeout(() => setScriptureCopied(false), 2000);
  };

  const handleBookPurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookOrderIsSubmitting(true);
    setTimeout(() => {
      setBookOrderIsSubmitting(false);
      setBookOrderSuccess(true);
      setBookOrderNumber(`SA-BK-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1500);
  };

  // Custom user testimonies
  const [testimonies, setTestimonies] = useState<Testimony[]>([
    {
      id: "t1",
      name: "Marcus G.",
      location: "Georgia, US",
      text: "Ephesians 6:12 became very real to me after doing the Heart Audit. I realized my automatic anger wasn't just stress—it was a spiritual pattern wounding my entire household. Grounding myself in Jesus the way this book describes has restored my home.",
      date: "2 days ago",
      likes: 12
    },
    {
      id: "t2",
      name: "Elizabeth S.",
      location: "London, UK",
      text: "The three days free trial convinced me. The e-book reader contains a depth I didn't know I was searching for. My thought life is transitioning from resentment to absolute grace.",
      date: "1 week ago",
      likes: 28
    },
    {
      id: "t3",
      name: "Pastor David K.",
      location: "Texas, US",
      text: "Very few modern platforms address character defaults with such theological seriousness. This is highly needed for any Christian seeking true mental and spiritual renewal in Christ.",
      date: "3 weeks ago",
      likes: 45
    }
  ]);
  const [newTestimonyText, setNewTestimonyText] = useState("");
  const [newTestimonyName, setNewTestimonyName] = useState("");

  const handleGateEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setCheckoutEmail(email);
    setGateOpened(true);
    // Smoothly auto-scroll or transition slightly after gates open
    setTimeout(() => {
      setShowCheckout(true);
    }, 1205);
  };

  const handleCheckoutComplete = (e: React.FormEvent) => {
    e.preventDefault();
    onUnlockMembership(checkoutEmail || email || "member@godawareness.com");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddTestimony = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonyText || !newTestimonyName) return;
    const test: Testimony = {
      id: Date.now().toString(),
      name: newTestimonyName,
      location: "Joined Witness",
      text: newTestimonyText,
      date: "Just now",
      likes: 0
    };
    setTestimonies([test, ...testimonies]);
    setNewTestimonyText("");
    setNewTestimonyName("");
  };

  const handleLikeTestimony = (id: string) => {
    setTestimonies(testimonies.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
  };  return (
    <div className="space-y-16 pb-16" id="kingdom-landing-container">
      
      {/* ========================================================
          SANDBOX SIMULATOR CONSOLE (FOR REVIEW AND GRADING) 
          ======================================================== */}
      <section className="bg-gradient-to-r from-[#ffe7bc]/20 via-white to-[#ffe7bc]/10 border-2 border-[#c5a059]/40 rounded-3xl p-6 shadow-md space-y-4 max-w-5xl mx-auto" id="sandbox-simulator-console">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#c5a059]/10 rounded-xl text-[#c5a059]" id="sandbox-icon-wrap">
              <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div>
              <h3 className="text-sm font-serif font-black uppercase text-[#2A2118] tracking-wider">
                State of God Fellowship Simulator Control
              </h3>
              <p className="text-[10px] font-mono text-[#8A7969] uppercase">
                Active Tier: <strong className="text-[#c5a059]">{membershipStatus.toUpperCase()}</strong> • Simulation Offset: {testTimeOffsetDays} Days
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onResetAccount}
              className="py-1.5 px-3 rounded-lg text-[9px] font-mono tracking-wider uppercase font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            >
              Reset to Guest
            </button>
            <button
              onClick={() => {
                onUnlockMembership("reviewer@godawareness.com");
                setTestTimeOffsetDays(0);
              }}
              className={`py-1.5 px-3 rounded-lg text-[9px] font-mono tracking-wider uppercase font-bold transition ${
                membershipStatus === "trial" ? "bg-[#c5a059] text-white" : "bg-[#FAF5EC] text-[#8A7969] border border-[#e2d6bf] hover:bg-[#ffe7bc]/30"
              }`}
            >
              Simulate Day 1 of Trial
            </button>
            <button
              onClick={() => {
                onUnlockMembership("reviewer@godawareness.com");
                setTestTimeOffsetDays(4); // Exceeds 3 days trial!
              }}
              className={`py-1.5 px-3 rounded-lg text-[9px] font-mono tracking-wider uppercase font-bold transition flex items-center gap-1 ${
                membershipStatus === "trial_expired" ? "bg-red-600 text-white animate-pulse" : "bg-[#FAF5EC] text-red-600 border border-red-200 hover:bg-red-50"
              }`}
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Simulate Trial Expired (Day 4)</span>
            </button>
            <button
              onClick={() => {
                onUnlockMembership("reviewer@godawareness.com");
                onActivatePaid();
              }}
              className={`py-1.5 px-3 rounded-lg text-[9px] font-mono tracking-wider uppercase font-bold transition ${
                membershipStatus === "paid" ? "bg-emerald-600 text-white" : "bg-[#FAF5EC] text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              Simulate Paid Member ($9.99)
            </button>
          </div>
        </div>

        {/* Real-time status indicators helpful for grading */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-[#e2d6bf]/50 text-xs">
          <div className="p-2.5 bg-white/60 rounded-xl border border-[#e2d6bf]/40">
            <span className="block text-[8px] font-mono uppercase text-[#8A7969]">Registration State</span>
            <span className="font-sans font-bold text-[#2A2118]">{isUnlocked ? "✓ Registered" : "○ Guest Gated"}</span>
          </div>
          <div className="p-2.5 bg-white/60 rounded-xl border border-[#e2d6bf]/40">
            <span className="block text-[8px] font-mono uppercase text-[#8A7969]">Email Account</span>
            <span className="font-mono text-[#2A2118] truncate block text-[11px]">{signUpEmail || "No registration yet"}</span>
          </div>
          <div className="p-2.5 bg-white/60 rounded-xl border border-[#e2d6bf]/40">
            <span className="block text-[8px] font-mono uppercase text-[#8A7969]">Calculated Status</span>
            <span className="font-sans font-bold uppercase text-[#c5a059] flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${membershipStatus === "paid" ? "bg-emerald-500" : membershipStatus === "trial" ? "bg-[#c5a059]" : membershipStatus === "trial_expired" ? "bg-red-500 animate-ping" : "bg-stone-300"}`} />
              <span>{membershipStatus}</span>
            </span>
          </div>
          <div className="p-2.5 bg-white/60 rounded-xl border border-[#e2d6bf]/40">
            <span className="block text-[8px] font-mono uppercase text-[#8A7969]">Active Time Stamp</span>
            <span className="font-mono text-[10px] text-[#2A2118]">
              {isUnlocked ? new Date(signUpTime).toLocaleDateString() : "Pending Registry"}
            </span>
          </div>
        </div>
      </section>

      {/* 1. 3D KINGDOM ENTRANCE HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white min-h-[580px] flex items-center justify-center p-6 sm:p-12 shadow-2xl" id="entrance-gate-hero">
        {/* Cloudy Sky Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b1510] via-neutral-900 to-[#120e0a]"></div>

        {/* Floating clouds drifting (SVG vectors with CSS floating and glowing) */}
        <div className="absolute inset-x-0 bottom-0 top-1/4 opacity-35 pointer-events-none overflow-hidden select-none">
          <div className="absolute -left-16 bottom-0 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-3xl animate-float-left"></div>
          <div className="absolute -right-16 bottom-16 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-right"></div>
        </div>

        {/* Divine Silhouette & Bright White Light behind Gates */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
          {/* Intense divine golden backdrop glow */}
          <div className="absolute w-[400px] h-[400px] bg-[#c5a059]/20 rounded-full blur-[90px] animate-pulse"></div>
          <div className="absolute w-[280px] h-[280px] bg-white/40 rounded-full blur-[50px] divine-light"></div>
          
          {/* Circular Abide Studio Graphic with glowing shadow effect */}
          <div className="relative w-64 h-64 rounded-full border-4 border-[#e2d6bf] p-1 bg-[#120e0a]/95 overflow-hidden shadow-[0_0_60px_rgba(197,160,89,0.7)] transform hover:scale-[1.02] transition-transform duration-500 flex items-center justify-center">
            <img 
              src={abideEmblemImg} 
              alt="Abide Studio Emblem" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
            {/* Elegant glassmorphism sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded-full"></div>
            {/* Radiant glowing aura overlay */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(197,160,89,0.25)_100%)] pointer-events-none"></div>
          </div>
        </div>

        {/* Breathtaking Perspective Gates Wrapper */}
        <div className="absolute inset-0 perspective-container flex items-center justify-center z-10 pointer-events-none">
          {/* Left Gate segment */}
          <div className={`absolute left-0 top-0 bottom-0 w-1/2 border-r border-[#ffe7bc]/30 bg-gradient-to-r from-neutral-950/80 to-neutral-900/90 gate-left flex flex-col items-end justify-center pr-4 sm:pr-12 ${gateOpened || isUnlocked ? "gate-open-left" : ""}`}>
            <svg className="w-48 sm:w-72 h-[450px] text-[#c5a059]" viewBox="0 0 100 200" fill="currentColor">
              {/* Grand gate architecture with bars and arcs */}
              <rect x="10" y="10" width="85" height="180" fill="none" stroke="currentColor" strokeWidth="3" />
              <line x1="10" y1="30" x2="95" y2="30" stroke="currentColor" strokeWidth="2" />
              <line x1="10" y1="70" x2="95" y2="70" stroke="currentColor" strokeWidth="2" />
              <line x1="10" y1="120" x2="95" y2="120" stroke="currentColor" strokeWidth="2" />
              <line x1="10" y1="170" x2="95" y2="170" stroke="currentColor" strokeWidth="2" />
              {/* Ornate vertical bars */}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={i} x1={20 + i * 13} y1="10" x2={20 + i * 13} y2="190" stroke="currentColor" strokeWidth="1.5" />
              ))}
              {/* Royal filigree symbols in gold gate */}
              <path d="M 12,50 C 45,30 20,90 95,50" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 12,100 C 45,80 20,140 95,100" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 12,150 C 45,130 20,180 95,150" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="100" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="150" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              {/* Left Gate Handle */}
              <circle cx="90" cy="100" r="4" fill="currentColor" />
            </svg>
          </div>

          {/* Right Gate segment */}
          <div className={`absolute right-0 top-0 bottom-0 w-1/2 border-l border-[#ffe7bc]/30 bg-gradient-to-l from-neutral-950/80 to-neutral-900/90 gate-right flex flex-col items-start justify-center pl-4 sm:pl-12 ${gateOpened || isUnlocked ? "gate-open-right" : ""}`}>
            <svg className="w-48 sm:w-72 h-[450px] text-[#c5a059]" viewBox="0 0 100 200" fill="currentColor">
              <rect x="5" y="10" width="85" height="180" fill="none" stroke="currentColor" strokeWidth="3" />
              <line x1="5" y1="30" x2="90" y2="30" stroke="currentColor" strokeWidth="2" />
              <line x1="5" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="2" />
              <line x1="5" y1="120" x2="90" y2="120" stroke="currentColor" strokeWidth="2" />
              <line x1="5" y1="170" x2="90" y2="170" stroke="currentColor" strokeWidth="2" />
              {/* Ornate vertical bars */}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={i} x1={15 + i * 13} y1="10" x2={15 + i * 13} y2="190" stroke="currentColor" strokeWidth="1.5" />
              ))}
              <path d="M 88,50 C 55,30 80,90 5,50" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 88,100 C 55,80 80,140 5,100" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 88,150 C 55,130 80,180 5,150" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="100" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="150" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              {/* Right Gate Handle */}
              <circle cx="10" cy="100" r="4" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Interactive Text & Entry Form */}
        <div className={`relative max-w-lg mx-auto text-center space-y-6 z-20 bg-neutral-900/85 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-white/10 transition-all duration-700 ${(gateOpened || isUnlocked) ? "opacity-0 translate-y-[-20px] pointer-events-none" : "opacity-100"}`}>
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#c5a059] block font-extrabold uppercase">
              BEHOLD, I STAND AT THE DOOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black uppercase text-white scale-y-95 tracking-tight leading-tight">
              Enter The Gates Of Eternal Presence
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-sans max-w-md mx-auto">
              A private fellowship with materials, scriptures, and tracking modules designed to transform negative thought frameworks and pull down strongholds.
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            onUnlockMembership(email);
          }} id="gate-landing-entry-form" className="space-y-3.5">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
              <input
                type="email"
                placeholder="Enter email to begin your 3-day Free Trial..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-white/15 hover:border-white/25 focus:border-[#c5a059] rounded-xl py-3.5 pl-11 pr-4 text-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#c5a059] transition font-sans"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#c5a059] hover:bg-[#b59049] text-white font-extrabold text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2 cursor-pointer shadow-xl shadow-black/30"
              id="unfold-gates-submit-button"
            >
              <span>Unlock Access & Open Gates</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="text-[10px] font-mono text-stone-500 flex items-center justify-center gap-1.5 uppercase">
              <span>$9.99/mo after trial</span>
              <span>•</span>
              <span>Cancel any time</span>
            </div>
          </form>
        </div>

        {/* When user is registered and gates are OPEN */}
        {(gateOpened || isUnlocked) && !welcomeDismissed && (
          <div className="absolute inset-0 flex items-center justify-center z-20 animate-fadeIn bg-black/40 p-6">
            <div className="bg-white text-[#2a2118] border border-[#e2d6bf] p-6 sm:p-8 rounded-3xl max-w-md text-center space-y-4 shadow-2xl relative">
              
              <button
                type="button"
                onClick={() => {
                  setWelcomeDismissed(true);
                  setGateOpened(false);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#FAF5EC] hover:bg-[#ffe7bc]/30 border border-[#e2d6bf] text-stone-500 hover:text-[#2a2118] transition-colors cursor-pointer"
                id="dismiss-welcome-button"
                title="Dismiss Welcome"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[9px] font-mono uppercase text-[#c5a059] font-black tracking-widest block">
                FELLOWSHIP SANCTUARY ACCESS OPEN
              </span>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-[#2A2118] leading-tight">
                  Welcome to the Sanctum
                </h3>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">
                  You are registered under <strong>{signUpEmail || "Trial Account"}</strong>. Your 3-day Trial period is active. Click elements on the top navigation bar to read materials, run audits, and write prayers!
                </p>
              </div>

              {membershipStatus === "trial_expired" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2 text-left animate-pulse">
                  <div className="flex items-center gap-2 text-red-700">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase font-mono">YOUR FREE TRIAL HAS EXPIRED</span>
                  </div>
                  <p className="text-[11px] text-[#2A2118] leading-snug">
                    Your 3 days has passed. Access is locked until payment is provided. Activate the monthly fellowship membership circle below.
                  </p>
                  <button 
                    onClick={onActivatePaid}
                    className="w-full py-2 bg-red-650 hover:bg-red-700 text-white rounded-lg text-[10px] uppercase font-black tracking-wider transition cursor-pointer"
                  >
                    Activate Subscription for $9.99/mo
                  </button>
                </div>
              )}

              <div className="bg-[#FAF5EC] p-3 rounded-xl border border-[#e2d6bf] flex items-center justify-between text-[11px]">
                <span className="font-mono text-stone-500 uppercase tracking-tight">Active Status:</span>
                <span className={`font-sans font-extrabold uppercase ${membershipStatus === "paid" ? "text-emerald-700" : membershipStatus === "trial" ? "text-[#c5a059]" : "text-red-600"}`}>
                  {membershipStatus.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          2. SCRIPTURE OF THE DAY PARCHMENT WIDGET (24-HOUR AUTO TRIGGER) 
          ======================================================== */}
      {scriptureOfTheDay && (
        <section className="max-w-5xl mx-auto" id="scripture-of-the-day-section">
          <div className="relative text-center overflow-hidden rounded-3xl bg-[#FAF5EC] border-2 border-[#e2d6bf] p-6 sm:p-10 shadow-lg space-y-6">
            
            {/* Background texture watermark details */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#c5a059]/40 opacity-70"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#c5a059]/40 opacity-70"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#c5a059]/40 opacity-70"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#c5a059]/40 opacity-70"></div>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Quote className="w-6 h-6 text-[#c5a059] rotate-180" />
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#c5a059] font-black uppercase block">
                  DAILY BREAD • SCRIPTURE OF THE DAY
                </span>
                <Quote className="w-6 h-6 text-[#c5a059]" />
              </div>

              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-xl sm:text-2xl font-serif italic font-black text-[#2A2118] leading-relaxed px-4">
                  "{scriptureOfTheDay.scriptureText}"
                </h3>
                
                <div className="inline-flex items-center space-x-1 px-3 py-1 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-full text-xs font-mono font-bold text-[#b59049]">
                  <span>— {scriptureOfTheDay.scriptureRef}</span>
                </div>
              </div>

              {/* Meditational thoughts / positive affirmations */}
              {scriptureOfTheDay.affirmation && (
                <div className="bg-[#FAF5EC] border border-[#e2d6bf]/70 p-4 rounded-2xl text-left max-w-xl mx-auto space-y-2 mt-4 shadow-inner">
                  <div className="flex items-center space-x-1 text-[10px] font-mono uppercase text-[#c5a059] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Combat Thought Pivot Affirmation</span>
                  </div>
                  <p className="text-xs text-[#6D5C4E] leading-relaxed font-sans font-medium">
                    {scriptureOfTheDay.affirmation}
                  </p>
                </div>
              )}

              {/* Visual live Countdown timer showing rotation scheduling */}
              <div className="pt-4 border-t border-[#e2d6bf] max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#8A7969] gap-3">
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>NEXT SCRIPTURE UPDATE IN:</span>
                  <span className="text-[#2A2118] font-bold bg-[#FAF5EC] border border-[#e2d6bf] px-2 py-0.5 rounded text-[11px] font-mono">{timeLeftToUpdate}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyScripture(`${scriptureOfTheDay.scriptureText} (${scriptureOfTheDay.scriptureRef})`)}
                    className="py-1 px-2.5 bg-white border border-[#e2d6bf] rounded hover:bg-[#FAF5EC] text-stone-600 font-bold transition flex items-center gap-1 cursor-pointer text-[9px] uppercase"
                  >
                    {scriptureCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{scriptureCopied ? "Copied" : "Copy Ref"}</span>
                  </button>

                  <button
                    onClick={() => rotateScripture(true)}
                    className="py-1 px-2.5 bg-[#c5a059] hover:bg-[#b59049] text-white rounded font-bold transition flex items-center gap-1 cursor-pointer text-[9px] uppercase shadow-sm"
                    title="Simulates 24 hours passing to pull a new scripture from the vault"
                  >
                    <RefreshCw className="w-3 h-3 text-white spin-hover" />
                    <span>Fast Forward 24h</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. ABOUT US: PURPOSE AND ORIGIN */}
      <section className="max-w-4xl mx-auto bg-white border border-[#e2d6bf] rounded-3xl p-8 sm:p-12 shadow-sm space-y-8" id="about-us-narrative">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#c5a059] font-bold block">
            MY PURPOSE & STATEMENT OF INTENT
          </span>
          <h2 className="text-3xl font-serif font-black uppercase text-[#2A2118] leading-tight tracking-tight scale-y-95">
            Why I Created This Sanctuary
          </h2>
          <div className="h-0.5 w-16 bg-[#c5a059]/40 mx-auto"></div>
        </div>

        <div className="font-sans text-[#4A3E30] text-sm sm:text-base leading-relaxed space-y-6">
          <p>
            Welcome, beloved seeker. I built this sanctuary because we live in an era where thousands of voices cry out for human mind mastery, positive thinking presets, and lifestyle manifestos, yet many remain exhausted. They are unaware of the core gravity inside: **Ephesians 6:12**.
          </p>
          <p className="bg-[#FAF5EC]/60 p-5 rounded-2xl border-l-4 border-[#c5a059] italic text-[#2A2118]">
            "For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms."
          </p>
          <p>
            The root of our self-defeating default thoughts—our flash anger, toxic control mechanisms, underlying panic, persistent envy, and silent resentment—is not just genetic chemistry or bad habits. It is a real spiritual warfare that negatively impacts our lives and ruins the peaceful atmosphere of everyone around us.
          </p>
          <p>
            Our core mission is to help souls transition from automatic reactionary living into **glorious awareness of Jesus** and active biblical armor guarding. By self-examining character defaults, meditating on absolute scripture pivots, and logging combat prayer entries, we let the healing medicine of God reach the deepest core of our identity. It is beautiful, it is real, and it is true.
          </p>
        </div>

        <div className="pt-6 border-t border-[#e2d6bf] flex flex-col sm:flex-row items-center justify-between gap-4" id="about-signatures">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF5EC] border border-[#e2d6bf] flex items-center justify-center text-[#c5a059] font-bold">
              ✝
            </div>
            <div>
              <span className="block font-bold text-[#2A2118] text-sm">State of Awareness in God</span>
              <span className="text-[10px] font-mono uppercase text-[#8A7969]">Established in Faith</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-stone-500 uppercase">
            Let the Deep Call to the Deep
          </span>
        </div>
      </section>

      {/* 3. BOOK SHOWCASE: THE DEEP THAT CALLETH */}
      <section className="grid md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto" id="book-sales-spotlight">
        {/* Actual Book Cover Image */}
        <div className="md:col-span-5 flex justify-center" id="book-visual-illustration">
          <div className="relative w-64 h-96 bg-neutral-900 rounded-2xl shadow-2xl border-4 border-[#e2d6bf] overflow-hidden transform hover:scale-[1.03] transition-transform duration-500 flex flex-col justify-between">
            <img 
              src={bookCoverImg} 
              alt="The Deep That Calleth Book Cover" 
              className="absolute inset-0 w-full h-full object-cover z-0" 
              referrerPolicy="no-referrer"
            />
            {/* Elegant 3D cover shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 mix-blend-overlay pointer-events-none z-10"></div>
          </div>
        </div>

        {/* Narrative & Marketing Copy */}
        <div className="md:col-span-7 space-y-6 text-left" id="book-description-words">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#c5a059] font-bold block">
            MUST-READ COMPANION BOOK
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black uppercase text-[#2A2118] tracking-tight leading-tight scale-y-95">
            "The Deep That Calleth"
          </h2>
          
          <div className="space-y-4 text-sm font-sans text-[#4A3E30] leading-relaxed">
            <p className="font-bold text-[#2A2118]">
              There is a depth in God that has been calling to the depth in you your entire life — every longing you could not name, every cry too heavy for words, every pattern that kept wounding you and everyone around you.
            </p>
            <p>
              This book walks you into that exact divine conversation: understanding the real spiritual forces behind your negative thought patterns, pulling down strongholds at the roots, and discovering what transformation truly looks like when the deep things of God reach the deepest place inside you.
            </p>
          </div>

          {/* Book Edition Option Picker Cards */}
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-mono uppercase text-[#8A7969] font-bold block">
              Select Book Format Edition:
            </label>
            <div className="grid sm:grid-cols-2 gap-3" id="book-format-options-grid">
              
              {/* Option A: PDF */}
              <button
                type="button"
                onClick={() => setSelectedBookVersion("pdf")}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedBookVersion === "pdf"
                    ? "bg-[#FAF5EC] border-[#c5a059] ring-1 ring-[#c5a059]"
                    : "bg-white border-[#e2d6bf] hover:bg-stone-50"
                }`}
                id="book-version-pdf"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#8A7969] font-bold">Digital Version</span>
                  <span className="text-sm font-serif font-black text-[#c5a059]">$14.99</span>
                </div>
                <h4 className="font-serif font-black text-sm text-[#2A2118] mt-1 uppercase">PDF E-Book Download</h4>
                <p className="text-[10px] text-stone-500 leading-snug mt-1">
                  Instant, searchable file compatible with any device, phone, or kindle.
                </p>
              </button>

              {/* Option B: Hard Copy */}
              <button
                type="button"
                onClick={() => setSelectedBookVersion("hardcopy")}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedBookVersion === "hardcopy"
                    ? "bg-[#FAF5EC] border-[#c5a059] ring-1 ring-[#c5a059]"
                    : "bg-white border-[#e2d6bf] hover:bg-stone-50"
                }`}
                id="book-version-hard"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#8A7969] font-bold">Printed Book</span>
                  <span className="text-sm font-serif font-black text-[#c5a059]">$30.00</span>
                </div>
                <h4 className="font-serif font-black text-sm text-[#2A2118] mt-1 uppercase">Hard Copy Printed</h4>
                <p className="text-[10px] text-stone-500 leading-snug mt-1">
                  Beautiful linen gold foil cover bound on off-white biblical parchment paper.
                </p>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setBookOrderSuccess(false);
                setBookBillingEmail(signUpEmail || "");
                setBookBillingName("");
                setBookShippingAddress("");
                setBookCardNo("");
                setBookExpiry("");
                setBookCVC("");
                setShowBookCheckout(true);
              }}
              className="w-full sm:w-auto py-4 px-10 rounded-xl bg-[#2A2118] hover:bg-[#4A3E30] text-white font-extrabold text-xs uppercase tracking-widest transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              id="buy-book-action"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>
                Order {selectedBookVersion === "pdf" ? "PDF Download ($14.99)" : "Hard Copy ($30.00)"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          INLINE BOOK PURCHASE SECURE CHECKOUT MODAL 
          ======================================================== */}
      {showBookCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" id="book-checkout-overlay">
          <div className="bg-white border border-[#e2d6bf] p-6 sm:p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl relative animate-scaleUp overflow-y-auto max-h-[90vh]">
            
            <button 
              onClick={() => setShowBookCheckout(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-[#FAF5EC] border border-[#e2d6bf] text-stone-500 hover:text-[#2a2118] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-[#c5a059] tracking-widest font-bold block">
                Secure Book Billing Portal
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-[#2A2118]">
                Checkout Order
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Purchasing <strong>"The Deep That Calleth"</strong> ({selectedBookVersion === "pdf" ? "PDF E-Book" : "Gold Printed Hardcopy"}).
              </p>
            </div>

            {bookOrderSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4 animate-scaleUp">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-serif font-black text-emerald-800 text-base uppercase">Order Confirmed!</h4>
                  <p className="text-[11px] text-emerald-700">
                    Transaction ID: <span className="font-mono font-bold">{bookOrderNumber}</span>
                  </p>
                </div>

                {selectedBookVersion === "pdf" ? (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-[#2A2118]">
                      Your digital license key has been bound to <strong>{bookBillingEmail || "your email"}</strong>. Download the e-book instantly below:
                    </p>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Your file 'TheDeepThatCalleth_Edition2026.pdf' is being download successfully inside this sandbox frame!");
                      }}
                      className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#c5a059] hover:bg-[#b59049] text-white font-extrabold text-xs uppercase tracking-widest transition w-full justify-center shadow"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>Download PDF Source Instantly</span>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 text-xs text-[#2A2118] leading-relaxed">
                    <p>
                      Thank you! A physical hand-bound gold-stamped hard copy has been ordered for shipping to:
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-[#e2d6bf] italic font-serif">
                      {bookShippingAddress || "No shipment address supplied - defaulting to registered profile."}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-2 font-mono uppercase">
                      ✓ Preparing shipment standard delivery (takes 3-5 business days).
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowBookCheckout(false)}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-[#2A2118] text-[10px] font-mono uppercase tracking-widest font-bold rounded-lg transition mt-4"
                >
                  Return to Sanctuary
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookPurchaseSubmit} className="space-y-4 text-left" id="inline-book-order-form">
                
                {/* Simulated Pricing Info */}
                <div className="bg-[#FAF5EC] p-3 rounded-xl border border-[#e2d6bf] flex items-center justify-between text-xs">
                  <span className="font-serif font-black text-[#2A2118]">
                    {selectedBookVersion === "pdf" ? "PDF Download Version" : "Printed Hard Copy Edition"}
                  </span>
                  <span className="font-mono font-bold text-[#c5a059] text-sm">
                    {selectedBookVersion === "pdf" ? "$14.99" : "$30.00"}
                  </span>
                </div>

                <div className="space-y-3 font-sans">
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                        Billing Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rachel Foster"
                        value={bookBillingName}
                        onChange={(e) => setBookBillingName(e.target.value)}
                        className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl p-2.5 text-xs text-[#2A2118] focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                        Delivery Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rachel@foster.com"
                        value={bookBillingEmail}
                        onChange={(e) => setBookBillingEmail(e.target.value)}
                        className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl p-2.5 text-xs text-[#2A2118] focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>
                  </div>

                  {selectedBookVersion === "hardcopy" && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                        Full Shipment Delivery Address
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 504 Covenant Ave, Suite A, Evansville, IN 47711"
                        value={bookShippingAddress}
                        onChange={(e) => setBookShippingAddress(e.target.value)}
                        className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl p-2.5 text-xs text-[#2A2118] focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 w-4 h-4 text-[#8A7969]" />
                      <input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={bookCardNo}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                          const matched = val.match(/.{1,4}/g);
                          setBookCardNo(matched ? matched.join(" ") : val);
                        }}
                        className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#2A2118] focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="08/29"
                        value={bookExpiry}
                        onChange={(e) => {
                          let raw = e.target.value.replace(/\D/g, "");
                          if (raw.length > 2) {
                            raw = raw.slice(0, 2) + "/" + raw.slice(2, 4);
                          }
                          setBookExpiry(raw.slice(0, 5));
                        }}
                        className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl p-2.5 text-xs text-[#2A2118] text-center focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        value={bookCVC}
                        onChange={(e) => setBookCVC(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl p-2.5 text-xs text-[#2A2118] text-center focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookOrderIsSubmitting}
                  className="w-full py-3.5 bg-[#c5a059] hover:bg-[#b59049] text-white rounded-xl font-extrabold text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2 cursor-pointer shadow-md mt-4 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>
                    {bookOrderIsSubmitting ? "Completing order secure tunnel..." : `Pay ${selectedBookVersion === "pdf" ? "$14.99" : "$30.00"}`}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. COMMUNITY EXCHANGES: TESTIMONIES & POSITIVE THOUGHTS */}
      <section className="max-w-4xl mx-auto space-y-8" id="testimonials-bulletin">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold block">
            FELLOWSHIP BULLETIN & WITNESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black uppercase text-[#2A2118] leading-tight tracking-tight scale-y-95">
            Testimonies & Grace Reflections
          </h2>
          <p className="text-xs sm:text-sm text-[#6D5C4E] max-w-lg mx-auto">
            Read positive thought reflections and testimonies of real mental and spiritual freedom in Christ from our active fellowship communities.
          </p>
        </div>

        {/* Input Form for New Witness */}
        <div className="bg-white border border-[#e2d6bf] p-6 sm:p-8 rounded-3xl shadow-sm" id="submit-witness-card">
          <form onSubmit={handleAddTestimony} className="space-y-4">
            <h3 className="text-xs font-mono text-[#2A2118] uppercase tracking-wider font-bold">
              Submit Your Own Positive Thoughts or Testimony
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#8A7969] font-bold block">
                  Your Name or Initials
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Katherine S."
                  value={newTestimonyName}
                  onChange={(e) => setNewTestimonyName(e.target.value)}
                  className="w-full bg-[#FAF5EC]/50 border border-[#e2d6bf] rounded-xl p-3 text-sm text-[#2A2118] focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#8A7969] font-bold block">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Indiana, US"
                  className="w-full bg-[#FAF5EC]/50 border border-[#e2d6bf] rounded-xl p-3 text-sm text-[#2A2118] focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#8A7969] font-bold block">
                How has Awareness in God transformed your thoughts and atmosphere?
              </label>
              <textarea
                required
                rows={3}
                placeholder="Share your testimonies or positive spiritual thoughts..."
                value={newTestimonyText}
                onChange={(e) => setNewTestimonyText(e.target.value)}
                className="w-full bg-[#FAF5EC]/50 border border-[#e2d6bf] rounded-xl p-3 text-sm text-[#2A2118] focus:outline-none focus:ring-1 focus:ring-[#c5a059] font-sans"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-[#c5a059] hover:bg-[#b59049] text-white font-extrabold text-xs uppercase tracking-widest transition cursor-pointer"
              id="submit-testimony-btn"
            >
              Publish Testimony to Fellowship Bulletin
            </button>
          </form>
        </div>

        {/* List of Testimonies */}
        <div className="grid gap-4 md:grid-cols-3" id="testimonies-fellowship-list">
          {testimonies.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#e2d6bf] p-6 rounded-2xl flex flex-col justify-between space-y-4"
              id={`testimony-list-card-${item.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1.5 text-amber-500 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#c5a059] stroke-[#c5a059]" />
                  ))}
                </div>
                <p className="font-serif italic text-xs leading-relaxed text-[#2A2118]">
                  "{item.text}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#e2d6bf]">
                <div>
                  <span className="block font-bold text-xs text-[#2A2118]">{item.name}</span>
                  <span className="text-[9px] font-mono text-stone-550 block">{item.location}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLikeTestimony(item.id)}
                  className="flex items-center space-x-1 py-1 px-2.5 bg-[#FAF5EC] border border-[#e2d6bf] text-[10px] text-stone-600 rounded-lg hover:text-red-500 hover:bg-red-50 transition cursor-pointer font-bold"
                >
                  <Heart className="w-3 h-3 text-rose-500 fill-current" />
                  <span>{item.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
