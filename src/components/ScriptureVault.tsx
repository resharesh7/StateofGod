/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Flame, RefreshCw, Copy, Book, Heart, ArrowRight } from "lucide-react";

export interface VaultItem {
  id: string;
  category: "all" | "anger" | "resentment" | "worry" | "apathy" | "pride";
  negativeThought: string;
  positivePivot: string;
  scriptureRef: string;
  scriptureText: string;
  affirmation: string;
}

export const VAULT_ITEMS: VaultItem[] = [
  {
    id: "v1",
    category: "anger",
    negativeThought: "They did this on purpose to ruin my schedule. I have every single right to snap at them!",
    positivePivot: "Choose mercy over convenience. A reaction of anger destroys peace, but custom tolerance conquers conflict.",
    scriptureRef: "Proverbs 16:32",
    scriptureText: "Better a patient person than a warrior, one with self-control than one who takes a city.",
    affirmation: "I surrender my timeline to Jesus. Snapping is a sign of weakness, but patient self-control manifests Christ's real authority today."
  },
  {
    id: "v2",
    category: "worry",
    negativeThought: "What if everything fails? Everything is collapsing, and I must micromanage everyone to prevent danger.",
    positivePivot: "Sovereign care. God commands you to lay down playing the regulator of the cosmos.",
    scriptureRef: "Isaiah 26:3",
    scriptureText: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
    affirmation: "Jesus holds my family, my health, and my future. I resign as director of outcomes and receive perfect peace."
  },
  {
    id: "v3",
    category: "resentment",
    negativeThought: "They wounded my reputation. I will shut them out, cold-shoulder them, and never let them see my grace.",
    positivePivot: "Forgiveness clears your own atmosphere. Carrying a grudge is like drinking poison and waiting for others to perish.",
    scriptureRef: "Ephesians 4:31-32",
    scriptureText: "Get rid of all bitterness, rage and anger, brawling and slander, along with every form of malice. Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
    affirmation: "I wipe the relational debt slate clean today. I am massive forgiven, and I release them to establish my private peace in God."
  },
  {
    id: "v4",
    category: "apathy",
    negativeThought: "I am way too exhausted to pray or open the Bible. Scrolling feed is my rest; I have no spiritual energy.",
    positivePivot: "True rest comes from the Creator. Digital distraction feeds exhaustion, but Abiding in Christ feeds energy.",
    scriptureRef: "Isaiah 40:29-31",
    scriptureText: "He gives strength to the weary and increases the power of the weak... those who hope in the Lord will renew their strength.",
    affirmation: "I exchange empty pixels for living springs. Five deep minutes with Jesus is my primary true energy source."
  },
  {
    id: "v5",
    category: "pride",
    negativeThought: "Why is everyone so slow and incompetent? How can they keep making mistakes? I must critique them immediately.",
    positivePivot: "Grace-first gaze. Inspect your own towering failures before criticizing another person's splinters.",
    scriptureRef: "Philippians 2:3",
    scriptureText: "Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves.",
    affirmation: "I am a recipient of daily grace. I trade my critical microscope for a server towel, lifting others up."
  },
  {
    id: "v6",
    category: "anger",
    negativeThought: "If I don't raise my voice, nobody will respect me or listen to what I am ordering.",
    positivePivot: "A calm presence has absolute authority. Shouting screams weakness; gentleness speaks strength.",
    scriptureRef: "Proverbs 15:1",
    scriptureText: "A gentle answer turns away wrath, but a harsh word stirs up anger.",
    affirmation: "I reject shouting. I speak with gentle, quiet authority that commands peace in my environment."
  },
  {
    id: "v7",
    category: "worry",
    negativeThought: "This health scare/financial delay is catastrophic. It is all over for me.",
    positivePivot: "God works inside delays. Every brick in the road is a dynamic diagnostic scaffolding.",
    scriptureRef: "Philippians 4:19",
    scriptureText: "And my God will meet all your needs according to the riches of his glory in Christ Jesus.",
    affirmation: "My supply is not tied to earthly vaults. I am kept under secure heavenly provision."
  },
  {
    id: "v8",
    category: "pride",
    negativeThought: "I am too embarrassed to apologize. If I admit I snapped first, they will think I am weak.",
    positivePivot: "Apology is core divine strength. Weak souls justify everything, but strong souls repent easily.",
    scriptureRef: "James 4:10",
    scriptureText: "Humble yourselves before the Lord, and he will lift you up.",
    affirmation: "My security is hidden in Christ's love, not my perfect performance. I repent quickly and stay free."
  }
];

export default function ScriptureVault() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<VaultItem["category"]>("all");
  const [expandedId, setExpandedId] = useState<string | null>("v1");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAffirmation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredItems = VAULT_ITEMS.filter((item) => {
    const matchesSearch =
      item.negativeThought.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.affirmation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scriptureText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-[#2A2118]" id="scripture-vault-section">
      <div className="text-center space-y-3" id="vault-header">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c5a059] font-bold block">
          Renewing of the Mind Lab
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-black uppercase text-[#2A2118] scale-y-95 leading-none">
          Mind Renewal Scripture Vault
        </h2>
        <p className="text-sm text-[#6D5C4E] max-w-xl mx-auto leading-relaxed font-sans">
          Tackle automatic negative thoughts by applying targeted biblical pivots. Speak Christ's truth to interrupt fleshly patterns.
        </p>
      </div>

      {/* Search and Navigation */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between py-4 px-5 bg-white border border-[#e2d6bf] rounded-2xl shadow-sm" id="vault-filter-controls">
        <div className="relative w-full md:max-w-xs" id="search-box-wrapper">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7969]" />
          <input
            type="text"
            placeholder="Search negative thoughts or verses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF5EC] border border-[#e2d6bf] text-[#2A2118] focus:border-[#c5a059] outline-none rounded-xl text-xs"
          />
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5" id="category-tabs">
          {([
            { label: "All Vaults", id: "all" },
            { label: "Anger", id: "anger" },
            { label: "Resentment", id: "resentment" },
            { label: "Anxieties", id: "worry" },
            { label: "Apathy", id: "apathy" },
            { label: "Pride & Ego", id: "pride" }
          ] as const).map(({ label, id }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                selectedCategory === id
                  ? "bg-[#c5a059] text-white font-bold shadow-sm"
                  : "bg-white text-[#4A3E30] hover:bg-[#FAF5EC] border border-[#e2d6bf]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Dynamic Thought Pivots */}
      <div className="grid md:grid-cols-2 gap-5" id="vault-items-grid">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className={`bg-white border rounded-3xl p-6 text-left cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isExpanded
                  ? "border-[#c5a059] bg-[#FAF5EC]/30 shadow-md"
                  : "border-[#e2d6bf] hover:border-[#c5a059] hover:bg-[#FAF5EC]/10"
              }`}
              id={`vault-card-${item.id}`}
            >
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between" id="card-tag-header">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#b59049] bg-[#FAF5EC] px-2.5 py-0.5 rounded border border-[#e2d6bf] font-bold">
                    {item.category}
                  </span>
                  <span className="text-xs text-[#8A7969] font-mono">
                    {isExpanded ? "Collapse" : "Tap to Expand"}
                  </span>
                </div>

                {/* The Catastrophe */}
                <div className="space-y-1.5" id="negative-thought-block">
                  <span className="text-[10px] font-mono text-rose-600 tracking-wider uppercase block font-bold">
                    Negative Default Pattern Thought:
                  </span>
                  <p className="font-sans text-sm font-medium text-[#2A2118] italic">
                    "{item.negativeThought}"
                  </p>
                </div>

                {isExpanded && (
                  <div className="space-y-4 pt-4 border-t border-[#e2d6bf]" id="expanded-detail-container">
                    
                    {/* The Pivot */}
                    <div className="flex items-start gap-2.5">
                      <RefreshCw className="w-5 h-5 text-[#c5a059] flex-shrink-0 mt-0.5 animate-spin-slow" />
                      <div>
                        <span className="text-[10px] font-mono text-[#c5a059] font-bold uppercase tracking-widest block">
                          Divine Awareness Pivot:
                        </span>
                        <p className="text-[#4A3E30] text-sm font-sans font-light mt-0.5">
                          {item.positivePivot}
                        </p>
                      </div>
                    </div>

                    {/* Scripture Text */}
                    <div className="bg-white p-4 rounded-xl border border-[#e2d6bf] space-y-1">
                      <p className="font-serif italic text-[#4A3E30] text-base leading-relaxed">
                        "{item.scriptureText}"
                      </p>
                      <span className="text-xs font-mono font-bold text-[#c5a059] flex items-center gap-1 mt-1">
                        <Book className="w-3 h-3 text-[#c5a059]" />
                        — {item.scriptureRef}
                      </span>
                    </div>

                    {/* Affirmation */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-[#8A7969] uppercase tracking-widest block font-bold">
                        Mind Renewal Daily Affirmation:
                      </span>
                      <p className="text-[#2A2118] font-serif font-light text-sm leading-relaxed border-l-2 border-[#c5a059]/50 pl-3 italic">
                        "{item.affirmation}"
                      </p>
                    </div>

                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="mt-6 pt-4 border-t border-[#e2d6bf] flex items-center justify-end" id="expanded-card-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAffirmation(item.affirmation, item.id);
                    }}
                    className="flex items-center text-[10px] uppercase font-mono font-extrabold tracking-widest py-2 px-3.5 bg-[#c5a059] hover:bg-[#b59049] text-white rounded-xl transition-all shadow-sm cursor-pointer"
                    id={`copy-aff-btn-${item.id}`}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5 text-white" />
                    {copiedId === item.id ? "Copied" : "Copy Affirmation"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-12 text-center text-[#8A7969] font-serif italic" id="no-filtered-items">
          No mind-renewal points match your current filter criteria. Try adjusting keywords.
        </div>
      )}
    </div>
  );
}
