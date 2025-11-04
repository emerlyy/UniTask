import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/Button/Button";
import { FilePicker } from "../components/FilePicker/FilePicker";
import { RootStackParamList } from "../navigation/AppNav";
import { theme } from "../styles/theme";
import { getMarkText } from "../utils/getMarkText";
import { formatDateDisplay } from "../utils/formatDate";

type TaskScreenProps = NativeStackScreenProps<RootStackParamList, "Task">;

export const TaskScreen = ({
  route: {
    params: { title, body, expirationDate, publishDate, mark, author, course, status },
  },
}: TaskScreenProps) => {
  const isSubmitted = true;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            {status && (
              <View style={[styles.statusPill, styles[`status_${status}` as const]]}>
                <Text style={styles.statusText}>
                  {status === "assigned" ? "Призначено" : status === "pending" ? "Очікують" : "Оцінено"}
                </Text>
              </View>
            )}
            <Text style={styles.markText}>{getMarkText(isSubmitted, mark)}</Text>
          </View>
          <Text style={styles.taskTitle}>{title}</Text>
          {!!course && (
            <Text style={styles.course}>Курс: <Text style={styles.courseValue}>{course}</Text></Text>
          )}
          <Text style={styles.deadline}>Дедлайн: <Text style={styles.deadlineValue}>{formatDateDisplay(expirationDate)}</Text></Text>
          {!!author && (
            <Text style={styles.author}>Викладач: <Text style={styles.authorValue}>{author}</Text></Text>
          )}
        </View>

        <View style={styles.blockCard}>
          <Text style={styles.blockTitle}>Опис завдання</Text>
          <Text style={styles.taskBody}>{body}</Text>
        </View>

        <View style={styles.blockCard}>
          <Text style={styles.blockTitle}>Ваша робота</Text>
          <FilePicker />
          <Button title="Відправити" onPress={async () => { console.log("Submit"); }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: { padding: 12, gap: 12 },
  headerCard: {
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colorLines,
    padding: 12,
    gap: 6,
  },
  headerTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  taskTitle: {
    fontSize: 24,
    marginBottom: 8,
    color: theme.accentColor,
  },
  course: { color: "#616161" },
  courseValue: { color: "#333", fontWeight: "600" },
  taskBody: {
    fontSize: 14,
    lineHeight: 18,
  },
  author: { color: "#616161" },
  authorValue: { color: "#333", fontWeight: "600" },
  deadline: { color: "#616161" },
  deadlineValue: { color: "#333", fontWeight: "600" },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { color: theme.white, fontSize: 12, fontWeight: "600" },
  status_assigned: { backgroundColor: "#90A4AE" },
  status_pending: { backgroundColor: "#FF9800" },
  status_graded: { backgroundColor: "#4CAF50" },
  markText: {
    fontSize: 14,
    lineHeight: 14,
  },
  blockCard: {
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colorLines,
    padding: 12,
    gap: 8,
  },
  blockTitle: { fontWeight: "700" },
});
