import type { Mission, UserProfile } from "@/lib/types";

// --- Signo zodiacal (occidental) — cálculo exacto por rango de fechas ---

const ZODIAC_SIGNS = [
  { name: "Capricornio", symbol: "♑", from: [12, 22], to: [1, 19] },
  { name: "Acuario", symbol: "♒", from: [1, 20], to: [2, 18] },
  { name: "Piscis", symbol: "♓", from: [2, 19], to: [3, 20] },
  { name: "Aries", symbol: "♈", from: [3, 21], to: [4, 19] },
  { name: "Tauro", symbol: "♉", from: [4, 20], to: [5, 20] },
  { name: "Géminis", symbol: "♊", from: [5, 21], to: [6, 20] },
  { name: "Cáncer", symbol: "♋", from: [6, 21], to: [7, 22] },
  { name: "Leo", symbol: "♌", from: [7, 23], to: [8, 22] },
  { name: "Virgo", symbol: "♍", from: [8, 23], to: [9, 22] },
  { name: "Libra", symbol: "♎", from: [9, 23], to: [10, 22] },
  { name: "Escorpio", symbol: "♏", from: [10, 23], to: [11, 21] },
  { name: "Sagitario", symbol: "♐", from: [11, 22], to: [12, 21] },
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export function getZodiacSign(birthDate: string): ZodiacSign {
  const [, monthStr, dayStr] = birthDate.split("-");
  const month = Number(monthStr);
  const day = Number(dayStr);
  const sign = ZODIAC_SIGNS.find(({ from, to }) => {
    const [fm, fd] = from;
    const [tm, td] = to;
    if (fm === tm) return month === fm && day >= fd && day <= td;
    if (month === fm) return day >= fd;
    if (month === tm) return day <= td;
    return false;
  });
  return sign ?? ZODIAC_SIGNS[0];
}

// --- Kin maya (Tzolk'in) — cálculo estándar por día juliano, correlación GMT 584283 ---
// Nota: existen distintas correlaciones (GMT/Thompson); se marca como estimación.

const TZOLKIN_SIGNS = [
  "Imix", "Ik", "Akbal", "Kan", "Chicchan", "Cimi", "Manik", "Lamat", "Muluc", "Oc",
  "Chuen", "Eb", "Ben", "Ix", "Men", "Cib", "Caban", "Etznab", "Cauac", "Ahau",
] as const;

function toJulianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export interface MayanKin {
  tone: number;
  sign: string;
  kinNumber: number;
}

export function getMayanKin(birthDate: string): MayanKin {
  const [yearStr, monthStr, dayStr] = birthDate.split("-");
  const jdn = toJulianDayNumber(Number(yearStr), Number(monthStr), Number(dayStr));
  const GMT_CORRELATION = 584283;
  const kinNumber = (((jdn - GMT_CORRELATION) % 260) + 260) % 260 || 260;
  const tone = ((kinNumber - 1) % 13) + 1;
  const sign = TZOLKIN_SIGNS[(kinNumber - 1) % 20];
  return { tone, sign, kinNumber };
}

// --- Diseño humano — placeholder determinístico hasta definir motor/API real ---

const HUMAN_DESIGN_TYPES = ["Generador", "Generador Manifestante", "Manifestador", "Proyector", "Reflector"] as const;

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getHumanDesignType(profile: Pick<UserProfile, "birthDate" | "birthTime">): string {
  const seed = hashString(`${profile.birthDate}T${profile.birthTime ?? "unknown"}`);
  return HUMAN_DESIGN_TYPES[seed % HUMAN_DESIGN_TYPES.length];
}

// --- Misiones sugeridas según lo que cada signo viene a integrar ---

const INTEGRATIONS: Record<string, { integration: string; missions: Omit<Mission, "id">[] }> = {
  Aries: {
    integration: "paciencia y escucha",
    missions: [
      { title: "Frenar antes de reaccionar", description: "Notar el impulso y esperar un minuto antes de actuar." },
      { title: "Terminar lo empezado", description: "Elegir un pendiente viejo y cerrarlo esta semana." },
    ],
  },
  Tauro: {
    integration: "flexibilidad ante el cambio",
    missions: [
      { title: "Probar algo distinto a tu rutina", description: "Cambiar un hábito fijo por una semana." },
      { title: "Soltar el control en una decisión chica", description: "Dejar que otra persona elija por vos una vez." },
    ],
  },
  Géminis: {
    integration: "profundidad y foco",
    missions: [
      { title: "Sostener un tema una semana entera", description: "Elegir un solo interés y profundizarlo sin saltar a otro." },
      { title: "Escuchar sin preparar la respuesta", description: "Practicar escucha activa en una conversación por día." },
    ],
  },
  Cáncer: {
    integration: "límites sanos",
    missions: [
      { title: "Decir que no una vez esta semana", description: "Identificar un pedido que no querés aceptar y declinarlo." },
      { title: "Nombrar una emoción antes de actuar por ella", description: "Registrar cómo te sentís antes de responder." },
    ],
  },
  Leo: {
    integration: "humildad y trabajo en equipo",
    missions: [
      { title: "Ceder el protagonismo", description: "Dejar que otra persona lidere una actividad grupal." },
      { title: "Pedir feedback en vez de aprobación", description: "Preguntar qué se puede mejorar, no si estuvo bien." },
    ],
  },
  Virgo: {
    integration: "aceptación de lo imperfecto",
    missions: [
      { title: "Entregar algo 'suficientemente bueno'", description: "Terminar una tarea sin pulirla de más." },
      { title: "Bajar la autocrítica un cambio", description: "Anotar 1 logro del día sin mencionar lo que faltó." },
    ],
  },
  Libra: {
    integration: "decisión propia",
    missions: [
      { title: "Elegir sin pedir segunda opinión", description: "Tomar una decisión chica hoy sin consultar a nadie." },
      { title: "Sostener un desacuerdo", description: "Expresar una opinión distinta en una conversación." },
    ],
  },
  Escorpio: {
    integration: "confianza y soltar el control",
    missions: [
      { title: "Delegar algo importante", description: "Pasarle una tarea propia a otra persona sin supervisarla." },
      { title: "Compartir algo vulnerable", description: "Contarle a alguien de confianza algo que normalmente reservás." },
    ],
  },
  Sagitario: {
    integration: "compromiso y constancia",
    missions: [
      { title: "Sostener un hábito 7 días seguidos", description: "Elegir uno chico y no cortar la racha." },
      { title: "Cerrar un ciclo abierto", description: "Terminar algo que empezaste con entusiasmo y quedó a medias." },
    ],
  },
  Capricornio: {
    integration: "disfrute del proceso",
    missions: [
      { title: "Hacer algo sin objetivo productivo", description: "Dedicar 30 minutos a algo solo por placer." },
      { title: "Celebrar un avance chico", description: "Reconocer un progreso sin pasar directo al siguiente paso." },
    ],
  },
  Acuario: {
    integration: "conexión emocional cercana",
    missions: [
      { title: "Tener una conversación 1 a 1 sin distracciones", description: "Elegir a alguien cercano y estar presente." },
      { title: "Pedir ayuda en algo personal", description: "Compartir una dificultad real con alguien de confianza." },
    ],
  },
  Piscis: {
    integration: "estructura y límites con la realidad",
    missions: [
      { title: "Planificar el día de mañana hoy", description: "Escribir 3 prioridades concretas antes de dormir." },
      { title: "Poner un límite de tiempo a una tarea difusa", description: "Definir cuándo empieza y termina." },
    ],
  },
};

export interface NatalCard {
  sign: ZodiacSign;
  humanDesignType: string;
  mayanKin: MayanKin;
  integration: string;
  missions: Mission[];
}

export function buildNatalCard(profile: UserProfile): NatalCard {
  const sign = getZodiacSign(profile.birthDate);
  const humanDesignType = getHumanDesignType(profile);
  const mayanKin = getMayanKin(profile.birthDate);
  const table = INTEGRATIONS[sign.name] ?? INTEGRATIONS.Aries;

  return {
    sign,
    humanDesignType,
    mayanKin,
    integration: table.integration,
    missions: table.missions.map((m, i) => ({ id: `${sign.name}-${i}`, ...m })),
  };
}
