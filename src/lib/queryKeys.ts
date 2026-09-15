export const queryKeys = {
  board: {
    all: ["board"] as const,
    byYear: (year: string) => ["board", year] as const,
    // Normalize memberType (string or string[]) and include yearTo to fully represent fetch params
    byYearAndType: (
      yearFrom: string | number,
      yearTo: string | number | undefined,
      memberType: string | string[],
      position?: string,
    ) => {
      const normalizeMemberType = (mt: string | string[]) => {
        const arr = Array.isArray(mt)
          ? mt
              .slice()
              .map((s) => s.trim())
              .filter(Boolean)
          : String(mt)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
        const sorted = arr.slice().sort((a, b) => a.localeCompare(b));
        return sorted.join(",");
      };

      const yf = String(yearFrom);
      const yt = yearTo == null ? null : String(yearTo);
      const normalized = normalizeMemberType(memberType ?? "");
      return ["board", yf, yt, normalized, position ?? null] as const;
    },
  },
  events: {
    all: ["events"] as const,
    byId: (id: string) => ["events", id] as const,
    bySlug: (slug: string) => ["events", "slug", slug] as const,
  },
  committees: {
    all: ["committees"] as const,
  },
  boardYears: {
    all: ["boardYears"] as const,
  },
  boardMeta: {
    all: ["boardMeta"] as const,
  },
  feedback: {
    all: ["feedback"] as const,
  },
  home: {
    all: ["home"] as const,
  },
  forms: {
    all: ["forms"] as const,
    bySlug: (slug: string) => ["forms", slug] as const,
    publicBySlug: (slug: string) => ["forms", "public", slug] as const,
    submissions: (slug: string) => ["forms", slug, "submissions"] as const,
    export: (slug: string) => ["forms", slug, "export"] as const,
  },
};

// helper removed (normalized inline in builder)
