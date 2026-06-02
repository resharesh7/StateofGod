/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, ShieldAlert, Shield, Compass, Heart, Library, 
  Sparkles, Menu, X, Crown, Lock, Globe 
} from "lucide-react";
import BookReader from "./components/BookReader";
import HeartAudit from "./components/HeartAudit";
import ArmorLab from "./components/ArmorLab";
import ScriptureVault from "./components/ScriptureVault";
import JournalSection from "./components/JournalSection";
import LandingPage from "./components/LandingPage";
import PaywallModal from "./components/PaywallModal";

type TabId = "home" | "book" | "audit" | "armor" | "vault" | "journal";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [externalPromptText, setExternalPromptText] = useState("");
  const [externalPromptSource, setExternalPromptSource] = useState("");
  
  // Persistent simulation state for membership access
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem("sa_membership_unlocked") === "true";
  });

  const [isPaid, setIsPaid] = useState(() => {
    return localStorage.getItem("sa_membership_paid") === "true";
  });

  const [signUpEmail, setSignUpEmail] = useState(() => {
    return localStorage.getItem("sa_signup_email") || "";
  });

  const [signUpTime, setSignUpTime] = useState<number>(() => {
    const val = localStorage.getItem("sa_signup_time");
    if (val) return Number(val);
    const now = Date.now();
    localStorage.setItem("sa_signup_time", String(now));
    return now;
  });

  // Time fast-forward simulation (in days)
  const [testTimeOffsetDays, setTestTimeOffsetDays] = useState<number>(0);

  // Read current membership condition
  const getMembershipStatus = () => {
    if (!isUnlocked) return "anonymous";
    if (isPaid) return "paid";

    const elapsedMs = (Date.now() + testTimeOffsetDays * 24 * 60 * 60 * 1000) - signUpTime;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

    if (elapsedMs >= threeDaysMs) {
      return "trial_expired";
    }
    return "trial";
  };

  const membershipStatus = getMembershipStatus();

  // State for show paywall gate modal
  const [attemptedTab, setAttemptedTab] = useState<TabId | null>(null);

  const handleWriteInJournal = (promptText: string, chapterTitle: string) => {
    const status = getMembershipStatus();
    if (status === "anonymous" || status === "trial_expired") {
      setAttemptedTab("journal");
      return;
    }
    setExternalPromptText(promptText);
    setExternalPromptSource(chapterTitle);
    setActiveTab("journal");
  };

  const handleClearExternalPrompt = () => {
    setExternalPromptText("");
    setExternalPromptSource("");
  };

  const handleUnlockTrial = (email: string) => {
    localStorage.setItem("sa_membership_unlocked", "true");
    localStorage.setItem("sa_signup_email", email);
    const now = Date.now();
    localStorage.setItem("sa_signup_time", String(now));
    
    setIsUnlocked(true);
    setSignUpEmail(email);
    setSignUpTime(now);
    setTestTimeOffsetDays(0); // Reset simulation speed
    setAttemptedTab(null);
    setActiveTab("book"); // Seamless redirect to reading materials
  };

  const handleActivatePaidSubscription = () => {
    localStorage.setItem("sa_membership_paid", "true");
    setIsPaid(true);
    setAttemptedTab(null);
  };

  const handleLockMembership = () => {
    localStorage.removeItem("sa_membership_unlocked");
    localStorage.removeItem("sa_membership_paid");
    localStorage.removeItem("sa_signup_email");
    localStorage.removeItem("sa_signup_time");
    setIsUnlocked(false);
    setIsPaid(false);
    setSignUpEmail("");
    setSignUpTime(Date.now());
    setTestTimeOffsetDays(0);
    setActiveTab("home");
  };

  const handleResetAccount = () => {
    handleLockMembership();
  };

  const handleTabClick = (tabId: TabId) => {
    if (tabId === "home") {
      setActiveTab("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const status = getMembershipStatus();
      if (status === "anonymous" || status === "trial_expired") {
        setAttemptedTab(tabId);
      } else {
        setActiveTab(tabId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const bypassPaywall = () => {
    if (getMembershipStatus() === "trial_expired") {
      handleActivatePaidSubscription();
    } else {
      handleUnlockTrial("tester@preview.com");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#c5a059] selection:text-white font-sans tracking-normal bg-[#FAF5EC] text-[#2A2118]">
      
      {/* Premium Editorial Navigation Masthead */}
      <header className="sticky top-0 z-50 bg-[#FAF5EC]/95 backdrop-blur-md border-b border-[#e2d6bf] shadow-sm" id="main-masthead">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo, Banner & Slogan */}
          <div className="flex items-center space-x-3 text-left cursor-pointer" onClick={() => handleTabClick("home")} id="logo-block">
            <div className="p-1 text-white bg-transparent rounded-xl" id="logo-icon-box">
              <svg className="text-[#c5a059] filter drop-shadow-[0_0_3px_rgba(197,160,89,0.3)]" style={{ width: '75px', height: '75px' }} viewBox="0 0 100 100" fill="none" stroke="currentColor">
                {/* Thin outer gold oval/circle boundary */}
                <ellipse cx="50" cy="50" rx="44" ry="44" strokeWidth="1.5" strokeDasharray="3 1" />
                <ellipse cx="50" cy="50" rx="41" ry="41" strokeWidth="0.75" />
                
                {/* Delicately rendered olive branches at bottom curved boundary */}
                <path d="M 22,70 C 26,82 38,88 50,88 C 62,88 74,82 78,70" strokeWidth="1" strokeLinecap="round" />
                <circle cx="21" cy="68" r="1.5" fill="currentColor" />
                <circle cx="79" cy="68" r="1.5" fill="currentColor" />
                
                {/* Tiny stylized leaves along the bottom path */}
                <path d="M 26,73 Q 23,70 27,72" strokeWidth="1" strokeLinecap="round" />
                <path d="M 32,77 Q 29,73 33,75" strokeWidth="1" strokeLinecap="round" />
                <path d="M 39,81 Q 36,77 40,79" strokeWidth="1" strokeLinecap="round" />
                <path d="M 46,84 Q 44,80 47,82" strokeWidth="1" strokeLinecap="round" />
                <path d="M 54,84 Q 56,80 53,82" strokeWidth="1" strokeLinecap="round" />
                <path d="M 61,81 Q 64,77 60,79" strokeWidth="1" strokeLinecap="round" />
                <path d="M 68,77 Q 71,73 67,75" strokeWidth="1" strokeLinecap="round" />
                <path d="M 74,73 Q 77,70 73,72" strokeWidth="1" strokeLinecap="round" />
                
                {/* Grand rising layout light rays from cross's horizon */}
                {Array.from({ length: 15 }).map((_, i) => {
                  const angle = (i * 12 + 198) * (Math.PI / 180);
                  const x1 = 50 + 18 * Math.cos(angle);
                  const y1 = 44 + 18 * Math.sin(angle);
                  const x2 = 50 + 32 * Math.cos(angle);
                  const y2 = 44 + 32 * Math.sin(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.5" stroke="currentColor" opacity="0.6" />;
                })}
                
                {/* Strong glowing Latin cross */}
                <line x1="50" y1="24" x2="50" y2="60" strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" />
                <line x1="40" y1="36" x2="60" y2="36" strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-display font-black tracking-normal text-[#2A2118] uppercase leading-none scale-y-95">
                  State of Awareness in God
                </h1>
                {isUnlocked && (
                  <>
                    {membershipStatus === "paid" ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-[#c5a059] text-[9px] font-mono tracking-widest text-white rounded-full uppercase font-bold shadow-sm">
                        <Crown className="w-2.5 h-2.5" />
                        <span>PAID FELLOWSHIP</span>
                      </span>
                    ) : membershipStatus === "trial_expired" ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-red-600 text-[9px] font-mono tracking-widest text-white rounded-full uppercase font-bold animate-pulse">
                        <Lock className="w-2.5 h-2.5" />
                        <span>TRIAL EXPIRED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-[#FAF5EC] border border-[#e2d6bf] text-[9px] font-mono tracking-widest text-[#8A7969] rounded-full uppercase font-bold">
                        <Sparkles className="w-2.5 h-2.5 text-[#c5a059]" />
                        <span>3-DAY TRIAL</span>
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059] font-bold block mt-1">
                Christ-Centered Positive Thought Transformation
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex flex-wrap items-center justify-center gap-1 p-1 bg-white border border-[#e2d6bf] rounded-2xl shadow-sm" id="navigation-tabs">
            {([
              { id: "home", label: "Entrance Gate", icon: Globe, premium: false },
              { id: "book", label: "The Awakening of Awareness", icon: BookOpen, premium: true },
              { id: "audit", label: "Self Assessment", icon: ShieldAlert, premium: true },
              { id: "armor", label: "Armor of God", icon: Shield, premium: true },
              { id: "vault", label: "Scripture Vault", icon: Library, premium: true },
              { id: "journal", label: "Awareness Journal", icon: Heart, premium: true }
            ] as const).map(({ id, label, icon: Icon, premium }) => {
              const isActive = activeTab === id;
              const isLocked = premium && membershipStatus !== "paid" && membershipStatus !== "trial";
              return (
                <button
                  key={id}
                  onClick={() => handleTabClick(id)}
                  className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-xs font-sans font-semibold transition-all duration-300 relative cursor-pointer ${
                    isActive
                      ? "bg-[#c5a059] text-white font-extrabold shadow-sm scale-95"
                      : "text-stone-500 hover:text-[#2A2118] hover:bg-[#FAF5EC]/70"
                  }`}
                  id={`nav-btn-${id}`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-white" : "text-[#8A7969]"}`} />
                  <span>{label}</span>
                  {isLocked && (
                    <Lock className="w-2.5 h-2.5 text-red-600 absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex-grow" id="primary-app-layout">
        
        {/* Active Tab View Rendering */}
        <div className="animate-fadeIn duration-500" id="current-tab-rendering-wrapper">
          {activeTab === "home" && (
            <LandingPage 
              onUnlockMembership={handleUnlockTrial}
              isUnlocked={isUnlocked}
              isPaid={isPaid}
              membershipStatus={membershipStatus}
              signUpEmail={signUpEmail}
              signUpTime={signUpTime}
              onActivatePaid={handleActivatePaidSubscription}
              testTimeOffsetDays={testTimeOffsetDays}
              setTestTimeOffsetDays={setTestTimeOffsetDays}
              onResetAccount={handleResetAccount}
            />
          )}

          {activeTab === "book" && (
            <BookReader onWriteInJournal={handleWriteInJournal} />
          )}

          {activeTab === "audit" && (
            <HeartAudit onAddPrayerToJournal={handleWriteInJournal} />
          )}

          {activeTab === "armor" && (
            <ArmorLab />
          )}

          {activeTab === "vault" && (
            <ScriptureVault />
          )}

          {activeTab === "journal" && (
            <JournalSection
              externalPromptText={externalPromptText}
              externalPromptSource={externalPromptSource}
              onClearExternalPrompt={handleClearExternalPrompt}
            />
          )}
        </div>

      </main>

      {/* Humble, Gorgeous Liturgical Champagne Footer */}
      <footer className="border-t border-[#e2d6bf] bg-[#FAF5EC] py-12 text-center space-y-4 px-4 text-[#2A2118]" id="main-footer">
        <div className="max-w-xl mx-auto space-y-2">
          <p className="font-serif italic text-[#4A3E30] text-sm">
            "Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil's schemes."
          </p>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a059] block font-bold">
            — Ephesians 6:10-11
          </span>
        </div>
        
        <div className="pt-6 border-t border-[#e2d6bf]/80 max-w-xl mx-auto text-[#8A7969] text-[10px] font-mono tracking-wider flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-bold">
            <span>STATE OF AWARENESS IN GOD</span>
            <span>•</span>
            <span>Est. 2026</span>
          </div>

          {isUnlocked ? (
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-stone-500">
                Email: {signUpEmail || "Registered"}
              </span>
              <button 
                onClick={handleLockMembership}
                className="text-xs uppercase text-red-600 hover:underline font-bold cursor-pointer"
              >
                Sign out / Reset Account
              </button>
            </div>
          ) : (
            <span className="text-stone-400">Preview Mode</span>
          )}
        </div>
      </footer>

      {/* Custom Breathtaking Intercept paywall Modal */}
      {attemptedTab && (
        <PaywallModal 
          attemptedTab={attemptedTab} 
          membershipStatus={membershipStatus}
          onClose={() => setAttemptedTab(null)}
          onUnlockTrial={(email) => {
            handleUnlockTrial(email);
            setAttemptedTab(null);
          }}
          onActivatePaid={() => {
            handleActivatePaidSubscription();
            // Direct to whichever page was attempted!
            setTimeout(() => {
              setActiveTab(attemptedTab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, 100);
          }}
          signUpEmail={signUpEmail}
        />
      )}

    </div>
  );
}
