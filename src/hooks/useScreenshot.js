/**
 * useScreenshot.js
 *
 * Wraps html2canvas to capture a DOM node as a PNG and either
 * download it or share it via the Web Share API.
 *
 * Usage:
 *   const { download, share, status, canShare } = useScreenshot(ref);
 *
 * status: "idle" | "capturing" | "done" | "error"
 * canShare: boolean — true if navigator.share + files are supported
 */

import { useState, useCallback } from "react";

const FILENAME = "wc2026-bracket.png";

// ─────────────────────────────────────────────────────────────
// CANVAS CAPTURE
// ─────────────────────────────────────────────────────────────

/**
 * Runs html2canvas on the given element and returns a Blob.
 * We import html2canvas lazily (dynamic import) so it doesn't
 * bloat the initial bundle.
 */
async function captureElement(element) {
  const html2canvas = (await import("html2canvas")).default;

  const canvas = await html2canvas(element, {
    // Retina quality
    scale: 2,
    // Allow cross-origin images (flag SVGs if added later)
    useCORS: true,
    // Logging off in production
    logging: false,
    // Use the element's own background — don't let h2c override it
    backgroundColor: null,
    // Capture the full element even if it extends beyond the viewport
    scrollX: 0,
    scrollY: 0,
    // Fix pixel rounding on high-dpi screens
    x: 0,
    y: 0,
    width:  element.offsetWidth,
    height: element.offsetHeight,
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

function blobToObjectURL(blob) {
  return URL.createObjectURL(blob);
}

function triggerDownload(blob, filename) {
  const url = blobToObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  // Cleanup after a short delay so the download has time to start
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 1000);
}

// ─────────────────────────────────────────────────────────────
// FEATURE DETECT
// ─────────────────────────────────────────────────────────────

/**
 * Returns true if the browser supports sharing files via
 * navigator.share — available on Safari (iOS/macOS 15+) and Chrome
 * on Android. Desktop Chrome does NOT support sharing files.
 */
function detectCanShare() {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  // navigator.canShare requires a test object to check file support
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
  const [status, setStatus] = useState("idle"); // "idle"|"capturing"|"done"|"error"
  const canShare = detectCanShare();

  // Reset to idle after showing "done" for 2.5 s
  function flashDone() {
    setStatus("done");
    setTimeout(() => setStatus("idle"), 2500);
  }

  /**
   * Capture → download PNG
   */
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

  /**
   * Capture → Web Share API (falls back to download if unsupported)
   */
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
        // Fallback: just download
        triggerDownload(blob, FILENAME);
      }
      flashDone();
    } catch (err) {
      // AbortError = user cancelled the share sheet — not a real error
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