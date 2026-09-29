/**
 * Structured institutional content: the facts and the ordering.
 *
 * Only non-translatable data lives here (leader names, counts, icon choices,
 * dictionary keys). All prose lives in dictionaries/pt.json and en.json and is
 * looked up by the `key` fields below.
 *
 * Source of truth: CLAUDE.md → "Institutional content".
 */

/* --------------------------------------------------------------------------
   What we do — the 5 movements
   -------------------------------------------------------------------------- */
export const movements = [
  { key: "conectar", icon: "Users" },
  { key: "capacitar", icon: "GraduationCap" },
  { key: "impulsionar", icon: "Rocket" },
  { key: "desenvolver", icon: "TrendingUp" },
  { key: "impacto", icon: "HeartHandshake" },
] as const;

export type MovementKey = (typeof movements)[number]["key"];

/* --------------------------------------------------------------------------
   How it works — the 3 pillars
   --------------------------------------------------------------------------
   Leaders and frequency are facts, not copy: they stay here so both languages
   render the same names.
   -------------------------------------------------------------------------- */
export const pillars = [
  {
    key: "eventos",
    icon: "CalendarDays",
    leaders: ["Henrique", "Ademir"],
  },
  {
    key: "reunioes",
    icon: "MessagesSquare",
    leaders: ["Vinícius", "Reinaldo"],
  },
  {
    key: "treinamentos",
    icon: "GraduationCap",
    leaders: ["Everton", "Milton"],
  },
] as const;

export type PillarKey = (typeof pillars)[number]["key"];

/* --------------------------------------------------------------------------
   The whole entrepreneur — five dimensions
   -------------------------------------------------------------------------- */
export const dimensions = [
  { key: "mente", icon: "Brain" },
  { key: "corpo", icon: "Activity" },
  { key: "espirito", icon: "Sparkles" },
  { key: "relacionamentos", icon: "Users" },
  { key: "negocios", icon: "Briefcase" },
] as const;

export type DimensionKey = (typeof dimensions)[number]["key"];

/* --------------------------------------------------------------------------
   Culture
   -------------------------------------------------------------------------- */
export const cultureValues = [
  { key: "contribuicao", icon: "Handshake" },
  { key: "relacionamento", icon: "Users" },
  { key: "crescimento", icon: "TrendingUp" },
  { key: "oportunidades", icon: "Lightbulb" },
  { key: "voluntariado", icon: "HeartHandshake" },
  { key: "intencionalidade", icon: "Target" },
] as const;

/* --------------------------------------------------------------------------
   Member journey — Evento → … → Voluntário/Líder
   -------------------------------------------------------------------------- */
export const journeySteps = [
  "evento",
  "conhece",
  "membro",
  "reunioes",
  "treinamentos",
  "parceiros",
  "desenvolve",
  "contribui",
  "lidera",
] as const;

export type JourneyStep = (typeof journeySteps)[number];

/* --------------------------------------------------------------------------
   Community guidelines
   -------------------------------------------------------------------------- */
export const guidelines = [
  { key: "semPolitica", icon: "Ban" },
  { key: "principiosCristaos", icon: "Cross" },
  { key: "portugues", icon: "Languages" },
  { key: "convidados", icon: "UserPlus" },
  { key: "treinamentosMembros", icon: "Lock" },
] as const;

/* --------------------------------------------------------------------------
   Membership approval steps
   -------------------------------------------------------------------------- */
export const approvalSteps = ["candidatura", "conversa", "analise", "boasVindas"] as const;

/* --------------------------------------------------------------------------
   FAQ — order of the questions on the Membresia page
   -------------------------------------------------------------------------- */
export const faqKeys = [
  "valor",
  "quemPode",
  "aprovacao",
  "convidado",
  "idioma",
  "treinamentos",
  "politica",
  "voluntariado",
] as const;

/* --------------------------------------------------------------------------
   Relationship hub — the 4 partner types
   -------------------------------------------------------------------------- */
export const partnerTypes = [
  { key: "outrosEstados", icon: "Globe2" },
  { key: "parceirosLocais", icon: "Mic" },
  { key: "espacos", icon: "MapPin" },
  { key: "foraDaCaixa", icon: "Lightbulb" },
] as const;

/* --------------------------------------------------------------------------
   Leadership — year one: 7 leaders, 1 President + 2 per pillar
   -------------------------------------------------------------------------- */
export const leadershipCycle = ["planejar", "delegar", "executar", "avaliar"] as const;

/** Total leaders in year one: 1 general leader + 2 per pillar. */
export const leadershipCount = 1 + pillars.length * 2;
