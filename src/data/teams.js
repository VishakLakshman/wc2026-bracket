/**
 * FIFA World Cup 2026 — All 48 Qualified Teams
 *
 * Groups A–L, 4 teams each.
 * Host nations: USA (Group A), Mexico (Group B), Canada (Group C).
 *
 * id:            unique lowercase string — must be stable (used as state keys)
 * flag:          emoji flag
 * code:          ISO 3166-1 alpha-2 (for future SVG flag integration)
 * group:         "A" – "L"
 * confederation: AFC | CAF | CONCACAF | CONMEBOL | OFC | UEFA
 */

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export const TEAMS = [
  // ── GROUP A ──────────────────────────────────────────────
{ id: "mex", name: "Mexico",            flag: "🇲🇽", code: "MX", group: "A", confederation: "CONCACAF" },
{ id: "rsa", name: "South Africa",      flag: "🇿🇦", code: "ZA", group: "A", confederation: "CAF"      },
{ id: "kor", name: "South Korea",       flag: "🇰🇷", code: "KR", group: "A", confederation: "AFC"      },
{ id: "cze", name: "Czechia",           flag: "🇨🇿", code: "CZ", group: "A", confederation: "UEFA"     },

// ── GROUP B ──────────────────────────────────────────────
{ id: "can", name: "Canada",            flag: "🇨🇦", code: "CA", group: "B", confederation: "CONCACAF" },
{ id: "sui", name: "Switzerland",       flag: "🇨🇭", code: "CH", group: "B", confederation: "UEFA"     },
{ id: "qat", name: "Qatar",             flag: "🇶🇦", code: "QA", group: "B", confederation: "AFC"      },
{ id: "bih", name: "Bosnia & Herzegovina", flag: "🇧🇦", code: "BA", group: "B", confederation: "UEFA"  },

// ── GROUP C ──────────────────────────────────────────────
{ id: "bra", name: "Brazil",            flag: "🇧🇷", code: "BR", group: "C", confederation: "CONMEBOL" },
{ id: "mar", name: "Morocco",           flag: "🇲🇦", code: "MA", group: "C", confederation: "CAF"      },
{ id: "sco", name: "Scotland",          flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", code: "GB-SCT", group: "C", confederation: "UEFA"  },
{ id: "hai", name: "Haiti",             flag: "🇭🇹", code: "HT", group: "C", confederation: "CONCACAF" },

// ── GROUP D ──────────────────────────────────────────────
{ id: "usa", name: "United States",     flag: "🇺🇸", code: "US", group: "D", confederation: "CONCACAF" },
{ id: "par", name: "Paraguay",          flag: "🇵🇾", code: "PY", group: "D", confederation: "CONMEBOL" },
{ id: "aus", name: "Australia",         flag: "🇦🇺", code: "AU", group: "D", confederation: "AFC"      },
{ id: "tur", name: "Türkiye",           flag: "🇹🇷", code: "TR", group: "D", confederation: "UEFA"     },

// ── GROUP E ──────────────────────────────────────────────
{ id: "ger", name: "Germany",           flag: "🇩🇪", code: "DE", group: "E", confederation: "UEFA"     },
{ id: "ecu", name: "Ecuador",           flag: "🇪🇨", code: "EC", group: "E", confederation: "CONMEBOL" },
{ id: "civ", name: "Ivory Coast",       flag: "🇨🇮", code: "CI", group: "E", confederation: "CAF"      },
{ id: "cuw", name: "Curaçao",           flag: "🇨🇼", code: "CW", group: "E", confederation: "CONCACAF" },

// ── GROUP F ──────────────────────────────────────────────
{ id: "ned", name: "Netherlands",       flag: "🇳🇱", code: "NL", group: "F", confederation: "UEFA"     },
{ id: "jpn", name: "Japan",             flag: "🇯🇵", code: "JP", group: "F", confederation: "AFC"      },
{ id: "tun", name: "Tunisia",           flag: "🇹🇳", code: "TN", group: "F", confederation: "CAF"      },
{ id: "swe", name: "Sweden",            flag: "🇸🇪", code: "SE", group: "F", confederation: "UEFA"     },

// ── GROUP G ──────────────────────────────────────────────
{ id: "bel", name: "Belgium",           flag: "🇧🇪", code: "BE", group: "G", confederation: "UEFA"     },
{ id: "irn", name: "Iran",              flag: "🇮🇷", code: "IR", group: "G", confederation: "AFC"      },
{ id: "egy", name: "Egypt",             flag: "🇪🇬", code: "EG", group: "G", confederation: "CAF"      },
{ id: "nzl", name: "New Zealand",       flag: "🇳🇿", code: "NZ", group: "G", confederation: "OFC"      },

// ── GROUP H ──────────────────────────────────────────────
{ id: "esp", name: "Spain",             flag: "🇪🇸", code: "ES", group: "H", confederation: "UEFA"     },
{ id: "uru", name: "Uruguay",           flag: "🇺🇾", code: "UY", group: "H", confederation: "CONMEBOL" },
{ id: "ksa", name: "Saudi Arabia",      flag: "🇸🇦", code: "SA", group: "H", confederation: "AFC"      },
{ id: "cpv", name: "Cape Verde",        flag: "🇨🇻", code: "CV", group: "H", confederation: "CAF"      },

// ── GROUP I ──────────────────────────────────────────────
{ id: "fra", name: "France",            flag: "🇫🇷", code: "FR", group: "I", confederation: "UEFA"     },
{ id: "sen", name: "Senegal",           flag: "🇸🇳", code: "SN", group: "I", confederation: "CAF"      },
{ id: "nor", name: "Norway",            flag: "🇳🇴", code: "NO", group: "I", confederation: "UEFA"     },
{ id: "irq", name: "Iraq",              flag: "🇮🇶", code: "IQ", group: "I", confederation: "AFC"      },

// ── GROUP J ──────────────────────────────────────────────
{ id: "arg", name: "Argentina",         flag: "🇦🇷", code: "AR", group: "J", confederation: "CONMEBOL" },
{ id: "aut", name: "Austria",           flag: "🇦🇹", code: "AT", group: "J", confederation: "UEFA"     },
{ id: "alg", name: "Algeria",           flag: "🇩🇿", code: "DZ", group: "J", confederation: "CAF"      },
{ id: "jor", name: "Jordan",            flag: "🇯🇴", code: "JO", group: "J", confederation: "AFC"      },

// ── GROUP K ──────────────────────────────────────────────
{ id: "por", name: "Portugal",          flag: "🇵🇹", code: "PT", group: "K", confederation: "UEFA"     },
{ id: "col", name: "Colombia",          flag: "🇨🇴", code: "CO", group: "K", confederation: "CONMEBOL" },
{ id: "uzb", name: "Uzbekistan",        flag: "🇺🇿", code: "UZ", group: "K", confederation: "AFC"      },
{ id: "cod", name: "DR Congo",          flag: "🇨🇩", code: "CD", group: "K", confederation: "CAF"      },

// ── GROUP L ──────────────────────────────────────────────
{ id: "eng", name: "England",           flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "GB-ENG", group: "L", confederation: "UEFA"  },
{ id: "cro", name: "Croatia",           flag: "🇭🇷", code: "HR", group: "L", confederation: "UEFA"     },
{ id: "pan", name: "Panama",            flag: "🇵🇦", code: "PA", group: "L", confederation: "CONCACAF" },
{ id: "gha", name: "Ghana",             flag: "🇬🇭", code: "GH", group: "L", confederation: "CAF"      },
];

/** Returns all teams in a group. */
export function getTeamsByGroup(group) {
  return TEAMS.filter((t) => t.group === group);
}

/** Returns a team by id, or undefined. */
export function getTeamById(id) {
  return TEAMS.find((t) => t.id === id);
}