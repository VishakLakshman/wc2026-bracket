/**
 * SharePanel.jsx
 *
 * A self-contained 1200 × auto px panel that html2canvas captures
 * to produce the shareable bracket PNG.
 *
 * It is always in the DOM (rendered off-screen via `sr-only`-style
 * positioning) so html2canvas can measure its real dimensions.
 * We use `position: fixed; left: -9999px` rather than `display:none`
 * or `visibility:hidden` because html2canvas can't capture hidden
 * elements.
 *
 * Contents (top → bottom):
 *   1. Header bar — logo + "wc2026bracket.vercel.app" watermark
 *   2. Group Results — compact 4-col grid of all 12 groups
 *   3. Knockout Bracket — the full bracket tree
 *   4. Champion callout — shown when Final winner is picked
 *   5. Footer — "Made with wc2026bracket.vercel.app"
 *
 * Props:
 *   panelRef       — forwarded ref attached to the root div
 *   groupStage     — from useBracket
 *   thirdPlace     — from useBracket
 *   knockout       — from useBracket
 *   completedGroups— from useBracket
 *   champion       — from useBracket (team id string | null)
 *   getTeam        — fn(id) => team | null
 *   onAdvance      — pass-through (screenshot is non-interactive,
 *                    but BracketView requires the prop)
 */

import { forwardRef } from "react";
import BracketView from "./BracketView";
import { GROUPS } from "../data/teams";

// ─────────────────────────────────────────────────────────────
// RANK CONFIG  (mirrors GroupCard — kept local to avoid coupling)
// ─────────────────────────────────────────────────────────────

const RANK_STYLES = [
  { label: "1",  bg: "#16a34a22", text: "#4ade80", border: "#16a34a55" }, // grass
  { label: "2",  bg: "#0d948022", text: "#2dd4bf", border: "#0d948055" }, // teal
  { label: "3",  bg: "#d9770622", text: "#fbbf24", border: "#d9770655" }, // amber
  { label: "—",  bg: "transparent", text: "#374151", border: "#374151" }, // eliminated
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
        gap: 12,
        padding: "16px 24px",
      }}
    >
      {GROUPS.map((g) => {
        const { teams, advancers } = groupStage[g];
        return (
          <div
            key={g}
            style={{
              background: "#0a1f14",
              border: "1px solid #164026",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {/* Group header */}
            <div
              style={{
                background: "#0f2e1d",
                borderBottom: "1px solid #164026",
                padding: "4px 10px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              Group {g}
            </div>

            {/* Team rows */}
            {teams.map((team) => {
              const rankIdx = advancers.indexOf(team.id); // 0,1,2 or -1
              const isEliminated = advancers.length === 3 && rankIdx === -1;
              const style =
                rankIdx >= 0
                  ? RANK_STYLES[rankIdx]
                  : isEliminated
                  ? RANK_STYLES[3]
                  : { label: "", bg: "transparent", text: "#d1d5db", border: "transparent" };

              return (
                <div
                  key={team.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 10px",
                    background: style.bg,
                    borderBottom: "1px solid #0f2e1d",
                  }}
                >
                  <span style={{ fontSize: 13, lineHeight: 1, width: 18, textAlign: "center" }}>
                    {team.flag}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      color: style.text,
                      flex: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      opacity: isEliminated ? 0.4 : 1,
                    }}
                  >
                    {team.name}
                  </span>
                  {rankIdx >= 0 && (
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        color: style.text,
                        background: style.bg,
                        border: `1px solid ${style.border}`,
                        borderRadius: 3,
                        padding: "1px 4px",
                        lineHeight: 1.4,
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

const PANEL_W = 1200;

const SharePanel = forwardRef(function SharePanel(
  { groupStage, thirdPlace, knockout, completedGroups, champion, getTeam, onAdvance },
  ref
) {
  const championTeam = getTeam(champion);

  return (
    /*
     * Position fixed off-screen so it's in the DOM and measurable
     * by html2canvas, but invisible to the user.
     * We use `left: -9999px` not `display:none` — hidden elements
     * cannot be captured by html2canvas.
     */
    <div
      style={{
        position: "fixed",
        left: -9999,
        top: 0,
        zIndex: -1,
        width: PANEL_W,
        // Let height grow naturally with content
      }}
    >
      <div
        ref={ref}
        style={{
          width: PANEL_W,
          background: "#050f0a",
          color: "#e5e7eb",
          fontFamily: "'Inter', sans-serif",
          // Explicit overflow visible so absolutely-positioned bracket is captured
          overflow: "visible",
        }}
      >
        {/* ── 1. Header ──────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid #164026",
            background: "#0a1f14",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>🏆</span>
            <div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                WC 2026
              </div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#22c55e",
                  lineHeight: 1,
                  marginTop: 2,
                }}
              >
                Bracket Predictor
              </div>
            </div>
          </div>

          {/* Watermark URL */}
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: "#164026",
              letterSpacing: "0.05em",
            }}
          >
            wc2026bracket.vercel.app
          </div>
        </div>

        {/* ── 2. Champion banner (if Final picked) ───────── */}
        {championTeam && (
          <div
            style={{
              textAlign: "center",
              padding: "20px 24px 16px",
              borderBottom: "1px solid #164026",
              background: "linear-gradient(180deg, rgba(229,184,32,0.08) 0%, transparent 100%)",
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#e6b820",
                marginBottom: 6,
              }}
            >
              World Cup Champion
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 36,
                fontWeight: 800,
                color: "#f5c842",
                lineHeight: 1,
              }}
            >
              {championTeam.flag}{"  "}{championTeam.name}
            </div>
          </div>
        )}

        {/* ── 3. Group Results ────────────────────────────── */}
        <div
          style={{
            borderBottom: "1px solid #164026",
          }}
        >
          <div
            style={{
              padding: "10px 24px 4px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#374151",
            }}
          >
            Group Stage
          </div>
          <GroupResultsGrid groupStage={groupStage} />
        </div>

        {/* ── 4. Knockout Bracket ─────────────────────────── */}
        <div style={{ padding: "16px 24px 0" }}>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Knockout Stage
          </div>
          {/*
           * BracketView renders the full bracket tree.
           * We pass completedGroups=12 and thirdPlaceCount=8 to ensure
           * it never shows the locked overlay, even during partial state.
           * onAdvance is a no-op since the panel is non-interactive.
           */}
          <BracketView
            knockout={knockout}
            completedGroups={12}
            thirdPlaceCount={8}
            onAdvance={() => {}}
            getTeam={getTeam}
          />
        </div>

        {/* ── 5. Footer ───────────────────────────────────── */}
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid #0f2e1d",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            color: "#1f4d2e",
            letterSpacing: "0.05em",
          }}
        >
          Made with wc2026bracket.vercel.app · For entertainment purposes only
        </div>
      </div>
    </div>
  );
});

export default SharePanel;