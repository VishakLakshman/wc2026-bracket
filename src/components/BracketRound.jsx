import BracketMatch, { CARD_H } from "./BracketMatch";

export { CARD_H };

export const PAIR_GAP     = 20;
export const CONNECTOR_W  = 32;
export const CARD_W       = 164;
export const CARD_W_FINAL = 180;
export const LABEL_H      = 30;

export function matchTop(i) {
  const pair       = Math.floor(i / 2);
  const withinPair = i % 2;
  return pair * (CARD_H * 2 + PAIR_GAP) + withinPair * CARD_H;
}

export function matchCenterY(i) {
  return matchTop(i) + CARD_H / 2;
}

export function matchAreaHeight(n) {
  if (n === 0) return 0;
  const pairs = Math.ceil(n / 2);
  return pairs * CARD_H * 2 + (pairs - 1) * PAIR_GAP;
}

export function columnHeight(n) {
  return LABEL_H + matchAreaHeight(n);
}

export default function BracketRound({ roundKey, label, matches, getTeam, onAdvance, isLast = false }) {
  const isFinal = roundKey === "final";
  const cardW   = isFinal ? CARD_W_FINAL : CARD_W;
  const slotW   = cardW + (isLast ? 0 : CONNECTOR_W);
  const areaH   = matchAreaHeight(matches.length);

  return (
    <div style={{ width: slotW, flexShrink: 0 }}>
      {/* Round label */}
      <div style={{ height: LABEL_H }} className="flex items-end pb-1.5">
        <span className="font-mono text-xs font-medium tracking-widest uppercase text-pitch-600 leading-none">
          {label}
        </span>
      </div>

      {/* Match area */}
      <div className="relative" style={{ height: areaH }}>
        {matches.map((match, i) => (
          <div key={match.id} className="absolute" style={{ top: matchTop(i), left: 0 }}>
            <BracketMatch
              match={match}
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
            style={{ top: 0, left: cardW, width: CONNECTOR_W, height: areaH, overflow: "visible" }}
          >
            {Array.from({ length: Math.floor(matches.length / 2) }, (_, pairIdx) => {
              const yA   = matchCenterY(pairIdx * 2);
              const yB   = matchCenterY(pairIdx * 2 + 1);
              const yMid = (yA + yB) / 2;
              const xB   = CONNECTOR_W * 0.5;
              return (
                <g key={pairIdx} stroke="#1a3d2e" strokeWidth="1" fill="none">
                  <line x1={0}  y1={yA}   x2={xB}          y2={yA}   />
                  <line x1={0}  y1={yB}   x2={xB}          y2={yB}   />
                  <line x1={xB} y1={yA}   x2={xB}          y2={yB}   />
                  <line x1={xB} y1={yMid} x2={CONNECTOR_W} y2={yMid} />
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}