import { useMemo } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import tasksData from "../constants/mockdata.json";
import { theme } from "../styles/theme";
import { formatDateDisplay } from "../utils/formatDate";

type TaskItem = (typeof tasksData)[number];

const parseDate = (str: string) => {
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(str)) {
    const [d, m, y] = str.split(".").map(Number);
    return new Date(y, m - 1, d);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return new Date(str);
  }
  return null;
};

const ProgressBar = ({ value, color = theme.accentColor }: { value: number; color?: string }) => (
  <View style={styles.progressOuter}>
    <View style={[styles.progressInner, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]} />
  </View>
);

export const StudentAnalyticsScreen = () => {
  const stats = useMemo(() => {
    const gradedList = tasksData.filter((t) => t.submitted && !!t.mark);
    const pendingList = tasksData.filter((t) => t.submitted && !t.mark);
    const assignedList = tasksData.filter((t) => !t.submitted);

    const total = tasksData.length;
    const graded = gradedList.length;
    const pending = pendingList.length;
    const assigned = assignedList.length;
    const avg = graded ? Math.round(gradedList.reduce((s, t) => s + (t.mark || 0), 0) / graded) : 0;

    const byDate = assignedList
      .map((t) => ({ t, d: parseDate(t.expirationDate) }))
      .filter((x) => x.d)
      .sort((a, b) => (a.d!.getTime() - b.d!.getTime()));

    const future = byDate.filter((x) => x.d!.getTime() >= Date.now());
    const upcomingList = (future.length ? future : byDate)
      .slice(0, 3)
      .map((x) => x.t as TaskItem);

    const topGraded = gradedList
      .slice()
      .sort((a, b) => (b.mark || 0) - (a.mark || 0))
      .slice(0, 3);

    const gradedPercent = total ? Math.round((graded / total) * 100) : 0;
    const pendingPercent = total ? Math.round((pending / total) * 100) : 0;
    const assignedPercent = total ? Math.round((assigned / total) * 100) : 0;

    const onTimeCount = gradedList.reduce((acc, t) => {
      const sd = parseDate((t as any).submittedAt as string);
      const dd = parseDate(t.expirationDate);
      if (sd && dd && sd.getTime() <= dd.getTime()) return acc + 1;
      return acc;
    }, 0);
    const onTimePercent = graded ? Math.round((onTimeCount / graded) * 100) : 0;

    return { graded, pending, assigned, avg, upcomingList, gradedPercent, pendingPercent, assignedPercent, onTimePercent };
  }, []);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Моя статистика</Text>

      <View style={styles.cards}>
        <View style={styles.card}><Text style={styles.value}>{stats.assigned}</Text><Text style={styles.label}>Призначено</Text></View>
        <View style={styles.card}><Text style={styles.value}>{stats.pending}</Text><Text style={styles.label}>Очікують</Text></View>
        <View style={styles.card}><Text style={styles.value}>{stats.graded}</Text><Text style={styles.label}>Оцінено</Text></View>
      </View>

      <View style={styles.avgCard}>
        <Text style={styles.avgLabel}>Середня оцінка</Text>
        <Text style={styles.avgValue}>{stats.avg}/100</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Розподіл статусів</Text>
        <View style={styles.row}><Text style={styles.rowLabel}>Призначено</Text><Text style={styles.rowValue}>{stats.assignedPercent}%</Text></View>
        <ProgressBar value={stats.assignedPercent} color={theme.statusAssigned} />
        <View style={styles.row}><Text style={styles.rowLabel}>Очікують</Text><Text style={styles.rowValue}>{stats.pendingPercent}%</Text></View>
        <ProgressBar value={stats.pendingPercent} color={theme.statusPending} />
        <View style={styles.row}><Text style={styles.rowLabel}>Оцінено</Text><Text style={styles.rowValue}>{stats.gradedPercent}%</Text></View>
        <ProgressBar value={stats.gradedPercent} color={theme.statusGraded} />
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Вчасність</Text>
        <View style={styles.row}><Text style={styles.rowLabel}>Здано вчасно</Text><Text style={styles.rowValue}>{stats.onTimePercent}%</Text></View>
        <ProgressBar value={stats.onTimePercent} color={theme.accentColor} />
        <Text style={[styles.label, { marginTop: 6 }]}>Розраховано за підтвердженими оцінками</Text>
      </View>

      {!!stats.upcomingList.length && (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Що зробити найближчим</Text>
          {stats.upcomingList.map((t, idx) => (
            <View key={`${t.title}-${idx}`} style={styles.topRow}>
              <Text style={styles.topTitle} numberOfLines={1}>{t.title}</Text>
              <Text style={styles.topMark}>{formatDateDisplay(t.expirationDate)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, gap: 16 },
  title: { fontSize: 20, fontWeight: "700" },
  cards: { flexDirection: "row", gap: 10 },
  card: { flex: 1, backgroundColor: theme.white, borderRadius: 12, borderWidth: 1, borderColor: theme.colorLines, padding: 14, alignItems: "center" },
  value: { fontSize: 18, fontWeight: "800" },
  label: { color: theme.textSecondary, marginTop: 4 },
  avgCard: { backgroundColor: theme.white, borderRadius: 12, borderWidth: 1, borderColor: theme.colorLines, padding: 16, alignItems: "center" },
  avgLabel: { color: theme.textSecondary, marginBottom: 6 },
  avgValue: { fontSize: 24, fontWeight: "800" },
  block: { backgroundColor: theme.white, borderRadius: 12, borderWidth: 1, borderColor: theme.colorLines, padding: 16, gap: 8 },
  blockTitle: { fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowLabel: { color: theme.textPrimary },
  rowValue: { fontWeight: "700" },
  progressOuter: { height: 8, backgroundColor: theme.colorLines, borderRadius: 999, overflow: "hidden" },
  progressInner: { height: 8, borderRadius: 999 },
  upTitle: { fontWeight: "600", marginTop: 4 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  topTitle: { flex: 1, marginRight: 10 },
  topMark: { fontWeight: "800" },
});
