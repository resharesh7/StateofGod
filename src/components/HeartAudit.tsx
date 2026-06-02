/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AlertCircle, CheckCircle, ShieldAlert, Copy, RefreshCw, Bookmark, ChevronDown, Check, Sparkles } from "lucide-react";
import { NEGATIVE_PATTERNS } from "../data";
import { NegativePattern } from "../types";

interface HeartAuditProps {
  onAddPrayerToJournal: (prayerText: string, patternName: string) => void;
}

export default function HeartAudit({ onAddPrayerToJournal }: HeartAuditProps) {
  const [selectedPatternId, setSelectedPatternId] = useState<string>("anger");
  const [markedStruggles, setMarkedStruggles] = useState<Record<string, boolean>>({});
  const [symptomChecks, setSymptomChecks] = useState<Record<string, boolean>>({});
  const [strategyCommitted, setStrategyCommitted] = useState<Record<string, boolean>>({});
  const [copiedPatternId, setCopiedPatternId] = useState<string | null>(null);

  const activePattern = NEGATIVE_PATTERNS.find((p) => p.id === selectedPatternId) || NEGATIVE_PATTERNS[0];

  const toggleStruggle = (id: string) => {
    setMarkedStruggles((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyPrayer = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPatternId(id);
    setTimeout(() => setCopiedPatternId(null), 2000);
  };

  // Stats calculation
  const totalStruggles = Object.values(markedStruggles).filter(Boolean).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-[#2A2118]" id="heart-audit-section">
      {/* Profile Summary Widget */}
      <div className="bg-white border border-[#e2d6bf] text-[#2A2118] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" id="audit-metrics-banner">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c5a059] font-bold block">
            Self-Examination Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black uppercase tracking-tight text-[#2A2118] leading-tight scale-y-95">
            My Path of Heart Awareness
          </h2>
          <p className="text-xs sm:text-sm text-[#6D5C4E] font-sans max-w-xl">
            Evaluate negative automatic habits that poison your personal atmosphere and hurt other people. Identify these defaults, arm yourself with Truth, and commit to active spiritual course-correction.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#FAF5EC] border border-[#e2d6bf] rounded-2xl p-4 sm:p-5 flex-shrink-0" id="audit-summary-counters">
          <div className="text-center px-4 border-r border-[#e2d6bf]">
            <span className="block text-3xl font-serif font-black text-[#c5a059]">{totalStruggles}</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A7969] font-bold">Focus Traits</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-xs font-mono font-bold text-[#b59049]">
              {totalStruggles > 0 ? "VIGILANT PROGRESS" : "HEALTHY FLOW"}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A7969] font-bold font-semibold">Spiritual State</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8" id="audit-panel-grid">
        {/* Left column: 6 Patterns List */}
        <div className="lg:col-span-5 space-y-4" id="audit-left-cards-column">
          <h3 className="text-xs font-mono text-[#6D5C4E] uppercase tracking-[0.2em] pl-2 font-bold">
            Toxic Character Defaults
          </h3>
          <div className="space-y-3" id="patterns-vertical-list">
            {NEGATIVE_PATTERNS.map((pattern) => {
              const isSelected = selectedPatternId === pattern.id;
              const isMarked = markedStruggles[pattern.id];

              return (
                <div
                  key={pattern.id}
                  onClick={() => setSelectedPatternId(pattern.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-start justify-between ${
                    isSelected
                      ? "bg-[#FAF5EC] border-[#c5a059] shadow-sm scale-[1.01]"
                      : "bg-white border-[#e2d6bf] hover:bg-[#FAF5EC]/40 hover:border-[#c5a059]"
                  }`}
                  id={`pattern-card-${pattern.id}`}
                >
                  <div className="space-y-1.5 flex-1 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isMarked ? "bg-[#c5a059] animate-pulse" : "bg-stone-300"}`} />
                      <h4 className="font-serif font-bold text-base text-[#2A2118]">
                        {pattern.name}
                      </h4>
                    </div>
                    <span className="inline-block text-[9px] font-mono tracking-widest px-2 py-0.5 bg-[#FAF5EC] text-[#b59049] border border-[#e2d6bf] rounded uppercase font-bold">
                      {pattern.impactType}
                    </span>
                    <p className="text-xs text-[#6D5C4E] line-clamp-2 mt-1">
                      {pattern.description}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStruggle(pattern.id);
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isMarked
                        ? "bg-[#c5a059]/10 border-[#c5a059]/30 text-[#c5a059] font-bold"
                        : "bg-white border-[#e2d6bf] text-stone-400 hover:text-stone-6050"
                    }`}
                    title={isMarked ? "Remove from Focus" : "Mark as Active Focus Area"}
                    id={`struggle-trigger-${pattern.id}`}
                  >
                    {isMarked ? (
                      <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#c5a059]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Deep Diagnostic Details */}
        <div className="lg:col-span-7 bg-white border border-[#e2d6bf] rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm" id="audit-diagnostic-detail-panel">
          
          <div className="border-b border-[#e2d6bf] pb-5 space-y-3" id="diagnostic-header">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-[#b59049] font-bold uppercase tracking-[0.2em] px-2.5 py-1 bg-[#FAF5EC] border border-[#e2d6bf] rounded-full">
                {activePattern.impactType}
              </span>
              <button
                onClick={() => toggleStruggle(activePattern.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-sans font-semibold transition cursor-pointer ${
                  markedStruggles[activePattern.id]
                    ? "bg-[#c5a059]/10 border-[#c5a059]/40 text-[#c5a059]"
                    : "bg-white hover:bg-[#FAF5EC] border-[#e2d6bf] text-[#6D5C4E]"
                }`}
                id="toggle-diagnostic-struggle-btn"
              >
                {markedStruggles[activePattern.id] ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>In My Focused Prayer List</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-[#8A7969]" />
                    <span>Mark as Active Battle Focus</span>
                  </>
                )}
              </button>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#2A2118] uppercase leading-tight tracking-tight scale-y-95">
              {activePattern.name}
            </h3>
            <p className="text-sm text-[#4A3E30] font-sans leading-relaxed">
              {activePattern.description}
            </p>
          </div>

          {/* Symptom Self-Check */}
          <div className="space-y-4" id="symptom-checkup-card">
            <h4 className="text-xs font-mono text-[#6D5C4E] uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-[#c5a059]" />
              Symptom Self-Examination Checklist
            </h4>
            <div className="grid gap-3 bg-[#FAF5EC]/30 p-5 rounded-2xl border border-[#e2d6bf]" id="symptoms-list">
              {activePattern.symptoms.map((symptom, idx) => {
                const uniqueId = `${activePattern.id}-symptom-${idx}`;
                return (
                  <label
                    key={idx}
                    className="flex items-start space-x-3 text-sm text-[#2A2118] cursor-pointer select-none"
                    id={`label-${uniqueId}`}
                  >
                    <input
                      type="checkbox"
                      checked={!!symptomChecks[uniqueId]}
                      onChange={() =>
                        setSymptomChecks((prev) => ({ ...prev, [uniqueId]: !prev[uniqueId] }))
                      }
                      className="mt-1 accent-[#c5a059] h-4 w-4 bg-white border-[#e2d6bf] rounded cursor-pointer"
                    />
                    <span className={symptomChecks[uniqueId] ? "text-stone-450 line-through transition-all" : "text-[#2A2118]"}>
                      {symptom}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Social Impact Ripple */}
          <div className="bg-[#FAF5EC]/60 p-5 rounded-2xl border border-[#e2d6bf] space-y-2.5" id="social-impact-callout">
            <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-[0.2em] block font-bold">
              Collateral Damage (How It Wounds Others)
            </span>
            <p className="text-sm text-[#4A3E30] font-sans leading-relaxed">
              {activePattern.howItImpactsOthers}
            </p>
          </div>

          {/* Theological Biblical Root */}
          <div className="space-y-2.5" id="theological-root-section">
            <h4 className="text-xs font-mono text-[#6D5C4E] uppercase tracking-widest font-bold">
              The Spiritual Blindspot & Devotional Root
            </h4>
            <p className="text-sm text-[#4A3E30] leading-relaxed font-sans font-light">
              {activePattern.biblicalRoot}
            </p>
          </div>

          {/* Antidote Scriptures */}
          <div className="space-y-4" id="antidote-scriptures-section">
            <h4 className="text-xs font-mono text-[#6D5C4E] uppercase tracking-widest font-bold">
              Biblical Spiritual Medicine (Scriptures)
            </h4>
            <div className="space-y-3" id="diagnostic-scriptures-list">
              {activePattern.scriptures.map((scr, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-[#e2d6bf] rounded-xl space-y-2 shadow-sm"
                  id={`bible-card-${idx}`}
                >
                  <p className="font-serif italic text-[#2A2118] text-base leading-relaxed">
                    "{scr.text}"
                  </p>
                  <span className="text-xs font-mono text-[#c5a059] font-bold block">
                    — {scr.reference}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Combat renewal Strategy */}
          <div className="space-y-4" id="renewal-strategy-section">
            <h4 className="text-xs font-mono text-[#6D5C4E] uppercase tracking-[0.15em] flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              Christ-Centered Self-Interruption Strategies
            </h4>
            <div className="grid gap-3" id="strategies-list">
              {activePattern.renewalStrategy.map((strat, idx) => {
                const stratId = `${activePattern.id}-strat-${idx}`;
                return (
                  <div
                    key={idx}
                    onClick={() =>
                      setStrategyCommitted((prev) => ({ ...prev, [stratId]: !prev[stratId] }))
                    }
                    className={`p-3.5 rounded-xl border cursor-pointer select-none flex items-start gap-3 transition-colors ${
                      strategyCommitted[stratId]
                        ? "bg-[#FAF5EC]/30 border-[#e2d6bf] text-stone-400"
                        : "bg-white border-[#e2d6bf] hover:bg-[#FAF5EC] text-[#2A2118]"
                    }`}
                    id={`strat-card-${idx}`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {strategyCommitted[stratId] ? (
                        <CheckCircle className="w-4.5 h-4.5 text-stone-400" />
                      ) : (
                        <RefreshCw className="w-4.5 h-4.5 text-[#c5a059] opacity-85" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-[#c5a059] mr-1.5 uppercase">
                        Step {idx + 1}:
                      </span>
                      <span className={strategyCommitted[stratId] ? "line-through text-stone-400" : "font-sans text-sm"}>
                        {strat}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Renewal Prayer of Repentance */}
          <div className="bg-[#FAF5EC]/40 border border-[#e2d6bf] p-6 rounded-2xl relative space-y-4 shadow-sm" id="renewal-prayer-block">
            <span className="text-[10px] font-mono text-[#6D5C4E] uppercase tracking-widest block font-bold">
              Combat Prayer of Repentance & Awareness
            </span>
            <p className="font-serif italic text-[#4A3E30] text-base leading-relaxed p-4 bg-white rounded-xl border border-[#e2d6bf]">
              "{activePattern.renewalPrayer}"
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2" id="prayer-actions-list">
              <button
                onClick={() => handleCopyPrayer(activePattern.renewalPrayer, activePattern.id)}
                className="flex items-center text-xs py-2 px-3.5 font-semibold bg-white hover:bg-[#FAF5EC] border border-[#e2d6bf] rounded-xl text-[#2A2118] transition cursor-pointer"
                id="copy-prayer-btn"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5 text-[#6D5C4E]" />
                {copiedPatternId === activePattern.id ? "Copied Prayer" : "Copy Prayer Text"}
              </button>

              <button
                onClick={() => onAddPrayerToJournal(activePattern.renewalPrayer, activePattern.name)}
                className="flex items-center text-xs py-2 px-3.5 font-extrabold bg-[#c5a059] hover:bg-[#b59049] text-white uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer"
                id="journal-prayer-btn"
              >
                <Bookmark className="w-3.5 h-3.5 mr-1.5 text-white" />
                Log Prayer as Reflection Journal Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
