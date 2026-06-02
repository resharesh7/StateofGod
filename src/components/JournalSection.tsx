/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { JournalEntry } from "../types";
import { BookOpen, Calendar, HelpCircle, Save, Trash2, Download, AlertCircle, Plus, Check } from "lucide-react";

interface JournalSectionProps {
  externalPromptText?: string;
  externalPromptSource?: string;
  onClearExternalPrompt?: () => void;
}

export default function JournalSection({
  externalPromptText,
  externalPromptSource,
  onClearExternalPrompt
}: JournalSectionProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [prayerNotes, setPrayerNotes] = useState("");
  const [themeFocus, setThemeFocus] = useState("General Reflection");
  const [gratitude1, setGratitude1] = useState("");
  const [gratitude2, setGratitude2] = useState("");
  const [gratitude3, setGratitude3] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("spiritual-awareness-journal");
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse journal logs", e);
      }
    }
  }, []);

  // Pre-fill from external triggers
  useEffect(() => {
    if (externalPromptText) {
      if (externalPromptSource?.includes("Chapter") || externalPromptSource?.includes("Awakening")) {
        setReflectionText((prev) => {
          const prefix = `[Meditation Reflection for ${externalPromptSource}]:\nPrompt: "${externalPromptText}"\n\nMy Reflection: `;
          return prev.includes(externalPromptText) ? prev : prefix + prev;
        });
        setThemeFocus("Book Meditation");
      } else {
        // Assume prayer insertion from Heart Audit
        setPrayerNotes((prev) => {
          const prefix = `[Repentance Combat Prayer for ${externalPromptSource}]:\n${externalPromptText}\n\nMy Personal Commitment:\n`;
          return prev.includes(externalPromptText) ? prev : prefix + prev;
        });
        setThemeFocus("Heart Audit Correction");
      }
      // Scroll to the journal input form smoothly
      const formElement = document.getElementById("journal-entry-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [externalPromptText, externalPromptSource]);

  const saveEntriesToLocalStorage = (newEntries: JournalEntry[]) => {
    localStorage.setItem("spiritual-awareness-journal", JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim() && !prayerNotes.trim() && !gratitude1.trim()) {
      setSubmitError("Please fill in at least a reflection, a prayer, or one gratitude point.");
      return;
    }

    setSubmitError("");

    const gratitudes: string[] = [];
    if (gratitude1.trim()) gratitudes.push(gratitude1.trim());
    if (gratitude2.trim()) gratitudes.push(gratitude2.trim());
    if (gratitude3.trim()) gratitudes.push(gratitude3.trim());

    const newEntry: JournalEntry = {
      id: "entry-" + Date.now(),
      date: new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      chapterPromptReviewed: externalPromptSource || undefined,
      selectedPatternId: themeFocus,
      reflectionText: reflectionText.trim(),
      prayerNotes: prayerNotes.trim(),
      gratitudePoints: gratitudes
    };

    const updated = [newEntry, ...entries];
    saveEntriesToLocalStorage(updated);

    // Clear form fields
    setReflectionText("");
    setPrayerNotes("");
    setGratitude1("");
    setGratitude2("");
    setGratitude3("");
    setThemeFocus("General Reflection");

    if (onClearExternalPrompt) {
      onClearExternalPrompt();
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this historical journal entry?")) {
      const filtered = entries.filter((ent) => ent.id !== id);
      saveEntriesToLocalStorage(filtered);
    }
  };

  const handleExportJournal = () => {
    if (entries.length === 0) {
      alert("No journal entries exist to export yet.");
      return;
    }

    let doc = `========================================================\n`;
    doc += `      STATE OF AWARENESS IN GOD - REFLECTION DIARY\n`;
    doc += `========================================================\n\n`;

    entries.forEach((e, idx) => {
      doc += `Entry #${entries.length - idx}\n`;
      doc += `Date: ${e.date}\n`;
      doc += `Focus Theme: ${e.selectedPatternId}\n`;
      if (e.chapterPromptReviewed) {
        doc += `Prompt Source: ${e.chapterPromptReviewed}\n`;
      }
      doc += `--------------------------------------------------------\n`;
      if (e.reflectionText) {
        doc += `REFLCTION NOTES:\n${e.reflectionText}\n\n`;
      }
      if (e.prayerNotes) {
        doc += `PRAYER COMMITMENTS:\n${e.prayerNotes}\n\n`;
      }
      if (e.gratitudePoints.length > 0) {
        doc += `GRATITUDE POINTS OF AWARENESS:\n`;
        e.gratitudePoints.forEach((g, i) => {
          doc += `  ${i + 1}. ${g}\n`;
        });
      }
      doc += `========================================================\n\n`;
    });

    const blob = new Blob([doc], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "My - State of Awareness in God - Journal.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = entries.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.reflectionText.toLowerCase().includes(term) ||
      e.prayerNotes.toLowerCase().includes(term) ||
      e.selectedPatternId?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 text-[#2A2118]" id="journal-main-grid">
      {/* Left side: Creation Form */}
      <div className="lg:col-span-6 space-y-6" id="journal-left-column">
        <div className="bg-white border border-[#e2d6bf] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md" id="journal-entry-form">
          <div className="space-y-1.5" id="entry-form-header">
            <span className="text-xs uppercase font-mono text-[#c5a059] tracking-[0.2em] font-bold block">
              Sacred Reflection Log
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black uppercase text-[#2A2118] leading-tight">
              Pen New Experience
            </h3>
            <p className="text-xs text-[#6D5C4E] font-sans leading-relaxed">
              Log daily situations, write sincere prayers of surrender, and train your brain in resurrection-centered positive gratitude.
            </p>
          </div>

          {/* Quick Notice for external cues */}
          {externalPromptText && (
            <div className="bg-[#FAF5EC] border-2 border-[#c5a059]/40 p-4 rounded-xl flex items-start gap-2 text-xs" id="cue-loaded-notice">
              <AlertCircle className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-[#4A3E30]">
                <span className="font-bold text-[#b59049]">Loaded Context:</span> Auto-inserted prompt from{" "}
                <span className="italic underline font-semibold">{externalPromptSource}</span>. Make sure to complete the reflection below!
                <button
                  onClick={onClearExternalPrompt}
                  className="block text-[#c5a059] hover:text-[#b59049] hover:underline font-bold mt-1 cursor-pointer"
                >
                  Clear loaded cue
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleAddEntry} className="space-y-5" id="editor-form">
            {/* Theme / Category */}
            <div className="space-y-1.5" id="focus-theme">
              <label className="text-xs uppercase font-mono text-[#6D5C4E] tracking-wider block font-bold">
                Spiritual Focus Theme
              </label>
              <select
                value={themeFocus}
                onChange={(e) => setThemeFocus(e.target.value)}
                className="w-full bg-[#FAF5EC] border border-[#e2d6bf] focus:border-[#c5a059] text-[#2A2118] py-2.5 px-3 rounded-xl font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#c5a059]"
              >
                <option value="General Reflection">General Reflection</option>
                <option value="Book Meditation">Book Meditation</option>
                <option value="Heart Audit Correction">Heart Audit Correction</option>
                <option value="Anger Repentance">Anger Repentance</option>
                <option value="Gossip complaining Fast">Gossip grumbling Fast</option>
                <option value="Bitterness Release">Bitterness Release</option>
                <option value="Worry Trust transition">Worry Trust transition</option>
                <option value="Prides humbling">Prides humbling</option>
              </select>
            </div>

            {/* Reflection text */}
            <div className="space-y-1.5" id="reflection-body">
              <label className="text-xs uppercase font-mono text-[#6D5C4E] tracking-wider block font-bold">
                Daily Awareness & Actions Reflection
              </label>
              <textarea
                rows={5}
                placeholder="Where did I drift today? Did I let irritation flare or criticize someone? How did it affect others?"
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                className="w-full p-4 bg-[#FAF5EC] border border-[#e2d6bf] focus:border-[#c5a059] text-[#2A2118] rounded-2xl text-sm font-sans outline-none leading-relaxed placeholder-[#908070] focus:ring-1 focus:ring-[#c5a059]"
              />
            </div>

            {/* Prayer Box */}
            <div className="space-y-1.5" id="prayer-body">
              <label className="text-xs uppercase font-mono text-[#6D5C4E] tracking-wider block font-bold">
                My Sincere Surrender Prayer
              </label>
              <textarea
                rows={4}
                placeholder="Lord Jesus, forgive me for taking the bait of anger/pride today. I lay my ego down..."
                value={prayerNotes}
                onChange={(e) => setPrayerNotes(e.target.value)}
                className="w-full p-4 bg-[#FAF5EC] border border-[#e2d6bf] focus:border-[#c5a059] text-[#2A2118] outline-none rounded-2xl text-sm font-serif italic leading-relaxed placeholder-[#908070] focus:ring-1 focus:ring-[#c5a059]"
              />
            </div>

            {/* Gratitude Points (Resurrection Mindset Trainer) */}
            <div className="space-y-3 p-4 bg-[#FAF5EC] rounded-2xl border border-[#e2d6bf]" id="gratitude-points-trainer">
              <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-[0.15em] block font-bold">
                Gratitude Trainer: 3 Things I Praise Jesus For Today
              </span>
              <div className="space-y-2 font-sans">
                <input
                  type="text"
                  placeholder="1. e.g. A safe commute, a gentle answer to my partner..."
                  value={gratitude1}
                  onChange={(e) => setGratitude1(e.target.value)}
                  className="w-full py-1.5 px-3 bg-white border border-[#e2d6bf] focus:border-[#c5a059] outline-none text-[#2A2118] rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="2. e.g. The beauty of Ephesians 6 security..."
                  value={gratitude2}
                  onChange={(e) => setGratitude2(e.target.value)}
                  className="w-full py-1.5 px-3 bg-white border border-[#e2d6bf] focus:border-[#c5a059] outline-none text-[#2A2118] rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="3. e.g. Fresh peace inside my raw emotions..."
                  value={gratitude3}
                  onChange={(e) => setGratitude3(e.target.value)}
                  className="w-full py-1.5 px-3 bg-white border border-[#e2d6bf] focus:border-[#c5a059] outline-none text-[#2A2118] rounded-lg text-xs"
                />
              </div>
            </div>

            {submitError && (
              <p className="text-xs text-rose-600 font-medium font-sans flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#c5a059] hover:bg-[#b59049] text-white font-extrabold uppercase text-xs tracking-wider font-sans rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              id="submit-journal-log-btn"
            >
              <Save className="w-4 h-4 flex-shrink-0 text-white" />
              <span>Commit Entry to Private Ledger</span>
            </button>
          </form>
        </div>
      </div>

      {/* Right side: History List */}
      <div className="lg:col-span-6 space-y-6" id="journal-history-column">
        {/* Ledger Header & Export button */}
        <div className="flex items-center justify-between gap-4" id="history-panel-header">
          <h3 className="text-xs font-mono text-[#6D5C4E] uppercase tracking-widest pl-2 font-bold">
            My Historic Reflection Ledger
          </h3>
          <button
            onClick={handleExportJournal}
            className="flex items-center text-xs text-[#2A2118] hover:bg-[#FAF5EC] bg-white border border-[#e2d6bf] rounded-xl px-2.5 py-1.5 shadow-sm transition cursor-pointer"
            id="export-journal-btn"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Export Journal (.TXT Book)
          </button>
        </div>

        {/* Search tool inside history */}
        <input
          type="text"
          placeholder="Filter logs by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2.5 px-4 bg-white border border-[#e2d6bf] text-[#2A2118] rounded-xl text-xs focus:outline-none focus:border-[#c5a059]"
        />

        <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1" id="history-items-list-container">
          {filteredEntries.map((e) => (
            <div
              key={e.id}
              className="p-6 bg-white border border-[#e2d6bf] hover:border-[#c5a059] rounded-2xl space-y-5 text-left relative group transition-all"
              id={`history-entry-box-${e.id}`}
            >
              <button
                onClick={() => handleDeleteEntry(e.id)}
                className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-rose-600 bg-white hover:bg-[#FAF5EC] rounded-lg border border-[#e2d6bf] opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                title="Delete entry"
                id={`delete-entry-btn-${e.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-1.5" id={`header-${e.id}`}>
                <div className="flex items-center gap-1.5 text-xs text-[#6D5C4E] font-mono">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#c5a059]" />
                  <span>{e.date}</span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[9px] font-black font-mono uppercase bg-[#FAF5EC] border border-[#e2d6bf] text-[#b59049] px-2.5 py-0.5 rounded-lg font-bold">
                    {e.selectedPatternId || "General"}
                  </span>
                  {e.chapterPromptReviewed && (
                    <span className="text-[10px] font-mono text-[#8A7969] truncate max-w-[200px]">
                      via {e.chapterPromptReviewed}
                    </span>
                  )}
                </div>
              </div>

              {e.reflectionText && (
                <div className="space-y-1.5" id={`reflection-${e.id}`}>
                  <span className="text-[10px] uppercase font-mono text-[#8A7969] block font-bold">
                    Awareness Audit:
                  </span>
                  <p className="text-sm text-[#2A2118] leading-relaxed font-sans whitespace-pre-line">
                    {e.reflectionText}
                  </p>
                </div>
              )}

              {e.prayerNotes && (
                <div className="p-4 bg-[#FAF5EC] border border-[#e2d6bf] rounded-xl space-y-1.5" id={`prayer-${e.id}`}>
                  <span className="text-[10px] uppercase font-mono text-[#c5a059] block font-bold tracking-wider">
                    Combat Prayer of Surrender:
                  </span>
                  <p className="text-sm font-serif italic text-[#4A3E30] leading-relaxed whitespace-pre-line">
                    {e.prayerNotes}
                  </p>
                </div>
              )}

              {e.gratitudePoints.length > 0 && (
                <div className="space-y-2 p-3 bg-[#FAF5EC]/50 border border-[#e2d6bf] rounded-xl" id={`gratitude-${e.id}`}>
                  <span className="text-[10px] uppercase font-mono text-[#8A7969] block font-bold tracking-widest">
                    Gratitudes of Life:
                  </span>
                  <div className="grid gap-1.5" id={`grats-${e.id}`}>
                    {e.gratitudePoints.map((gp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-[#4A3E30] font-sans">
                        <Check className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0 mt-0.5" />
                        <span>{gp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="py-12 bg-white rounded-3xl border border-dashed border-[#e2d6bf] text-[#8A7969] font-serif text-center italic" id="empty-journal-list">
              Journal is currently empty. Pen a reflection or log a prayer to begin tracking coordinates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
