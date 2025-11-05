import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeacherStackParamList } from "../navigation/TeacherStack";
import { Button } from "../components/Button/Button";
import { Pill } from "../components/Pill/Pill";
import { Pressable } from "../components/Pressable/Pressable";
import { theme } from "../styles/theme";
import { formatDateDisplay } from "../utils/formatDate";

type TeacherTask = {
  id: string;
  title: string;
  course: string;
  deadline: string;
  status: "draft" | "active" | "review" | "completed";
  stats: {
    assigned: number;
    submitted: number;
    pendingReview: number;
    graded: number;
  };
};

const filters = [
  { value: "all", label: "Усі" },
  { value: "active", label: "Активні" },
  { value: "review", label: "Очікують перевірки" },
  { value: "completed", label: "Завершені" },
];

const mockTasks: TeacherTask[] = [
  {
    id: "task-1",
    title: "Лабораторна робота №2. Масиви та сортування",
    course: "Алгоритми та структури даних",
    deadline: "2025-03-05",
    status: "review",
    stats: {
      assigned: 32,
      submitted: 28,
      pendingReview: 6,
      graded: 22,
    },
  },
  {
    id: "task-2",
    title: "Практична робота. ООП у TypeScript",
    course: "Програмування",
    deadline: "2025-02-26",
    status: "active",
    stats: {
      assigned: 28,
      submitted: 12,
      pendingReview: 0,
      graded: 0,
    },
  },
  {
    id: "task-3",
    title: "Тестова робота №1",
    course: "Дискретна математика",
    deadline: "2025-02-10",
    status: "completed",
    stats: {
      assigned: 30,
      submitted: 30,
      pendingReview: 0,
      graded: 30,
    },
  },
  {
    id: "task-4",
    title: "Чернетка: Тематичний проект",
    course: "Інженерія ПЗ",
    deadline: "—",
    status: "draft",
    stats: {
      assigned: 0,
      submitted: 0,
      pendingReview: 0,
      graded: 0,
    },
  },
];

export const TeacherDashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]["value"]>("all");

  const summary = useMemo(() => {
    const aggregate = mockTasks.reduce(
      (acc, task) => {
        acc.assigned += task.stats.assigned;
        acc.submitted += task.stats.submitted;
        acc.pendingReview += task.stats.pendingReview;
        acc.graded += task.stats.graded;
        return acc;
      },
      { assigned: 0, submitted: 0, pendingReview: 0, graded: 0 }
    );

    return aggregate;
  }, []);

  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") return mockTasks;
    if (activeFilter === "completed") {
      return mockTasks.filter((task) => task.status === "completed");
    }
    if (activeFilter === "active") {
      return mockTasks.filter((task) => task.status === "active");
    }
    if (activeFilter === "review") {
      return mockTasks.filter((task) => task.status === "review");
    }
    return mockTasks;
  }, [activeFilter]);

  const renderTaskCard = ({ item }: { item: TeacherTask }) => {
    const statusLabelMap: Record<TeacherTask["status"], string> = {
      draft: "Чернетка",
      active: "Активне",
      review: "Очікує перевірки",
      completed: "Завершено",
    };

    return (
      <Pressable
        containerStyle={styles.cardContainer}
        pressableStyle={styles.card}
        rippleColor="accent"
        onPress={() => navigation.navigate("TeacherTaskDetails", { taskId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardCourse}>{item.course}</Text>
          <View style={[styles.statusPill, styles[`status_${item.status}` as const]]}>
            <Text style={styles.statusText}>{statusLabelMap[item.status]}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDeadline}>
          Дедлайн: <Text style={styles.cardDeadlineValue}>{formatDateDisplay(item.deadline)}</Text>
        </Text>

        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.stats.assigned}</Text>
            <Text style={styles.statLabel} numberOfLines={1}>Призначено</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.stats.submitted}</Text>
            <Text style={styles.statLabel} numberOfLines={1}>Здано</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.stats.pendingReview}</Text>
            <Text style={styles.statLabel} numberOfLines={1}>Очікують</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.stats.graded}</Text>
            <Text style={styles.statLabel} numberOfLines={1}>Оцінено</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Панель викладача</Text>
          <Text style={styles.subtitle}>Керуйте завданнями курсу та слідкуйте за прогресом групи</Text>
        </View>
        <View style={styles.headerAction}>
          <Button title="Створити завдання" size="large" fullWidth onPress={() => navigation.navigate("TeacherTaskCreate")} />
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.assigned}</Text>
          <Text style={styles.summaryLabel} numberOfLines={1}>Призначено</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.submitted}</Text>
          <Text style={styles.summaryLabel} numberOfLines={1}>Здано</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.pendingReview}</Text>
          <Text style={styles.summaryLabel} numberOfLines={1}>Очікують</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.graded}</Text>
          <Text style={styles.summaryLabel} numberOfLines={1}>Оцінено</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <Pill key={f.value} label={f.label} active={activeFilter === f.value} onPress={() => setActiveFilter(f.value)} />
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskCard}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    gap: 12,
    backgroundColor: theme.backgroundColor,
  },
  header: {
    flexDirection: "column",
    gap: 8,
  },
  headerText: {
    flexShrink: 1,
    minWidth: 220,
        width:'100%',
  },
  headerAction: {
    width:'100%',
    flexShrink: 0,
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    color: theme.textSecondary,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: theme.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: theme.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 1,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  summaryLabel: {
    color: theme.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colorLines,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  listContent: {
    paddingBottom: 28,
  },
  cardContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  card: {
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colorLines,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardCourse: {
    fontWeight: "600",
    color: theme.accentColor,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.white,
  },
  status_draft: {
    backgroundColor: theme.statusAssigned,
  },
  status_active: {
    backgroundColor: theme.accentColor,
  },
  status_review: {
    backgroundColor: theme.statusPending,
  },
  status_completed: {
    backgroundColor: theme.statusGraded,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
  },
  cardDeadline: {
    color: theme.textSecondary,
    fontSize: 13,
  },
  cardDeadlineValue: {
    fontWeight: "600",
    color: theme.textPrimary,
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.accentColorMuted,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
});
