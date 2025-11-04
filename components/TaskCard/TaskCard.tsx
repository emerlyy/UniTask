import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "../Pressable/Pressable";
import { theme } from "../../styles/theme";
import { formatDateDisplay } from "../../utils/formatDate";
import { getRelativeDeadline } from "../../utils/relativeDeadline";

export type TaskCardStatus = "assigned" | "pending" | "graded";

type Props = {
  title: string;
  course?: string;
  expirationDate: string;
  author?: string;
  mark?: number;
  status: TaskCardStatus;
  onPress: () => void;
};

export const TaskCard: React.FC<Props> = ({ title, course, expirationDate, author, mark, status, onPress }) => {
  const rel = getRelativeDeadline(expirationDate);
  const relStyle = rel.kind === "soon" ? styles.relativeSoon : rel.kind === "overdue" ? styles.relativeOverdue : styles.relativeNeutral;
  return (
    <Pressable
      rippleColor="accent"
      containerStyle={styles.cardContainer}
      pressableStyle={styles.card}
      onPress={onPress}
    >
      {status === "graded" && typeof mark === "number" && (
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>{Math.max(0, Math.min(100, Math.round(mark)))}/100</Text>
        </View>
      )}
      <View style={[styles.accent, styles[`accent_${status}` as const]]} />
      <View style={{ flex: 1 }}>
        <View style={styles.cardTopRow}>
          <Text style={styles.course} numberOfLines={1}>{course || ""}</Text>
          <View style={{ width: 1 }} />
        </View>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {!!author && (
          <Text style={styles.author}>Викладач: <Text style={styles.authorValue}>{author}</Text></Text>
        )}
        <Text style={styles.deadline} numberOfLines={1}>
          Дедлайн: <Text style={styles.deadlineValue}>{formatDateDisplay(expirationDate)}</Text>
          {rel.text ? <Text style={styles.bullet}> • </Text> : null}
          {rel.text ? <Text style={relStyle}>{rel.text}</Text> : null}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: { borderRadius: 12, overflow: "hidden" },
  card: {
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.colorLines,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    gap: 10,
    position: "relative",
  },
  scoreBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scoreBadgeText: { color: theme.white, fontWeight: "800", fontSize: 12 },
  accent: { width: 5, borderRadius: 999 },
  accent_assigned: { backgroundColor: "#90A4AE" },
  accent_pending: { backgroundColor: "#FF9800" },
  accent_graded: { backgroundColor: "#4CAF50" },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  course: { color: theme.accentColor, fontWeight: "700", maxWidth: "55%" },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  author: { color: "#6b7280" },
  authorValue: { color: "#111827", fontWeight: "600" },
  deadline: { color: "#6b7280" },
  deadlineValue: { color: "#111827", fontWeight: "600" },
  bullet: { color: "#9ca3af" },
  relativeNeutral: { color: "#6b7280" },
  relativeSoon: { color: "#f59e0b", fontWeight: "600" },
  relativeOverdue: { color: theme.red, fontWeight: "700" },
});
