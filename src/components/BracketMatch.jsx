/**
 * BracketMatch.jsx — redesigned
 * All sizing via inline style px values for html2canvas compatibility.
 *
 * SLOT_H = 34, DIV_H = 1, CARD_H = 69
 */

export const SLOT_H = 34;
export const DIV_H  = 1;
export const CARD_H = SLOT_H * 2 + DIV_H; // 69px

function TeamSlot({ team, placeholder, isWinner, isLoser, isEmpty, onClick, ariaLabel }) {
  return (
    <button
      onClick={isEmpty ? undefined : onClick}
      disabled={isEmpty}
      aria-label={ariaLabel}
      aria-pressed={isWinner || undefined}
      style={{
        height:    SLOT_H,
        minHeight: SLOT_H,
        maxHeight: SLOT_H,
        boxSizing: "border-box",
        lineHeight: `${SLOT_H}px`,
      }}
      className={[
        "flex items-center gap-2 w-full px-2.5 text-left flex-shrink-0 overflow-hidden",
        "transition-all duration-150 focus-electric",
        isWinner  && "bg-gold-500/15",
        isLoser   && "opacity-20",
        !isWinner && !isLoser && !isEmpty && "cursor-pointer hover:bg-pitch-700/60",
        isEmpty   && "cursor-default",
      ].filter(Boolean).join(" ")}
    >
      {isEmpty ? (
        <span
          style={{ lineHeight: "normal" }}
          className="font-mono text-xs text-pitch-600 italic truncate"
        >
          {placeholder}
        </span>
      ) : (
        <>
          <span style={{ lineHeight: 1, flexShrink: 0, width: 18, textAlign: "center" }}
            className="text-sm select-none">
            {team.flag}
          </span>
          <span
            style={{ lineHeight: "normal" }}
            className={[
              "font-body text-xs truncate flex-1",
              isWinner ? "text-gold-400 font-semibold" : "text-slate-300",
            ].join(" ")}
          >
            {team.name}
          </span>
          {isWinner && (
            <svg style={{ flexShrink: 0 }} className="w-2.5 h-2.5 text-gold-400"
              viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M2 19h20v2H2v-2ZM3 7l4 6 5-8 5 8 4-6v9H3V7Z" />
            </svg>
          )}
        </>
      )}
    </button>
  );
}

export default function BracketMatch({ match, getTeam, onAdvance, roundKey, isFinal = false }) {
  const teamA  = getTeam(match.teamA);
  const teamB  = getTeam(match.teamB);
  const winner = match.winner;

  return (
    <div
      style={{ width: isFinal ? 180 : 164, height: CARD_H, boxSizing: "border-box", flexShrink: 0 }}
      className={[
        "rounded-lg overflow-hidden flex flex-col",
        "bg-pitch-900",
        winner
          ? "border border-gold-500/30 shadow-gold"
          : "border border-pitch-700 shadow-card",
      ].join(" ")}
    >
      <TeamSlot
        team={teamA}
        placeholder={match.teamADesc ?? "TBD"}
        isWinner={winner === match.teamA && !!match.teamA}
        isLoser={!!winner && winner !== match.teamA && !!match.teamA}
        isEmpty={!match.teamA}
        onClick={() => onAdvance(match.teamA)}
        ariaLabel={teamA ? `${teamA.name} — advance` : "TBD"}
      />
      <div style={{ height: DIV_H, flexShrink: 0 }} className="bg-pitch-700" />
      <TeamSlot
        team={teamB}
        placeholder={match.teamBDesc ?? "TBD"}
        isWinner={winner === match.teamB && !!match.teamB}
        isLoser={!!winner && winner !== match.teamB && !!match.teamB}
        isEmpty={!match.teamB}
        onClick={() => onAdvance(match.teamB)}
        ariaLabel={teamB ? `${teamB.name} — advance` : "TBD"}
      />
    </div>
  );
}