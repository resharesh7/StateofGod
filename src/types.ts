/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChapterSection {
  heading: string;
  paragraphs: string[];
}

export interface BookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  quote: string;
  quoteSource: string;
  sections: ChapterSection[];
  reflectionPrompt: string;
  keyScripture: {
    reference: string;
    text: string;
  };
}

export interface NegativePattern {
  id: string;
  name: string;
  impactType: string;
  description: string;
  symptoms: string[];
  howItImpactsOthers: string;
  biblicalRoot: string;
  scriptures: {
    reference: string;
    text: string;
  }[];
  armorWeapon: string; // matches with a piece of Ephesians 6 armor
  renewalStrategy: string[];
  renewalPrayer: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  selectedPatternId?: string;
  reflectionText: string;
  prayerNotes: string;
  chapterPromptReviewed?: string;
  gratitudePoints: string[];
}

export interface ArmorPiece {
  id: string;
  name: string;
  description: string;
  howToEquip: string;
  spiritualCounteract: string; // which negative patterns it defeats
  biblicalReference: string;
  biblicalText: string;
}
