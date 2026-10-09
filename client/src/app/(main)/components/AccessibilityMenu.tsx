"use client";

import { useState } from "react";
import { RiAccessibilityLine } from "react-icons/ri";


export default function AccessibilityMenu() {
  /* Declare State Variables */
  const [menuOpen, setMenuOpen] = useState(false);
  const [textSizeLevel, setTextSizeLevel] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [textSpacing, setTextSpacing] = useState(false);



  /* Function to toggle bigger text */
  const changeTextSize = (direction: "increase" | "decrease") => {
  setTextSizeLevel((currentLevel) => {
    let newLevel = currentLevel;

    if (direction === "increase") {
      newLevel = Math.min(currentLevel + 1, 3);
    } else {
      newLevel = Math.max(currentLevel - 1, 0);
    }

    document.documentElement.setAttribute(
      "data-accessibility-text-size",
      newLevel.toString()
    );

    return newLevel;
  });
  };

  /* Function to toggle high contrast */
  const toggleHighContrast = () => {
  const newValue = !highContrast;

  setHighContrast(newValue);

  document.documentElement.classList.toggle(
    "accessibility-high-contrast",
    newValue
   );
 };

 /* Function to toggle highlight links */
 const toggleHighlightLinks = () => {
  const newValue = !highlightLinks;

  setHighlightLinks(newValue);

  document.documentElement.classList.toggle(
    "accessibility-highlight-links",
    newValue
  );
};

/* Function to toggle text spacing */
const toggleTextSpacing = () => {
  const newValue = !textSpacing;

  setTextSpacing(newValue);

  document.documentElement.classList.toggle(
    "accessibility-text-spacing",
    newValue
  );
};

  /* Render the Accessibility Menu */
  return (
  <div className="fixed bottom-10 left-5 z-50">

    {/* Accessibility options */}
{menuOpen && (
  <div className="mb-2 flex flex-col gap-2 bg-white p-3 rounded-lg shadow-lg min-w-36">

    {/* Text Size controls */}
    <div className="flex flex-row items-center justify-between gap-1.5 w-full">
      <button
        type="button"
        onClick={() => changeTextSize("decrease")}
        disabled={textSizeLevel === 0}
        aria-label="Decrease text size"
        className="w-9 h-9 shrink-0 rounded-full bg-primary text-white font-bold disabled:opacity-40"
      >
        −
      </button>

      <span className="text-sm font-medium text-neutral-900 whitespace-nowrap">
        Text Size {textSizeLevel}/3
      </span>

      <button
        type="button"
        onClick={() => changeTextSize("increase")}
        disabled={textSizeLevel === 3}
        aria-label="Increase text size"
        className="w-9 h-9 shrink-0 rounded-full bg-primary text-white font-bold disabled:opacity-40"
      >
        +
      </button>
    </div>

    {/* High Contrast */}
    <button
      type="button"
      onClick={toggleHighContrast}
      aria-pressed={highContrast}
      className="bg-primary text-white px-3 py-2 rounded-full font-medium transition-opacity hover:opacity-90"
    >
      {highContrast ? "Normal Contrast" : "High Contrast"}
    </button>

    {/* Highlight Links */}
    <button
      type="button"
      onClick={toggleHighlightLinks}
      aria-pressed={highlightLinks}
      className="bg-primary text-white px-3 py-2 rounded-full font-medium transition-opacity hover:opacity-90"
    >
      {highlightLinks ? "Normal Links" : "Highlight Links"}
    </button>

    {/* Text Spacing */}
    <button
      type="button"
      onClick={toggleTextSpacing}
      aria-pressed={textSpacing}
      className="bg-primary text-white px-3 py-2 rounded-full font-medium transition-opacity hover:opacity-90"
    >
      {textSpacing ? "Normal Spacing" : "Text Spacing"}
    </button>

  </div>
)}


    {/* Main accessibility button */}
    <button
    type="button"
    onClick={() => setMenuOpen(!menuOpen)}
    aria-expanded={menuOpen}
    aria-label="Accessibility options"
    title="Accessibility options"
    className="
      w-12 h-12
    rounded-full
    bg-primary
    shadow-lg
    flex items-center justify-center
    hover:scale-105
    transition-transform">
      <RiAccessibilityLine size={40} color="white" />
    </button>

  </div>
);



}