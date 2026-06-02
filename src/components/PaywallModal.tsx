/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lock, CreditCard, Mail, Sparkles, X, Check, ArrowRight, ShieldCheck } from "lucide-react";

interface PaywallModalProps {
  attemptedTab: string;
  membershipStatus: "anonymous" | "trial" | "trial_expired" | "paid";
  signUpEmail: string;
  onClose: () => void;
  onUnlockTrial: (email: string) => void;
  onActivatePaid: () => void;
}

export default function PaywallModal({
  attemptedTab,
  membershipStatus,
  signUpEmail,
  onClose,
  onUnlockTrial,
  onActivatePaid,
}: PaywallModalProps) {
  const [emailInput, setEmailInput] = useState(signUpEmail || "");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [billingZip, setBillingZip] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Formatter for Card Numbers (e.g. 4111 2222 3333 4444)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const trimmed = raw.slice(0, 16);
    const matches = trimmed.match(/.{1,4}/g);
    setCardNumber(matches ? matches.join(" ") : trimmed);
  };

  // Formatter for Expiry Date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 2) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2, 4);
    }
    setCardExpiry(raw.slice(0, 5));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    onUnlockTrial(emailInput);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !cardExpiry || !cardCVC || !billingZip) return;
    
    setIsSubmitting(true);
    
    // Simulate real authorization logic
    setTimeout(() => {
      setIsSubmitting(false);
      setPaymentSuccess(true);
      
      // Complete state update after success animation
      setTimeout(() => {
        onActivatePaid();
      }, 1500);
    }, 1800);
  };

  const showTrialExpiredPaywall = membershipStatus === "trial_expired";

  // Translate tab name to friendly label
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "book": return "Sovereign Book Reader & Chapters";
      case "audit": return "Heart Assessment & Daily Diagnostic";
      case "armor": return "Armor of God Strategic Lab";
      case "vault": return "Scripture Pivot Vault & Affirmations";
      case "journal": return "Spiritual Prayer & Awareness Journal";
      default: return "Fellowship Material";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" id="membership-intercept-overlay">
      <div className="bg-white border border-[#e2d6bf] p-6 sm:p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl relative animate-scaleUp overflow-y-auto max-h-[90vh]">
        
        {/* Absolute Close button */}
        <button 
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1 rounded-full bg-[#FAF5EC] border border-[#e2d6bf] text-stone-500 hover:text-[#2A2118] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {showTrialExpiredPaywall ? (
          /* 1. TRIAL EXPIRED CARD SUBMIT FORM */
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto text-red-650">
                <Lock className="w-5 h-5 text-red-600 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-red-600 block font-black uppercase">
                3-Day Trial Period Expired
              </span>
              <h3 className="text-2xl font-serif font-black uppercase text-[#2A2118] tracking-tight leading-tight">
                Unlock Lifetime Access
              </h3>
              <p className="text-xs text-[#6D5C4E] font-sans leading-relaxed max-w-sm mx-auto">
                Your complimentary 3-day fellowship access to <strong className="text-[#2A2118]">"{getTabLabel(attemptedTab)}"</strong> has concluded. Please activate your monthly subscription to resume.
              </p>
            </div>

            {paymentSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-pulse">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white">
                  <Check className="w-5 h-5 text-white stroke-[3px]" />
                </div>
                <h4 className="font-serif font-black text-emerald-800 uppercase text-sm">Payment Secured</h4>
                <p className="text-xs text-emerald-700">
                  Activating premium subscription... Thank you for joining the State of God fellowship!
                </p>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left" id="modal-payment-form">
                
                {/* Simulated Order Summary Summary */}
                <div className="bg-[#FAF5EC] rounded-xl p-3 border border-[#e2d6bf] space-y-1">
                  <div className="flex items-center justify-between text-xs font-serif font-black text-[#2A2118]">
                    <span>Fellowship Premium membership</span>
                    <span>$9.99 / mo</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#8A7969] uppercase">
                    3-Day Trial Concluded • Secure TLS Encryption
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl p-3 text-xs text-[#2A2118] focus:ring-1 focus:ring-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-[#8A7969]" />
                      <input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl py-3 pl-10 pr-3 text-xs text-[#2A2118] focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1 col-span-1">
                      <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl p-3 text-xs text-[#2A2118] text-center focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>

                    <div className="space-y-1 col-span-1">
                      <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl p-3 text-xs text-[#2A2118] text-center focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>

                    <div className="space-y-1 col-span-1">
                      <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block">
                        Billing Zip
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="47201"
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl p-3 text-xs text-[#2A2118] text-center focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#c5a059] hover:bg-[#b59049] text-white rounded-xl font-extrabold text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2 cursor-pointer shadow-md mt-4 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? "Processing secure dues..." : "Submit Payment Details"}</span>
                </button>

                <div className="flex items-center gap-1 opacity-60 text-[9px] text-[#8A7969] justify-center mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SSL encryption secures all transactions in sandbox frame.</span>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* 2. ANONYMOUS TRIAL EXPIRED/UNREGISTERED PRE-REGISTRATION */
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-[#c5a059]/15 border border-[#c5a059]/30 rounded-full flex items-center justify-center mx-auto text-[#c5a059]">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#c5a059] block font-black uppercase">
                Gated Fellowship Material
              </span>
              <h3 className="text-2xl font-serif font-black uppercase text-[#2A2118] tracking-tight leading-tight">
                Unlock Gated Access
              </h3>
              <p className="text-xs text-[#6D5C4E] font-sans leading-relaxed">
                Unlock the <strong className="text-[#2A2118]">"{getTabLabel(attemptedTab)}"</strong> and all other features! Start your 3-day Free Trial to access our spiritual character audit and books instantly.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4" id="modal-register-form">
              <div className="relative text-left">
                <label className="text-[9px] font-mono uppercase text-[#8A7969] font-bold block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email to begin your trial..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#2A2118] focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#c5a059] hover:bg-[#b59049] text-white rounded-xl font-extrabold text-xs uppercase tracking-widest transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <span>Activate 3-Day Free Trial</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <div className="text-[9px] font-mono text-stone-500 uppercase tracking-tight flex items-center justify-center gap-1">
                <span>$9.99/mo after trial</span>
                <span>•</span>
                <span>Cancel any time</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
