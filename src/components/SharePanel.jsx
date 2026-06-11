/**
 * useScreenshot.js
 *
 * Wraps html2canvas to capture a DOM node as a PNG and either
 * download it or share it via the Web Share API.
 *
 * status: "idle" | "capturing" | "done" | "error"
 * canShare: boolean — true if navigator.share + files are supported
 */

import { useState, useCallback } from "react";

const FILENAME = "wc2026-bracket.png";

// ─────────────────────────────────────────────────────────────
// CANVAS CAPTURE
// ─────────────────────────────────────────────────────────────

async function captureElement(element) {
  const html2canvas = (await import("html2canvas")).default;

  // Measure the element's true rendered size including any overflow
  // (the bracket uses absolute positioning that can exceed offsetHeight)
  const rect = element.getBoundingClientRect();

  // scrollHeight / scrollWidth capture content that overflows
  const w = element.scrollWidth;
  const h = element.scrollHeight;

  const canvas = await html2canvas(element, {
    scale:           2,           // retina quality
    useCORS:         true,
    logging:         false,
    backgroundColor: "#050f0a",   // explicit bg — never transparent/black
    // Tell html2canvas the exact dimensions to capture
    width:           w,
    height:          h,
    // windowWidth forces layout at the panel width, not the viewport width,
    // so nothing reflows when the panel is off-screen
    windowWidth:     element.scrollWidth,
    windowHeight:    element.scrollHeight,
    // x/y relative to the element itself — not the page
    x: 0,
    y: 0,
    // Prevent html2canvas from trying to scroll to the element
    scrollX: 0,
    scrollY: 0,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("canvas.toBlob returned null"));
      },
      "image/png",
      1.0
    );
  });
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href          = url;
  a.download      = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 1000);
}

// ─────────────────────────────────────────────────────────────
// FEATURE DETECT
// ─────────────────────────────────────────────────────────────

function detectCanShare() {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  if (!navigator.canShare) return false;
  try {
    return navigator.canShare({
      files: [new File([""], "test.png", { type: "image/png" })],
    });
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useScreenshot(ref) {
  const [status, setStatus] = useState("idle");
  const canShare = detectCanShare();

  function flashDone() {
    setStatus("done");
    setTimeout(() => setStatus("idle"), 2500);
  }

  const download = useCallback(async () => {
    if (!ref.current || status === "capturing") return;
    setStatus("capturing");
    try {
      const blob = await captureElement(ref.current);
      triggerDownload(blob, FILENAME);
      flashDone();
    } catch (err) {
      console.error("[useScreenshot] download error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [ref, status]);

  const share = useCallback(async () => {
    if (!ref.current || status === "capturing") return;
    setStatus("capturing");
    try {
      const blob = await captureElement(ref.current);
      const file = new File([blob], FILENAME, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My WC 2026 Bracket",
          text:  "Check out my 2026 FIFA World Cup bracket prediction!",
        });
      } else {
        triggerDownload(blob, FILENAME);
      }
      flashDone();
    } catch (err) {
      if (err?.name === "AbortError") {
        setStatus("idle");
        return;
      }
      console.error("[useScreenshot] share error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [ref, status]);

  return { download, share, status, canShare };
}