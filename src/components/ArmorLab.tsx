/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Sparkles, Check, Bookmark, AlertCircle, Eye, HelpCircle } from "lucide-react";
import { ARMOR_PIECES } from "../data";
import { ArmorPiece } from "../types";

export default function ArmorLab() {
  const [selectedArmorId, setSelectedArmorId] = useState<string>("shield-faith");
  const [equippedPieces, setEquippedPieces] = useState<Record<string, boolean>>({});

  const activeArmor = ARMOR_PIECES.find((a) => a.id === selectedArmorId) || ARMOR_PIECES[0];

  const toggleEquip = (id: string) => {
    setEquippedPieces((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalEquipped = Object.values(equippedPieces).filter(Boolean).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-[#2A2118]" id="armor-lab-section">
      {/* Narrative Intro */}
      <div className="bg-white border border-[#e2d6bf] rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-sm" id="armor-lab-intro">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c5a059] block font-bold">
          EPHESIANS 6:11-17
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif font-black uppercase text-[#2A2118] scale-y-95 leading-none">
          The Spiritual Armory
        </h2>
        <p className="text-sm sm:text-base text-[#6D5C4E] max-w-2xl mx-auto font-sans leading-relaxed">
          "Put on the full armor of God, so that you can take your stand against the devil's schemes. For our struggle is not against flesh and blood..." To counteract negative currents in our lives, we must deliberately clothe our minds in God's defenses.
        </p>

        {/* Armor Progress Bar */}
        <div className="pt-4 max-w-md mx-auto space-y-2 font-sans" id="armor-progress-tracker font-sans">
          <div className="flex items-center justify-between text-xs text-[#6D5C4E] font-mono font-bold tracking-wider">
            <span>ARMOR EQUIPPED DAILY STATUS:</span>
            <span className="text-[#c5a059] font-mono">{totalEquipped} of 6 pieces</span>
          </div>
          <div className="h-2 bg-[#FAF5EC]/60 border border-[#e2d6bf] rounded-full overflow-hidden flex" id="progress-container">
            <div
              className="bg-[#c5a059] h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${(totalEquipped / 6) * 100}%` }}
              id="progress-bar-indicator"
            />
          </div>
          {totalEquipped === 6 && (
            <span className="text-xs font-mono text-emerald-600 font-bold block animate-pulse">
              ✓ Fully Armed of God. Clothed in Truth, Peace, and Faith!
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8" id="armor-detail-grid">
        {/* Left column: Visual list / Schematic */}
        <div className="lg:col-span-5 space-y-4" id="armor-list-column">
          <h3 className="text-xs font-mono text-[#6D5C4E] uppercase tracking-[0.2em] pl-2 font-bold">
            The Pieces of Armor
          </h3>
          <div className="grid gap-3" id="armor-card-layout">
            {ARMOR_PIECES.map((piece) => {
              const isSelected = selectedArmorId === piece.id;
              const isEquipped = equippedPieces[piece.id];

              return (
                <div
                  key={piece.id}
                  onClick={() => setSelectedArmorId(piece.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#FAF5EC] border-[#c5a059] shadow-sm scale-[1.01]"
                      : "bg-white border-[#e2d6bf] hover:bg-[#FAF5EC]/40 hover:border-[#c5a059]"
                  }`}
                  id={`armor-selector-card-${piece.id}`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2.5 rounded-xl border ${
                      isEquipped
                        ? "bg-[#c5a059]/10 border-[#c5a059]/30 text-[#c5a059]"
                        : "bg-white border-[#e2d6bf] text-stone-400"
                    }`} id={`armor-piece-icon-box-${piece.id}`}>
                      <Shield className={`w-4 h-4 flex-shrink-0 ${isEquipped ? "fill-[#c5a059] stroke-[#c5a059]" : ""}`} />
                    </div>
                    <div className="text-left space-y-0.5">
                      <h4 className="font-serif font-bold text-base text-[#2A2118] leading-tight font-bold">
                        {piece.name}
                      </h4>
                      <span className="block text-[10px] font-mono text-[#8A7969] uppercase tracking-wide">
                        {piece.biblicalReference}
                      </span>
                    </div>
                  </div>

                  {/* Equipped status pill */}
                  <span className={`text-[9px] font-mono uppercase px-2.5 py-1 rounded-full border transition-colors ${
                    isEquipped
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 font-bold"
                      : "bg-[#FAF5EC] border-[#e2d6bf] text-stone-500"
                  }`} id={`equip-pill-${piece.id}`}>
                    {isEquipped ? "Equipped" : "Tap to Equip"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>        {/* Right column: Deep detail & Tactical guide */}
        <div className="lg:col-span-7 bg-white border border-[#e2d6bf] rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm" id="armor-item-specs-panel">
          
          {/* Item title */}
          <div className="border-b border-[#e2d6bf] pb-5 space-y-3" id="piece-narrative-header">
            <span className="text-xs font-mono font-bold text-[#c5a059] block tracking-[0.2em] uppercase">
              ARMORY SCHEMA — {activeArmor.biblicalReference}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#2A2118] uppercase leading-tight tracking-tight scale-y-95">
              {activeArmor.name}
            </h3>
            <p className="text-sm font-sans text-[#4A3E30] leading-relaxed">
              {activeArmor.description}
            </p>
          </div>

          {/* Scripture focus */}
          <div className="p-5 bg-[#FAF5EC]/40 border border-[#e2d6bf] rounded-2xl space-y-2.5" id="epic-scripture-card">
            <span className="text-[10px] font-mono text-[#8A7969] uppercase tracking-widest block font-bold">
              Sovereign Biblical Decree
            </span>
            <p className="font-serif italic text-[#2A2118] text-lg leading-relaxed">
              "{activeArmor.biblicalText}"
            </p>
            <span className="text-xs font-mono text-[#c5a059] font-bold block">
              — {activeArmor.biblicalReference}
            </span>
          </div>

          {/* How to Equip */}
          <div className="space-y-3" id="piece-instruction-set">
            <h4 className="text-xs font-mono text-[#6D5C4E] uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Eye className="w-4 h-4 text-[#c5a059]" />
              How to Daily Equip this Piece
            </h4>
            <p className="text-sm text-[#4A3E30] leading-relaxed font-sans bg-[#FAF5EC]/60 p-4 rounded-xl border border-[#e2d6bf]">
              {activeArmor.howToEquip}
            </p>
          </div>

          {/* Spiritual Counteract */}
          <div className="space-y-3" id="spiritual-counteract-detail">
            <h4 className="text-xs font-mono text-[#6D5C4E] uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-[#c5a059]" />
              Negative Patterns This Defeats
            </h4>
            <p className="text-sm font-sans font-bold text-[#2A2118]">
              Forces defeated: <span className="underline decoration-[#c5a059]/30 text-[#c5a059]">{activeArmor.spiritualCounteract}</span>
            </p>
            <p className="text-xs text-[#6D5C4E] font-sans leading-relaxed">
              By girding your soul with this defensive reality, you automatically interrupt any automatic, negative thoughts of {activeArmor.spiritualCounteract.toLowerCase()} before they infect those around you.
            </p>
          </div>

          {/* Large Action Equip Toggle */}
          <div className="pt-4 border-t border-[#e2d6bf]" id="armor-action-block">
            <button
              onClick={() => toggleEquip(activeArmor.id)}
              className={`w-full py-4 rounded-xl text-xs font-sans font-extrabold uppercase tracking-widest flex items-center justify-center space-x-2 transition cursor-pointer ${
                equippedPieces[activeArmor.id]
                  ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 hover:bg-emerald-500/20"
                  : "bg-[#c5a059] text-white hover:bg-[#b59049] transition duration-300 shadow-sm"
              }`}
              id="equip-large-action-btn"
            >
              {equippedPieces[activeArmor.id] ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Equipped On Account — Ready for Spiritual Battle</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Equip {activeArmor.name} for Today</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
