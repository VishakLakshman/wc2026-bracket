/**
 * BracketView.jsx
 *
 * Full knockout bracket — R32 → R16 → QF → SF → Final.
 *
 * All columns are absolutely positioned using computed pixel `left`
 * values — no flexbox gap — so alignment is identical in Safari,
 * Chrome, and Firefox.
 */

import BracketRound, {
  CONNECTOR_W,
  CARD_W,
  CARD_W_FINAL,
  LABEL_H,
  CARD_H,
  columnHeight,
  matchAreaHeight,
} from "./BracketRound";
import BracketMatch from "./BracketMatch";

// ─────────────────────────────────────────────────────────────
// ROUND DEFINITIONS
// ─────────────────────────────────────────────────────────────

const ROUNDS = [
  { key: "r32",   label: "Round of 32",    matchCount: 16, cardW: CARD_W       },
  { key: "r16",   label: "Round of 16",    matchCount: 8,  cardW: CARD_W       },
  { key: "qf",    label: "Quarter-finals", matchCount: 4,  cardW: CARD_W       },
  { key: "sf",    label: "Semi-finals",    matchCount: 2,  cardW: CARD_W       },
  { key: "final", label: "Final",          matchCount: 1,  cardW: CARD_W_FINAL },
];

// Pre-compute left position of each column.
// Slot width = cardW + CONNECTOR_W (except the last column which has no connector).
function computeColumnLefts() {
  const lefts  = [];
  let   cursor = 0;
  ROUNDS.forEach((r, i) => {
    lefts.push(cursor);
    const isLast = i === ROUNDS.length - 1;
    cursor += r.cardW + (isLast ? 0 : CONNECTOR_W);
  });
  return lefts;
}

const COL_LEFTS = computeColumnLefts();
const TOTAL_W   = COL_LEFTS[COL_LEFTS.length - 1] + CARD_W_FINAL + 24;

// ─────────────────────────────────────────────────────────────
// LOCKED OVERLAY
// ─────────────────────────────────────────────────────────────

function LockedOverlay({ completedGroups, thirdPlaceCount }) {
  const groupsDone = completedGroups === 12;
  const thirdDone  = thirdPlaceCount === 8;

  return (
    <div className="rounded-xl border border-pitch-700 bg-pitch-900/50 p-10 flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-pitch-800 border border-pitch-700 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <div>
        <p className="font-display text-lg uppercase tracking-wide text-white mb-1">
          Complete the Group Stage First
        </p>
        <p className="text-sm text-gray-500 font-body max-w-xs">
          Assign 1st, 2nd and 3rd place in all 12 groups, then select 8 third-place qualifiers below.
        </p>
      </div>
      <div className="flex gap-6 mt-2">
        <div className="text-center">
          <div className={`font-display text-2xl font-bold ${groupsDone ? "text-grass-400" : "text-gray-400"}`}>
            {completedGroups}<span className="text-base text-gray-600">/12</span>
          </div>
          <div className="text-xs text-gray-600 font-body mt-0.5">{groupsDone ? "✓ " : ""}Groups</div>
        </div>
        <div className="w-px bg-pitch-700" />
        <div className="text-center">
          <div className={`font-display text-2xl font-bold ${thirdDone ? "text-grass-400" : "text-gray-400"}`}>
            {thirdPlaceCount}<span className="text-base text-gray-600">/8</span>
          </div>
          <div className="text-xs text-gray-600 font-body mt-0.5">{thirdDone ? "✓ " : ""}3rd-place picks</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHAMPION CALLOUT
// ─────────────────────────────────────────────────────────────

const CHAMPION_H = 52;

function ChampionCallout({ team, left, cardW }) {
  return (
    <div
      className="absolute z-10 flex flex-col items-center"
      style={{ left, width: cardW, top: 0 }}
    >
      <div className="px-3 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center gap-2 w-full justify-center">
        <span className="text-base leading-none">{team.flag}</span>
        <span className="font-display text-sm font-bold text-gold-400 uppercase tracking-wide truncate">
          {team.name}
        </span>
        <svg className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M2 19h20v2H2v-2ZM3 7l4 6 5-8 5 8 4-6v9H3V7Z" />
        </svg>
      </div>
      <div className="w-px h-3 bg-gold-500/30" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// THIRD-PLACE PLAY-OFF
// ─────────────────────────────────────────────────────────────

function ThirdPlacePlayoff({ match, getTeam, onAdvance, left, top }) {
  const winner = match.winner ? getTeam(match.winner) : null;
  return (
    <div className="absolute flex flex-col gap-2" style={{ left, top }}>
      <span className="font-display text-xs font-bold tracking-widest uppercase text-gray-500">
        3rd-place play-off
      </span>
      <BracketMatch
        match={match}
        matchLabel="3rd-place play-off"
        getTeam={getTeam}
        onAdvance={(teamId) => onAdvance("third", 0, teamId)}
        roundKey="third"
        isFinal={false}
      />
      {winner && (
        <p className="text-xs text-gray-500 font-body">
          🥉 {winner.flag} {winner.name} finishes third
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────

function SectionHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
        Knockout Bracket
      </h2>
      <span className="font-display text-xs px-2.5 py-1 rounded-full bg-pitch-800 text-gray-400 tracking-widest uppercase border border-pitch-700">
        R32 → R16 → QF → SF → Final
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function BracketView({
  knockout,
  completedGroups,
  thirdPlaceCount,
  onAdvance,
  getTeam,
}) {
  const isLocked = completedGroups < 12 || thirdPlaceCount < 8;

  if (isLocked) {
    return (
      <section>
        <SectionHeader />
        <LockedOverlay completedGroups={completedGroups} thirdPlaceCount={thirdPlaceCount} />
      </section>
    );
  }

  // Champion
  const championId = knockout.final[0]?.winner ?? null;
  const champion   = getTeam(championId);
  const topPadding = champion ? CHAMPION_H : 0;

  // SF losers → third-place match slots
  function sfLoser(sfMatch) {
    if (!sfMatch?.winner) return null;
    return sfMatch.winner === sfMatch.teamA ? sfMatch.teamB : sfMatch.teamA;
  }
  const thirdMatch = {
    ...knockout.third[0],
    teamA: knockout.third[0].teamA ?? sfLoser(knockout.sf[0]),
    teamB: knockout.third[0].teamB ?? sfLoser(knockout.sf[1]),
  };

  // Vertical centering: all columns centred against R32 (tallest)
  const r32AreaH = matchAreaHeight(16);
  function verticalOffset(matchCount) {
    return Math.round((r32AreaH - matchAreaHeight(matchCount)) / 2);
  }

  // Third-place card: below the SF column
  const sfIdx    = ROUNDS.findIndex(r => r.key === "sf");
  const sfLeft   = COL_LEFTS[sfIdx];
  const sfAreaH  = matchAreaHeight(2);
  const sfOffset = verticalOffset(2);
  const thirdTop = topPadding + LABEL_H + sfOffset + sfAreaH + 32;

  // Canvas height: tall enough for R32 + third-place card below SF
  const canvasH = topPadding + LABEL_H + r32AreaH + 32 + CARD_H + 40;

  return (
    <section className="space-y-4">
      <SectionHeader />

      <div className="overflow-x-auto bracket-scroll pb-2">
        <div
          className="relative"
          style={{ width: TOTAL_W, height: canvasH }}
        >
          {/* Champion callout */}
          {champion && (
            <ChampionCallout
              team={champion}
              left={COL_LEFTS[ROUNDS.findIndex(r => r.key === "final")]}
              cardW={CARD_W_FINAL}
            />
          )}

          {/* Bracket columns */}
          {ROUNDS.map((round, idx) => {
            const isLast  = idx === ROUNDS.length - 1;
            const vOffset = verticalOffset(round.matchCount);
            const colTop  = topPadding + vOffset;

            return (
              <div
                key={round.key}
                className="absolute"
                style={{ left: COL_LEFTS[idx], top: colTop }}
              >
                <BracketRound
                  roundKey={round.key}
                  label={round.label}
                  matches={knockout[round.key]}
                  getTeam={getTeam}
                  onAdvance={onAdvance}
                  isLast={isLast}
                />
              </div>
            );
          })}

          {/* Third-place play-off */}
          <ThirdPlacePlayoff
            match={thirdMatch}
            getTeam={getTeam}
            onAdvance={onAdvance}
            left={sfLeft}
            top={thirdTop}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gold-500/30 border border-gold-500/40" />
          <span className="text-xs text-gray-600 font-body">Winner / advancing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-pitch-800 border border-pitch-700 opacity-40" />
          <span className="text-xs text-gray-600 font-body">Eliminated</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-pitch-800 border border-pitch-700" />
          <span className="text-xs text-gray-600 italic font-body">TBD</span>
        </div>
      </div>
    </section>
  );
}