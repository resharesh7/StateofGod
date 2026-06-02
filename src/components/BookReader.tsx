/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Share2, CornerDownRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BOOK_CHAPTERS } from "../data";
import { BookChapter } from "../types";

interface BookReaderProps {
  onWriteInJournal: (promptText: string, chapterTitle: string) => void;
}

export default function BookReader({ onWriteInJournal }: BookReaderProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showChapterSelect, setShowChapterSelect] = useState(false);
  const [textSize, setTextSize] = useState<"sm" | "base" | "lg" | "xl">("lg");
  const [copiedChapterId, setCopiedChapterId] = useState<string | null>(null);

  const activeChapter: BookChapter = BOOK_CHAPTERS[activeChapterIndex];

  const handleNextChapter = () => {
    if (activeChapterIndex < BOOK_CHAPTERS.length - 1) {
      setActiveChapterIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      setActiveChapterIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCopyQuote = (text: string, source: string) => {
    navigator.clipboard.writeText(`"${text}" - ${source}`);
    setCopiedChapterId(activeChapter.id);
    setTimeout(() => setCopiedChapterId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn" id="book-reader-container">
      {/* Editorial Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-5 bg-[#FAF5EC] border border-[#e2d6bf] rounded-2xl shadow-sm" id="reader-settings-bar">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowChapterSelect(!showChapterSelect)}
            className="flex items-center space-x-2 px-3.5 py-2 text-sm bg-white hover:bg-[#FAF5EC] border border-[#e2d6bf] active:bg-[#f3e9d4] rounded-xl text-[#2A2118] transition-colors"
            id="chapter-menu-trigger"
          >
            <BookOpen className="w-4 h-4 flex-shrink-0 text-[#c5a059]" />
            <span className="font-serif italic font-medium text-[#4A3E39]">
              Chapter {activeChapter.chapterNumber}: {activeChapter.title}
            </span>
          </button>
        </div>

        {/* Text Sizing Controls */}
        <div className="flex items-center space-x-2 text-[#6D5C4E]" id="text-size-controls">
          <span className="text-xs font-mono select-none tracking-wider text-[#8A7969]">TEXT:</span>
          {([
            { label: "A-", size: "sm" },
            { label: "Normal", size: "base" },
            { label: "Large", size: "lg" },
            { label: "Extra", size: "xl" }
          ] as const).map(({ label, size }) => (
            <button
              key={size}
              onClick={() => setTextSize(size)}
              className={`px-3 py-1 text-xs rounded-lg transition-all font-serif ${
                textSize === size
                  ? "bg-[#c5a059] text-white font-extrabold shadow-sm"
                  : "bg-white text-[#2A2118] border border-[#e2d6bf] hover:bg-[#FAF5EC]"
              }`}
              id={`size-btn-${size}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Selection Panel */}
      <AnimatePresence>
        {showChapterSelect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-white border border-[#e2d6bf] rounded-2xl shadow-md space-y-4 text-[#2A2118]"
            id="chapter-select-dropdown"
          >
            <h3 className="text-xs font-mono text-[#8A7969] uppercase tracking-widest font-bold">
              Table of Contents
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {BOOK_CHAPTERS.map((chap, idx) => (
                <button
                  key={chap.id}
                  onClick={() => {
                    setActiveChapterIndex(idx);
                    setShowChapterSelect(false);
                  }}
                  className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                    activeChapterIndex === idx
                      ? "bg-[#FAF5EC] border-[#c5a059] text-[#2A2118]"
                      : "bg-white border-[#e2d6bf] hover:bg-[#FAF5EC]"
                  }`}
                  id={`chapter-select-option-${chap.chapterNumber}`}
                >
                  <span className="text-xs font-mono uppercase text-[#c5a059] font-bold">
                    Chapter {chap.chapterNumber}
                  </span>
                  <span className="font-serif font-bold text-base mt-1 leading-tight text-[#2A2118]">
                    {chap.title}
                  </span>
                  <span className="text-xs text-[#6D5C4E] font-sans mt-1 line-clamp-1">
                    {chap.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Frame */}
      <div className="bg-[#FCFBF8] border-2 border-[#e8dec7] rounded-3xl p-8 sm:p-12 md:p-16 shadow-lg min-h-[500px] flex flex-col justify-between text-[#2A2118]" id="literary-book-frame">
        
        {/* Book Header Label */}
        <div className="text-center pb-8 border-b border-[#e8dec7]" id="book-frame-header">
          <span className="text-[10px] font-mono whitespace-nowrap uppercase tracking-[0.4em] text-[#8A7969] font-bold">
            STATE OF AWARENESS IN GOD
          </span>
        </div>

        {/* Dynamic Chapter Content */}
        <div className="py-8" id="book-active-chapter-body">
          <span className="text-xs font-mono text-[#c5a059] uppercase font-bold block text-center tracking-[0.3em] mb-3">
            0{activeChapter.chapterNumber} / CHAPTER
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-center text-[#2A2118] max-w-2xl mx-auto uppercase leading-tight tracking-tight" id="chapter-main-title">
            {activeChapter.title}
          </h1>
          <p className="text-sm italic font-serif text-center text-[#c5a059] mt-4 max-w-xl mx-auto h-[24px]" id="chapter-subtitle">
            {activeChapter.subtitle}
          </p>

          {/* Epigraph Quote Block */}
          {activeChapter.quote && (
            <div className="my-10 max-w-xl mx-auto p-6 bg-[#FAF5EC] rounded-2xl border-l-4 border-[#c5a059] relative" id="chapter-quote-block">
              <Quote className="absolute -top-3 -left-1 w-6 h-6 text-[#e8dec7] transform scale-x-[-1] opacity-60" />
              <p className="font-serif italic text-[#4A3E30] text-base leading-relaxed">
                "{activeChapter.quote}"
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-mono text-[#8A7969] uppercase tracking-widest block font-bold">
                  {activeChapter.quoteSource}
                </span>
                <button
                  onClick={() => handleCopyQuote(activeChapter.quote, activeChapter.quoteSource)}
                  className="flex items-center text-xs text-[#8A7969] hover:text-[#c5a059] transition-all"
                  title="Copy quote"
                  id={`copy-quote-btn-${activeChapter.id}`}
                >
                  <Share2 className="w-3.5 h-3.5 mr-1" />
                  {copiedChapterId === activeChapter.id ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {/* Core Text Sections with Drop CAP */}
          <div className="space-y-8 mt-12 max-w-2xl mx-auto text-[#2A2118]" id="chapter-text-sections">
            {activeChapter.sections.map((section, idx) => {
              const textClass = 
                textSize === "sm" ? "text-sm leading-relaxed text-[#352B20]" :
                textSize === "base" ? "text-base leading-relaxed text-[#2A2118]" :
                textSize === "lg" ? "text-lg leading-relaxed font-sans font-light text-[#2A2118]" :
                "text-xl leading-relaxed font-sans font-light text-[#2A2118]";

              return (
                <div key={idx} className="space-y-4" id={`text-section-${idx}`}>
                  <h3 className="font-serif font-black uppercase text-lg italic text-[#c5a059] border-b border-[#e8dec7] pb-1 flex items-center gap-2">
                    <CornerDownRight className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                    {section.heading}
                  </h3>
                  {section.paragraphs.map((para, pIdx) => {
                    // Dropcap on first paragraph of first section
                    if (idx === 0 && pIdx === 0) {
                      const firstChar = para.charAt(0);
                      const restText = para.substring(1);
                      return (
                        <p key={pIdx} className={textClass}>
                          <span className="float-left text-5xl sm:text-6xl font-serif font-black pr-3 pt-1 text-[#c5a059] leading-[0.8] select-none scale-y-95">
                            {firstChar}
                          </span>
                          {restText}
                        </p>
                      );
                    }
                    return (
                      <p key={pIdx} className={textClass}>
                        {para}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Key Verse Highlight Callout */}
          <div className="mt-14 max-w-2xl mx-auto p-6 bg-[#FAF5EC] border border-[#e8dec7] rounded-2xl space-y-3" id="active-key-verse">
            <span className="text-[10px] font-mono uppercase text-[#c5a059] font-bold tracking-[0.2em] block">
              Key Scripture Focus
            </span>
            <p className="font-serif italic text-[#4A3E30] text-lg leading-relaxed">
              "{activeChapter.keyScripture.text}"
            </p>
            <span className="text-xs font-mono font-bold text-[#c5a059] block tracking-wider">
              — {activeChapter.keyScripture.reference}
            </span>
          </div>

          {/* Prompt Interaction Module */}
          <div className="mt-14 max-w-2xl mx-auto p-8 bg-white border border-[#e8dec7] rounded-3xl text-center space-y-4" id="chapter-reflection-prompt-card">
            <h4 className="font-serif text-xl font-bold uppercase text-[#2A2118] tracking-tight">
              Interactive Meditation Reflection
            </h4>
            <p className="text-[#6D5C4E] text-sm italic max-w-lg mx-auto">
              "{activeChapter.reflectionPrompt}"
            </p>
            <div className="pt-2">
              <button
                onClick={() => onWriteInJournal(activeChapter.reflectionPrompt, activeChapter.title)}
                className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#b59049] text-white font-extrabold uppercase text-xs tracking-wider font-sans transition-all duration-300 shadow-md rounded-xl cursor-pointer"
                id="chapter-journal-btn"
              >
                Pen Reflection in Journal
              </button>
            </div>
          </div>
        </div>

        {/* Book Footer Pagination */}
        <div className="flex items-center justify-between pt-8 border-t border-[#e8dec7] text-[#6D5C4E] mt-12" id="book-frame-footer">
          <button
            onClick={handlePrevChapter}
            disabled={activeChapterIndex === 0}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition ${
              activeChapterIndex === 0
                ? "opacity-20 cursor-not-allowed text-[#8A7969]"
                : "hover:bg-[#FAF5EC] hover:text-[#2A2118]"
            }`}
            id="prev-chapter-btn"
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
            <span className="font-sans font-medium">Prev Chapter</span>
          </button>

          <span className="text-xs font-mono text-[#8A7969]">
            {activeChapterIndex + 1} of {BOOK_CHAPTERS.length}
          </span>

          <button
            onClick={handleNextChapter}
            disabled={activeChapterIndex === BOOK_CHAPTERS.length - 1}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition ${
              activeChapterIndex === BOOK_CHAPTERS.length - 1
                ? "opacity-20 cursor-not-allowed text-[#8A7969]"
                : "hover:bg-[#FAF5EC] hover:text-[#2A2118]"
            }`}
            id="next-chapter-btn"
          >
            <span className="font-sans font-medium">Next Chapter</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
