import { useReducer, useEffect } from "react";
import {
  createInitialState,
  buildR32Matchups,
  propagateWinner,
  getThirdPlaceEligible,
} from "../utils/bracketUtils";

const STORAGE_KEY = "wc2026_bracket_v2";

// ─────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────

function bracketReducer(state, action) {
  switch (action.type) {

    /**
     * SELECT_GROUP_ADVANCER
     *
     * advancers array holds up to 3 ids in order: [1st, 2nd, 3rd].
     * Clicking a team cycles through these rules:
     *   - If already selected at any rank → deselect it (and shift down)
     *   - If fewer than 3 picked → append to the next available rank
     *   - If all 3 picked → replace the 3rd-place pick with the clicked team
     *
     * The third-place qualifying pool is derived from advancers[2] of
     * each group, so users must explicitly assign 3rd place.
     */
    case "SELECT_GROUP_ADVANCER": {
      const { group, teamId } = action;
      const groupData = state.groupStage[group];
      let advancers = [...groupData.advancers];

      if (advancers.includes(teamId)) {
        // Deselect — remove from whichever position it's in
        advancers = advancers.filter((id) => id !== teamId);
      } else if (advancers.length < 3) {
        // Append to next rank (0 = 1st, 1 = 2nd, 2 = 3rd)
        advancers = [...advancers, teamId];
      } else {
        // All 3 filled — replace the 3rd-place pick only
        advancers = [advancers[0], advancers[1], teamId];
      }

      const updatedGroupStage = {
        ...state.groupStage,
        [group]: { ...groupData, advancers },
      };

      // When 3rd-place pick changes, also clean up thirdPlace pool
      // (remove any id that is no longer a valid 3rd-placer)
      const eligibleIds = getThirdPlaceEligible(updatedGroupStage).map(t => t.id);
      const thirdPlace  = state.thirdPlace.filter(id => eligibleIds.includes(id));

      const r32 = buildR32Matchups(updatedGroupStage, thirdPlace);

      return {
        ...state,
        groupStage: updatedGroupStage,
        thirdPlace,
        knockout: {
          ...state.knockout,
          r32,
          r16:   resetMatches(state.knockout.r16),
          qf:    resetMatches(state.knockout.qf),
          sf:    resetMatches(state.knockout.sf),
          third: resetMatches(state.knockout.third),
          final: resetMatches(state.knockout.final),
        },
      };
    }

    // ── Third Place: toggle a third-place team as advancing ──
    case "TOGGLE_THIRD_PLACE": {
      const { teamId } = action;
      let thirdPlace = [...state.thirdPlace];

      if (thirdPlace.includes(teamId)) {
        thirdPlace = thirdPlace.filter((id) => id !== teamId);
      } else if (thirdPlace.length < 8) {
        thirdPlace = [...thirdPlace, teamId];
      }

      const r32 = buildR32Matchups(state.groupStage, thirdPlace);

      return {
        ...state,
        thirdPlace,
        knockout: {
          ...state.knockout,
          r32,
          r16:   resetMatches(state.knockout.r16),
          qf:    resetMatches(state.knockout.qf),
          sf:    resetMatches(state.knockout.sf),
          third: resetMatches(state.knockout.third),
          final: resetMatches(state.knockout.final),
        },
      };
    }

    // ── Knockout: pick a winner for a match ──
    case "ADVANCE_KNOCKOUT_TEAM": {
      const { round, matchIndex, winnerId } = action;
      const updatedKnockout = propagateWinner(
        state.knockout,
        round,
        matchIndex,
        winnerId
      );
      return { ...state, knockout: updatedKnockout };
    }

    // ── Reset everything ──
    case "RESET":
      return createInitialState();

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function resetMatches(matches) {
  return matches.map((m) => ({ ...m, teamA: null, teamB: null, winner: null }));
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded — fail silently */ }
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useBracket() {
  const [state, dispatch] = useReducer(
    bracketReducer,
    null,
    () => loadFromStorage() ?? createInitialState()
  );

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // ── Derived ───────────────────────────────────────────────

  /**
   * Third-place eligible teams: the team explicitly assigned rank 3
   * in each group (advancers[2]).
   */
  const thirdPlaceEligible = getThirdPlaceEligible(state.groupStage);

  /**
   * A group is "complete" when 1st, 2nd AND 3rd are all picked (3 slots).
   */
  const completedGroups = Object.values(state.groupStage).filter(
    (g) => g.advancers.length === 3
  ).length;

  const champion = state.knockout.final[0]?.winner ?? null;

  // ── Actions ───────────────────────────────────────────────

  function selectGroupAdvancer(group, teamId) {
    dispatch({ type: "SELECT_GROUP_ADVANCER", group, teamId });
  }

  function toggleThirdPlace(teamId) {
    dispatch({ type: "TOGGLE_THIRD_PLACE", teamId });
  }

  function advanceKnockoutTeam(round, matchIndex, winnerId) {
    dispatch({ type: "ADVANCE_KNOCKOUT_TEAM", round, matchIndex, winnerId });
  }

  function resetBracket() {
    dispatch({ type: "RESET" });
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    groupStage: state.groupStage,
    thirdPlace: state.thirdPlace,
    knockout: state.knockout,
    thirdPlaceEligible,
    completedGroups,
    champion,
    selectGroupAdvancer,
    toggleThirdPlace,
    advanceKnockoutTeam,
    resetBracket,
  };
}