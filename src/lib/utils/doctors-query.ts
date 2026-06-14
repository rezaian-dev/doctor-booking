// 🔗 Single source of truth for turning URL search-params into the /api/doctors query. Shared by
//    useDoctors (client) and the server page (SSR fallbackData) so the SWR key and prefetched data
//    always match — no skeleton flash, no double-fetch. 🧠

// 🪶 Minimal read-only shape satisfied by BOTH URLSearchParams and
//    Next's ReadonlyURLSearchParams → callers pass either without casting.
export interface ReadonlyParams {
  get(key: string): string | null;
  getAll(key: string): string[];
}

// 🗺️ UI availability id → API flag(s)
const AVAILABILITY_MAP: Record<string, Record<string, string>> = {
  "available-today": { availableToday: "true" },
  "online-visit": { onlineVisit: "true" },
};

// 🔑 nuqs stores multi-values comma-joined in ONE param → split + clean
const getArray = (sp: ReadonlyParams, key: string): string[] =>
  sp.getAll(key).flatMap((v) => v.split(",").map((s) => s.trim()).filter(Boolean));

// 🧱 Build the canonical API params (stable order → stable cache key)
export function buildDoctorsApiParams(sp: ReadonlyParams): URLSearchParams {
  const params = new URLSearchParams();

  // ── Scalars ────────────────────────────────────────────────────────────
  params.set("page", sp.get("page") || "1");

  const search = sp.get("search");
  if (search) params.set("search", search);

  const gender = sp.get("gender");
  if (gender) params.set("gender", gender);

  // 🔃 'default' means "no sort" → never sent to the API
  const sort = sp.get("sort");
  if (sort && sort !== "default") params.set("sort", sort);

  // ── Arrays: split comma-joined values, append each separately ────────────
  (["specialty", "city", "insurance", "experience"] as const).forEach((k) =>
    getArray(sp, k).forEach((v) => params.append(k, v)),
  );

  // ── Availability → mapped API flags ──────────────────────────────────────
  getArray(sp, "availability").forEach((key) => {
    const mapped = AVAILABILITY_MAP[key];
    if (mapped) Object.entries(mapped).forEach(([k, v]) => params.set(k, v));
  });

  return params;
}

// 🔗 Convenience: the full SWR key (path + query) for a given param set
export const doctorsApiKey = (sp: ReadonlyParams): string =>
  `/api/doctors?${buildDoctorsApiParams(sp).toString()}`;
