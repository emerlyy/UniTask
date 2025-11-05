import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../components/Button/Button";
import { FilePicker } from "../components/FilePicker/FilePicker";
import { Pill } from "../components/Pill/Pill";
import { RootStackParamList } from "../navigation/AppNav";
import { theme } from "../styles/theme";
import { formatDateDisplay } from "../utils/formatDate";
import { getRelativeDeadline } from "../utils/relativeDeadline";

type TaskScreenProps = NativeStackScreenProps<RootStackParamList, "Task">;

const parseDateLocal = (value?: string | null): Date | null => {
  if (!value) return null;
  const str = String(value).trim();
  let m = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}))?$/);
  if (m) {
    const [, y, mo, d, hh, mm] = m;
    return new Date(Number(y), Number(mo) - 1, Number(d), hh ? Number(hh) : 0, mm ? Number(mm) : 0, 0, 0);
  }
  m = str.match(/^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  if (m) {
    const [, d, mo, y, hh, mm] = m;
    return new Date(Number(y), Number(mo) - 1, Number(d), hh ? Number(hh) : 0, mm ? Number(mm) : 0, 0, 0);
  }
  const dt = new Date(str);
  if (isNaN(+dt)) return null;
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), 0, 0);
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

export const TaskScreen = ({
  route: {
    params: { title, body, expirationDate, publishDate, mark, author, course, status },
  },
}: TaskScreenProps) => {
  const [tab, setTab] = useState<"details" | "description">("details");

  const rel = useMemo(() => getRelativeDeadline(expirationDate), [expirationDate]);
  const progressElapsed = useMemo(() => {
    const parsedStart = parseDateLocal(publishDate);
    const parsedEnd = parseDateLocal(expirationDate);
    if (!parsedStart || !parsedEnd) return 0;
    const start = startOfDay(parsedStart);
    const end = endOfDay(parsedEnd);
    if (end <= start) return 0;
    const now = new Date();
    if (now <= start) return 0;
    if (now >= end) return 100;
    const pct = ((+now - +start) / (+end - +start)) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
  }, [publishDate, expirationDate]);
  const progress = useMemo(() => 100 - progressElapsed, [progressElapsed]);

  const grade = typeof mark === "number" ? Math.max(0, Math.min(100, Math.round(mark))) : null;
  const durationDays = useMemo(() => {
    const s = parseDateLocal(publishDate);
    const e = parseDateLocal(expirationDate);
    if (!s || !e) return null;
    const start = startOfDay(s).getTime();
    const end = endOfDay(e).getTime();
    if (end <= start) return 0;
    const dayMs = 24 * 60 * 60 * 1000;
    return Math.round((end - start) / dayMs);
  }, [publishDate, expirationDate]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.heroBgShapeA} />
          <View style={styles.heroBgShapeB} />

          <View style={styles.heroTopRow}>
            {!!course && <Text style={styles.coursePill}>{course}</Text>}
            {status && (
              <View style={[styles.statusPill, styles[`status_${status}` as const]]}>
                <Text style={styles.statusText}>
                  {status === "assigned" ? "Призначено" : status === "pending" ? "Очікують" : "Оцінено"}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.heroTitle} numberOfLines={3}>{title}</Text>

          <View style={styles.heroBottomRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroSub}>Дедлайн</Text>
              <Text style={styles.heroDeadline} numberOfLines={1}>{formatDateDisplay(expirationDate)}{rel.text ? ` • ${rel.text}` : ""}</Text>
            </View>
            <View style={styles.scoreBadgeLarge}>
              <Text style={styles.scoreValue}>{grade !== null ? grade : "—"}</Text>
              <Text style={styles.scoreSuffix}>/100</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Скільки залишилось</Text>
            <Text style={styles.progressValue}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressFootText}>{publishDate ? formatDateDisplay(publishDate) : "—"}</Text>
            <Text style={styles.progressFootText}>{formatDateDisplay(expirationDate)}</Text>
          </View>
        </View>

        <View style={styles.tabsRow}>
          <Pill label="Деталі" active={tab === "details"} onPress={() => setTab("details")} />
          <Pill label="Опис" active={tab === "description"} onPress={() => setTab("description")} />
        </View>

        

        {tab === "details" && (
          <View style={styles.cardAlt}>
            <Text style={styles.cardTitle}>Деталі завдання</Text>
            <View style={styles.kvGrid}>
              <View style={styles.kvItem}><Text style={styles.kvKey}>Курс</Text><Text style={styles.kvVal}>{course || "—"}</Text></View>
              <View style={styles.kvItem}><Text style={styles.kvKey}>Викладач</Text><Text style={styles.kvVal}>{author || "—"}</Text></View>
              <View style={styles.kvItem}><Text style={styles.kvKey}>Початок</Text><Text style={styles.kvVal}>{publishDate ? formatDateDisplay(publishDate) : "—"}</Text></View>
              <View style={styles.kvItem}><Text style={styles.kvKey}>Дедлайн</Text><Text style={styles.kvVal}>{formatDateDisplay(expirationDate)}</Text></View>
              <View style={styles.kvItem}><Text style={styles.kvKey}>Тривалість</Text><Text style={styles.kvVal}>{durationDays !== null ? `${durationDays} дн.` : "—"}</Text></View>
            </View>
          </View>
        )}

        {tab === "description" && (
          <View style={styles.cardCallout}>
            <Text style={styles.cardTitle}>Опис</Text>
            <Text style={styles.bodyText}>{body}</Text>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <View style={styles.footerInner}>
            <Text style={styles.footerTitle}>Ваша відповідь</Text>
            <FilePicker />
            <Button title="Надіслати" fullWidth onPress={async () => { console.log("Submit"); }} />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: { flex: 1 },
  scrollContent: { padding: 12, paddingBottom: 12, gap: 12 },

  hero: {
    backgroundColor: theme.accentColor,
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
    gap: 10,
    position: "relative",
  },
  heroBgShapeA: {
    position: "absolute",
    right: -30,
    top: -20,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: theme.overlayWhiteLow,
  },
  heroBgShapeB: {
    position: "absolute",
    left: -40,
    bottom: -40,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: theme.overlayWhiteLow,
  },
  heroTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  coursePill: { color: theme.accentColor, backgroundColor: theme.white, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontWeight: "800" },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { color: theme.white, fontSize: 12, fontWeight: "700" },
  status_assigned: { backgroundColor: theme.statusAssigned },
  status_pending: { backgroundColor: theme.statusPending },
  status_graded: { backgroundColor: theme.statusGraded },
  heroTitle: { color: theme.white, fontSize: 22, lineHeight: 28, fontWeight: "900" },
  heroBottomRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  heroSub: { color: theme.accentText, fontWeight: "700", fontSize: 12 },
  heroDeadline: { color: theme.white, fontWeight: "800" },
  scoreBadgeLarge: { backgroundColor: theme.overlayWhiteMid, borderWidth: 1, borderColor: theme.overlayWhiteHigh, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  scoreValue: { color: theme.white, fontSize: 20, fontWeight: "900", lineHeight: 22 },
  scoreSuffix: { color: theme.accentText, fontWeight: "700" },

  progressCard: {
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colorLines,
    padding: 12,
    gap: 10,
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { color: theme.textSecondary, fontWeight: "700" },
  progressValue: { color: theme.textPrimary, fontWeight: "800" },
  progressBar: { height: 8, backgroundColor: theme.accentColorMuted, borderRadius: 999, overflow: "hidden" },
  progressFill: { height: 8, backgroundColor: theme.accentColor, borderRadius: 999 },
  progressFooter: { flexDirection: "row", justifyContent: "space-between" },
  progressFootText: { color: theme.textSecondary, fontSize: 12 },

  tabsRow: { flexDirection: "row", gap: 8 },

  card: {
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colorLines,
    padding: 12,
    gap: 8,
  },
  cardAlt: {
    backgroundColor: theme.accentColorMuted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colorLines,
    padding: 12,
    gap: 10,
  },
  cardCallout: {
    backgroundColor: theme.white,
    borderLeftWidth: 4,
    borderLeftColor: theme.accentColor,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colorLines,
    padding: 12,
    gap: 8,
  },
  cardTitle: { fontWeight: "900", color: theme.textPrimary },
  bodyText: { fontSize: 14, lineHeight: 20, color: theme.textPrimary },

  kv: { color: theme.textSecondary },
  kvValue: { color: theme.textPrimary, fontWeight: "700" },
  kvGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  kvItem: { width: "48%", backgroundColor: theme.white, borderWidth: 1, borderColor: theme.colorLines, borderRadius: 8, padding: 10 },
  kvKey: { color: theme.textSecondary, fontSize: 12, marginBottom: 6 },
  kvVal: { color: theme.textPrimary, fontWeight: "700" },

  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colorLines,
    backgroundColor: theme.white,
  },
  footerInner: { padding: 12, gap: 10 },
  footerTitle: { fontWeight: "800", color: theme.textPrimary },
});
