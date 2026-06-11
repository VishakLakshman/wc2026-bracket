import { GROUPS, TEAMS, getTeamsByGroup } from "../data/teams";

// ─────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────

export function createInitialState() {
  const groupStage = {};
  GROUPS.forEach((g) => {
    groupStage[g] = {
      teams: getTeamsByGroup(g),
      /**
       * advancers: [1stId, 2ndId, 3rdId]
       * Length 0–3. The user picks ranks by clicking in order.
       * advancers[2] is the explicit 3rd-place team — the pool from
       * which users pick the 8 R32 third-place qualifiers.
       */
      advancers: [],
    };
  });

  return {
    groupStage,
    thirdPlace: [], // up to 8 ids from the explicit 3rd-place pool
    knockout: {
      r32:   createEmptyMatches(16, "r32"),
      r16:   createEmptyMatches(8,  "r16"),
      qf:    createEmptyMatches(4,  "qf"),
      sf:    createEmptyMatches(2,  "sf"),
      third: createEmptyMatches(1,  "third"),
      final: createEmptyMatches(1,  "final"),
    },
  };
}

function createEmptyMatches(count, round) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${round}-${i}`,
    teamA: null,
    teamB: null,
    winner: null,
  }));
}

// ─────────────────────────────────────────────────────────────
// THIRD-PLACE ELIGIBILITY
// ─────────────────────────────────────────────────────────────

/**
 * Returns the team objects explicitly assigned 3rd place in their group
 * (i.e. advancers[2]) for every group that has all three ranks filled.
 *
 * @param {Object} groupStage
 * @returns {Array} team objects
 */
export function getThirdPlaceEligible(groupStage) {
  const eligible = [];
  GROUPS.forEach((g) => {
    const { teams, advancers } = groupStage[g];
    if (advancers.length >= 3) {
      const thirdId   = advancers[2];
      const thirdTeam = teams.find((t) => t.id === thirdId);
      if (thirdTeam) eligible.push(thirdTeam);
    }
  });
  return eligible;
}

// ─────────────────────────────────────────────────────────────
// R32 SEEDING
// ─────────────────────────────────────────────────────────────

export const R32_SEEDINGS = [
  { teamADesc: "1A", teamBDesc: "2B" },
  { teamADesc: "1B", teamBDesc: "2A" },
  { teamADesc: "1C", teamBDesc: "2D" },
  { teamADesc: "1D", teamBDesc: "2C" },
  { teamADesc: "1E", teamBDesc: "2F" },
  { teamADesc: "1F", teamBDesc: "2E" },
  { teamADesc: "1G", teamBDesc: "2H" },
  { teamADesc: "1H", teamBDesc: "2G" },
  { teamADesc: "1I", teamBDesc: "2J" },
  { teamADesc: "1J", teamBDesc: "2I" },
  { teamADesc: "1K", teamBDesc: "2L" },
  { teamADesc: "1L", teamBDesc: "2K" },
  { teamADesc: "3rd #1", teamBDesc: "3rd #2" },
  { teamADesc: "3rd #3", teamBDesc: "3rd #4" },
  { teamADesc: "3rd #5", teamBDesc: "3rd #6" },
  { teamADesc: "3rd #7", teamBDesc: "3rd #8" },
];

export function resolveSeeding(desc, groupStage, thirdPlace) {
  if (/^1[A-L]$/.test(desc)) {
    return groupStage[desc[1]]?.advancers[0] ?? null;
  }
  if (/^2[A-L]$/.test(desc)) {
    return groupStage[desc[1]]?.advancers[1] ?? null;
  }
  if (desc.startsWith("3rd #")) {
    const rank = parseInt(desc.replace("3rd #", ""), 10) - 1;
    return thirdPlace[rank] ?? null;
  }
  return null;
}

export function buildR32Matchups(groupStage, thirdPlace) {
  return R32_SEEDINGS.map((seeding, i) => ({
    id: `r32-${i}`,
    teamA: resolveSeeding(seeding.teamADesc, groupStage, thirdPlace),
    teamB: resolveSeeding(seeding.teamBDesc, groupStage, thirdPlace),
    winner: null,
    teamADesc: seeding.teamADesc,
    teamBDesc: seeding.teamBDesc,
  }));
}

// ─────────────────────────────────────────────────────────────
// KNOCKOUT PROGRESSION
// ─────────────────────────────────────────────────────────────

const ROUND_ORDER = ["r32", "r16", "qf", "sf", "final"];

export function getNextRound(round) {
  const idx = ROUND_ORDER.indexOf(round);
  if (idx === -1 || idx === ROUND_ORDER.length - 1) return null;
  return ROUND_ORDER[idx + 1];
}

export function propagateWinner(knockout, round, matchIndex, winnerId) {
  const updated = deepCloneKnockout(knockout);
  updated[round][matchIndex].winner = winnerId;

  const nextRound = getNextRound(round);
  if (!nextRound) return updated;

  const nextMatchIndex = Math.floor(matchIndex / 2);
  const isTeamA        = matchIndex % 2 === 0;

  if (isTeamA) {
    updated[nextRound][nextMatchIndex].teamA = winnerId;
  } else {
    updated[nextRound][nextMatchIndex].teamB = winnerId;
  }
  updated[nextRound][nextMatchIndex].winner = null;
  clearDownstream(updated, nextRound, nextMatchIndex);

  return updated;
}

function clearDownstream(knockout, round, matchIndex) {
  const match = knockout[round][matchIndex];
  if (!match.winner) return;

  const prevWinner  = match.winner;
  match.winner      = null;
  const nextRound   = getNextRound(round);
  if (!nextRound) return;

  const nextMatchIndex = Math.floor(matchIndex / 2);
  const isTeamA        = matchIndex % 2 === 0;
  const nextMatch      = knockout[nextRound][nextMatchIndex];

  if (isTeamA && nextMatch.teamA === prevWinner) {
    nextMatch.teamA = null;
    clearDownstream(knockout, nextRound, nextMatchIndex);
  } else if (!isTeamA && nextMatch.teamB === prevWinner) {
    nextMatch.teamB = null;
    clearDownstream(knockout, nextRound, nextMatchIndex);
  }
}

function deepCloneKnockout(knockout) {
  const clone = {};
  for (const round in knockout) {
    clone[round] = knockout[round].map((m) => ({ ...m }));
  }
  return clone;
}

// ─────────────────────────────────────────────────────────────
// TEAM LOOKUP
// ─────────────────────────────────────────────────────────────

export function getTeam(id) {
  if (!id) return null;
  return TEAMS.find((t) => t.id === id) ?? null;
}