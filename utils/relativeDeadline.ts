export type RelativeKind = "neutral" | "soon" | "overdue";

const parseDateFlexible = (str: string | null | undefined): Date | null => {
  if (!str) return null;
  const s = String(str);
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(s)) {
    const [d, m, y] = s.split(".").map(Number);
    return new Date(y, m - 1, d);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s);
  return null;
};

export const getRelativeDeadline = (dateStr: string): { text: string; kind: RelativeKind } => {
  const d = parseDateFlexible(dateStr);
  if (!d) return { text: "", kind: "neutral" };
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const due = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffMs = due.getTime() - start.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(diffMs / dayMs);

  const pluralUADay = (n: number) => {
    const abs = Math.abs(n) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return "днів";
    if (last === 1) return "день";
    if (last >= 2 && last <= 4) return "дні";
    return "днів";
  };

  if (diffDays === 0) return { text: "сьогодні", kind: "soon" };
  if (diffDays === 1) return { text: "завтра", kind: "soon" };
  if (diffDays > 1) {
    const kind: RelativeKind = diffDays >= 4 ? "neutral" : "soon";
    return { text: `через ${diffDays} ${pluralUADay(diffDays)}`, kind };
  }
  const late = Math.abs(diffDays);
  return { text: `прострочено на ${late} ${pluralUADay(late)}`, kind: "overdue" };
};
