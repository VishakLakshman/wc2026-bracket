import BracketRound, {
  CONNECTOR_W, CARD_W, CARD_W_FINAL, LABEL_H, CARD_H,
  matchAreaHeight,
} from "./BracketRound";
import BracketMatch from "./BracketMatch";
import { SectionHeader } from "../App";

const ROUNDS = [
  { key: "r32",   label: "Round of 32",    matchCount: 16, cardW: CARD_W       },
  { key: "r16",   label: "Round of 16",    matchCount: 8,  cardW: CARD_W       },
  { key: "qf",    label: "Quarters",       matchCount: 4,  cardW: CARD_W       },
  { key: "sf",    label: "Semis",          matchCount: 2,  cardW: CARD_W       },
  { key: "final", label: "Final",          matchCount: 1,  cardW: CARD_W_FINAL },
];

function computeColumnLefts() {
  const lefts = []; let cursor = 0;
  ROUNDS.forEach((r, i) => {
    lefts.push(cursor);
    cursor += r.cardW + (i < ROUNDS.length - 1 ? CONNECTOR_W : 0);
  });
  return lefts;
}
const COL_LEFTS = computeColumnLefts();
const TOTAL_W   = COL_LEFTS.at(-1) + CARD_W_FINAL + 32;

// ─────────────────────────────────────────────────────────────
// LOCKED STATE
// ─────────────────────────────────────────────────────────────

function LockedOverlay({ completedGroups, thirdPlaceCount }) {
  const gDone = completedGroups === 12;
  const tDone = thirdPlaceCount  === 8;
  return (
    <div className="rounded-2xl border border-pitch-700 bg-pitch-900 p-12 flex flex-col items-center gap-5 text-center">
      <div className="w-16 h-16 rounded-full bg-pitch-800 border border-pitch-700 flex items-center justify-center">
        <svg className="w-7 h-7 text-pitch-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <div>
        <p className="font-display text-xl font-black uppercase tracking-wide text-white mb-1">
          Complete the group stage first
        </p>
        <p className="font-body text-sm text-pitch-500 max-w-xs">
          Assign 1st, 2nd and 3rd in all 12 groups, then select 8 third-place qualifiers.
        </p>
      </div>
      <div className="flex gap-8 mt-1">
        {[
          { done: gDone, val: completedGroups, max: 12, label: "Groups" },
          { done: tDone, val: thirdPlaceCount,  max: 8,  label: "3rd-place" },
        ].map(({ done, val, max, label }) => (
          <div key={label} className="text-center">
            <div className={`font-display text-3xl font-black tabular-nums leading-none ${done ? "text-electric-500" : "text-pitch-600"}`}>
              {val}<span className="text-xl text-pitch-700">/{max}</span>
            </div>
            <div className="font-mono text-xs text-pitch-600 mt-1 uppercase tracking-wider">
              {done && "✓ "}{label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHAMPION CALLOUT
// ─────────────────────────────────────────────────────────────

function ChampionCallout({ team, left, cardW }) {
  return (
    <div className="absolute z-10 flex flex-col items-center animate-fade-up"
      style={{ left, width: cardW, top: 0 }}>
      <div className="px-3 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center gap-2 w-full justify-center shadow-gold">
        <span className="text-base leading-none">{team.flag}</span>
        <span className="font-display text-sm font-black text-gold-400 uppercase tracking-wide truncate">
          {team.name}
        </span>
        <svg className="w-3 h-3 text-gold-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
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
      <span className="font-mono text-xs tracking-widest uppercase text-pitch-600">
        3rd-place play-off
      </span>
      <BracketMatch
        match={match} getTeam={getTeam}
        onAdvance={(id) => onAdvance("third", 0, id)}
        roundKey="third" isFinal={false}
      />
      {winner && (
        <p className="font-mono text-xs text-pitch-500">
          🥉 {winner.flag} {winner.name}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

export default function BracketView({ knockout, completedGroups, thirdPlaceCount, onAdvance, getTeam }) {
  if (completedGroups < 12 || thirdPlaceCount < 8) {
    return (
      <section>
        <SectionHeader step="02" title="Knockout Bracket" badge="R32 → R16 → QF → SF → Final" />
        <LockedOverlay completedGroups={completedGroups} thirdPlaceCount={thirdPlaceCount} />
      </section>
    );
  }

  const championId = knockout.final[0]?.winner ?? null;
  const champion   = getTeam(championId);
  const topPad     = champion ? 52 : 0;

  function sfLoser(m) {
    if (!m?.winner) return null;
    return m.winner === m.teamA ? m.teamB : m.teamA;
  }
  const thirdMatch = {
    ...knockout.third[0],
    teamA: knockout.third[0].teamA ?? sfLoser(knockout.sf[0]),
    teamB: knockout.third[0].teamB ?? sfLoser(knockout.sf[1]),
  };

  const r32H = matchAreaHeight(16);
  function vOffset(n) { return Math.round((r32H - matchAreaHeight(n)) / 2); }

  const sfIdx  = ROUNDS.findIndex(r => r.key === "sf");
  const sfLeft = COL_LEFTS[sfIdx];
  const sfTop  = topPad + LABEL_H + vOffset(2) + matchAreaHeight(2) + 28;
  const canvasH = topPad + LABEL_H + r32H + 28 + CARD_H + 32;

  return (
    <section>
      <SectionHeader
        step="02"
        title="Knockout Bracket"
        badge="R32 → R16 → QF → SF → Final"
        rightSlot={
          champion && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
              <span className="text-sm">{champion.flag}</span>
              <span className="font-display text-sm font-bold text-gold-400 uppercase tracking-wide">
                {champion.name}
              </span>
            </div>
          )
        }
      />

      <div className="overflow-x-auto bracket-scroll pb-2">
        <div className="relative" style={{ width: TOTAL_W, height: canvasH }}>

          {champion && (
            <ChampionCallout
              team={champion}
              left={COL_LEFTS.at(-1)}
              cardW={CARD_W_FINAL}
            />
          )}

          {ROUNDS.map((round, idx) => (
            <div
              key={round.key}
              className="absolute"
              style={{ left: COL_LEFTS[idx], top: topPad + vOffset(round.matchCount) }}
            >
              <BracketRound
                roundKey={round.key}
                label={round.label}
                matches={knockout[round.key]}
                getTeam={getTeam}
                onAdvance={onAdvance}
                isLast={idx === ROUNDS.length - 1}
              />
            </div>
          ))}

          <ThirdPlacePlayoff
            match={thirdMatch} getTeam={getTeam}
            onAdvance={onAdvance} left={sfLeft} top={sfTop}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 flex-wrap">
        {[
          { color: "bg-gold-500/20 border-gold-500/30", label: "Advancing" },
          { color: "bg-pitch-800 border-pitch-700 opacity-30", label: "Eliminated" },
          { color: "bg-pitch-800 border-pitch-700", label: "TBD" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm border ${color}`} />
            <span className="font-mono text-xs text-pitch-600">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}