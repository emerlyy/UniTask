export const formatDateDisplay = (value: string | null | undefined): string => {
  if (!value) return "";
  const str = String(value).trim();
  if (!str || str === "—") return str;

  const mIso = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}:\d{2}))?$/);
  if (mIso) {
    const [, y, mo, d, time] = mIso;
    const base = `${d}.${mo}.${y}`;
    return time ? `${base} ${time}` : base;
  }

  if (/^\d{2}\.\d{2}\.\d{4}(?:\s+\d{2}:\d{2})?$/.test(str)) {
    return str;
  }

  return str;
};
