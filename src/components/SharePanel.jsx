/**
 * SharePanel.jsx
 *
 * A self-contained 1200px-wide panel that html2canvas captures
 * to produce the shareable bracket PNG.
 *
 * POSITIONING STRATEGY
 * --------------------
 * The panel lives inside a zero-size `overflow:hidden` wrapper that
 * is `position:absolute; left:0; top:0` so it does not affect page
 * layout and is not visible to the user.
 *
 * We deliberately avoid `position:fixed` because html2canvas uses
 * getBoundingClientRect() to locate the element; a fixed element at
 * left:-9999px causes html2canvas to try to scroll the viewport,
 * producing misaligned captures.
 *
 * We also avoid `display:none` / `visibility:hidden` because
 * html2canvas cannot capture invisible elements.
 *
 * LAYOUT APPROACH
 * ---------------
 * Everything in this panel uses explicit inline styles (no Tailwind)
 * so rendering is 100% predictable under html2canvas, which re-lays
 * out the DOM internally. Tailwind utility classes that reference
 * CSS custom properties (e.g. bg-pitch-900) work fine in the live
 * app because the browser resolves them to computed RGB values, but
 * we avoid relying on that in the screenshot panel for safety.
 *
 * BRACKET SECTION
 * ---------------
 * We render BracketView directly. Its child elements use inline
 * style pixel dimensions (no Tailwind for sizing), so they capture
 * correctly. We force completedGroups=12 and thirdPlaceCount=8 so
 * BracketView never renders the locked overlay.
 */

import { forwardRef } from "react";
import BracketView from "./BracketView";
import { GROUPS } from "../data/teams";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const PANEL_W = 1200;
const BG      = "#050f0a";
const BG_CARD = "#0a1f14";
const BG_HDR  = "#0f2e1d";
const BORDER  = "#164026";

// ─────────────────────────────────────────────────────────────
// RANK STYLES
// ─────────────────────────────────────────────────────────────

const RANK_STYLES = [
  { bg: "#16a34a1a", text: "#4ade80", border: "#16a34a44" }, // 1st — green
  { bg: "#0d94801a", text: "#2dd4bf", border: "#0d948044" }, // 2nd — teal
  { bg: "#d977061a", text: "#fbbf24", border: "#d9770644" }, // 3rd — amber
];

// ─────────────────────────────────────────────────────────────
// GROUP RESULTS GRID
// ─────────────────────────────────────────────────────────────

function GroupResultsGrid({ groupStage }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
        padding: "12px 24px 16px",
      }}
    >
      {GROUPS.map((g) => {
        const { teams, advancers } = groupStage[g];
        return (
          <div
            key={g}
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            {/* Group label */}
            <div
              style={{
                background: BG_HDR,
                borderBottom: `1px solid ${BORDER}`,
                padding: "5px 10px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#ffffff",
                lineHeight: "16px",
              }}
            >
              Group {g}
            </div>

            {/* Team rows — explicit lineHeight to prevent clipping */}
            {teams.map((team, ti) => {
              const rankIdx     = advancers.indexOf(team.id);
              const isRanked    = rankIdx >= 0;
              const isEliminated = advancers.length === 3 && !isRanked;
              const rs          = isRanked ? RANK_STYLES[rankIdx] : null;

              return (
                <div
                  key={team.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    height: 26,
                    boxSizing: "border-box",
                    background: rs ? rs.bg : "transparent",
                    borderBottom: ti < teams.length - 1 ? `1px solid ${BG_HDR}` : "none",
                    opacity: isEliminated ? 0.35 : 1,
                  }}
                >
                  {/* Flag */}
                  <span
                    style={{
                      fontSize: 12,
                      lineHeight: "18px",
                      width: 18,
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {team.flag}
                  </span>

                  {/* Name */}
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      lineHeight: "18px",
                      color: rs ? rs.text : "#9ca3af",
                      flex: 1,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {team.name}
                  </span>

                  {/* Rank badge */}
                  {isRanked && (
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: "16px",
                        color: rs.text,
                        background: rs.bg,
                        border: `1px solid ${rs.border}`,
                        borderRadius: 3,
                        padding: "0 4px",
                        flexShrink: 0,
                      }}
                    >
                      {rankIdx + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SHARE PANEL
// ─────────────────────────────────────────────────────────────

export default forwardRef(function SharePanel(
  { groupStage, knockout, champion, getTeam, onAdvance },
  ref
) {
  const championTeam = getTeam(champion);

  return (
    /*
     * Zero-size absolutely-positioned wrapper.
     * Keeps the panel in the DOM (so html2canvas can measure it)
     * without affecting page layout or being visible.
     */
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        overflow: "hidden",
        // Bring it above z:-1 so the browser fully renders it
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/*
       * The actual panel — ref is on this element.
       * We use a nested relative container so html2canvas sees
       * the element at position (0,0) relative to itself.
       */}
      <div
        style={{
          position: "relative",
          left: 0,
          top: 0,
        }}
      >
        <div
          ref={ref}
          style={{
            width: PANEL_W,
            background: BG,
            color: "#e5e7eb",
            fontFamily: "'Inter', sans-serif",
            // overflow visible so the absolute-positioned bracket canvas
            // is included in scrollHeight for capture
            overflow: "visible",
          }}
        >

          {/* ── 1. Header ──────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 24px",
              borderBottom: `1px solid ${BORDER}`,
              background: BG_CARD,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>🏆</span>
              <div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    lineHeight: "22px",
                  }}
                >
                  WC 2026
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#22c55e",
                    lineHeight: "14px",
                    marginTop: 2,
                  }}
                >
                  Bracket Predictor
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                color: "#1e4d2e",
                letterSpacing: "0.05em",
              }}
            >
              wc2026bracket.vercel.app
            </div>
          </div>

          {/* ── 2. Champion banner ─────────────────────── */}
          {championTeam && (
            <div
              style={{
                textAlign: "center",
                padding: "18px 24px 14px",
                borderBottom: `1px solid ${BORDER}`,
                background: "rgba(229,184,32,0.06)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#e6b820",
                  lineHeight: "14px",
                  marginBottom: 6,
                }}
              >
                World Cup Champion
              </div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#f5c842",
                  lineHeight: "36px",
                }}
              >
                {championTeam.flag}{"  "}{championTeam.name}
              </div>
            </div>
          )}

          {/* ── 3. Group Stage ─────────────────────────── */}
          <div style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div
              style={{
                padding: "10px 24px 2px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#374151",
                lineHeight: "16px",
              }}
            >
              Group Stage
            </div>
            <GroupResultsGrid groupStage={groupStage} />
          </div>

          {/* ── 4. Knockout Bracket ────────────────────── */}
          <div style={{ padding: "14px 24px 0" }}>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#374151",
                lineHeight: "16px",
                marginBottom: 10,
              }}
            >
              Knockout Stage
            </div>
            <BracketView
              knockout={knockout}
              completedGroups={12}
              thirdPlaceCount={8}
              onAdvance={() => {}}
              getTeam={getTeam}
            />
          </div>

          {/* ── 5. Footer ──────────────────────────────── */}
          <div
            style={{
              padding: "12px 24px",
              marginTop: 24,
              borderTop: `1px solid ${BG_HDR}`,
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              color: "#1e4d2e",
              letterSpacing: "0.05em",
              lineHeight: "14px",
            }}
          >
            Made with wc2026bracket.vercel.app · For entertainment purposes only
          </div>

        </div>
      </div>
    </div>
  );
});