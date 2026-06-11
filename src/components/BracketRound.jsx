/**
 * BracketRound.jsx
 *
 * One column of the knockout bracket.
 * Match cards are placed at exact pixel offsets; SVG connectors
 * are drawn in the right-hand gutter so alignment is pixel-perfect
 * in every browser (no flexbox gap involved).
 *
 * Layout model — matches arranged in flush pairs, PAIR_GAP between pairs:
 *
 *   Pair 0:  match 0  ──┐
 *            match 1  ──┤──► child match 0 in next round
 *   [PAIR_GAP]
 *   Pair 1:  match 2  ──┐
 *            match 3  ──┤──► child match 1 in next round
 *   ...
 */

import BracketMatch, { CARD_H } from "./BracketMatch";

// Re-export CARD_H so BracketView only needs to import from one place
export { CARD_H };

export const PAIR_GAP     = 20;  // px gap between pairs of matches
export const CONNECTOR_W  = 32;  // px width of right-hand SVG gutter
export const CARD_W       = 160; // px — normal card width
export const CARD_W_FINAL = 176; // px — Final card width
export const LABEL_H      = 28;  // px — round label row height above matches

/** Top edge of match[i] within the match area (below the label row). */
export function matchTop(i) {
  const pair       = Math.floor(i / 2);
  const withinPair = i % 2;
  return pair * (CARD_H * 2 + PAIR_GAP) + withinPair * CARD_H;
}

/** Vertical centre of match[i]. */
export function matchCenterY(i) {
  return matchTop(i) + CARD_H / 2;
}

/** Total height of the match area for n matches. */
export function matchAreaHeight(n) {
  if (n === 0) return 0;
  const pairs = Math.ceil(n / 2);
  return pairs * CARD_H * 2 + (pairs - 1) * PAIR_GAP;
}

/** Total column height including the label row. */
export function columnHeight(n) {
  return LABEL_H + matchAreaHeight(n);
}

// ─────────────────────────────────────────────────────────────

export default function BracketRound({
  roundKey,
  label,
  matches,
  getTeam,
  onAdvance,
  isLast = false,
}) {
  const isFinal = roundKey === "final";
  const cardW   = isFinal ? CARD_W_FINAL : CARD_W;
  const slotW   = cardW + (isLast ? 0 : CONNECTOR_W);
  const areaH   = matchAreaHeight(matches.length);

  return (
    <div style={{ width: slotW, flexShrink: 0 }}>

      {/* Round label */}
      <div style={{ height: LABEL_H }} className="flex items-end pb-1">
        <span className="font-display text-xs font-bold tracking-widest uppercase text-gray-500 leading-none">
          {label}
        </span>
      </div>

      {/* Match area */}
      <div className="relative" style={{ height: areaH }}>

        {/* Match cards */}
        {matches.map((match, i) => (
          <div
            key={match.id}
            className="absolute"
            style={{ top: matchTop(i), left: 0 }}
          >
            <BracketMatch
              match={match}
              matchLabel={`${label} M${i + 1}`}
              getTeam={getTeam}
              onAdvance={(teamId) => onAdvance(roundKey, i, teamId)}
              roundKey={roundKey}
              isFinal={isFinal}
            />
          </div>
        ))}

        {/* SVG connector lines */}
        {!isLast && matches.length >= 2 && (
          <svg
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: cardW,
              width: CONNECTOR_W,
              height: areaH,
              overflow: "visible",
            }}
          >
            {Array.from({ length: Math.floor(matches.length / 2) }, (_, pairIdx) => {
              const idxA  = pairIdx * 2;
              const idxB  = pairIdx * 2 + 1;
              const yA    = matchCenterY(idxA);
              const yB    = matchCenterY(idxB);
              const yMid  = (yA + yB) / 2;
              const xBend = CONNECTOR_W * 0.55;

              return (
                <g key={pairIdx} stroke="#1e4d30" strokeWidth="1.5" fill="none">
                  <line x1={0}      y1={yA}   x2={xBend}       y2={yA}   />
                  <line x1={0}      y1={yB}   x2={xBend}       y2={yB}   />
                  <line x1={xBend}  y1={yA}   x2={xBend}       y2={yB}   />
                  <line x1={xBend}  y1={yMid} x2={CONNECTOR_W} y2={yMid} />
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}