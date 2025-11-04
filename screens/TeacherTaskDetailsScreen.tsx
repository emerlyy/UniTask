import { useMemo, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { theme } from "../styles/theme";
import { Button } from "../components/Button/Button";
import { Pressable } from "../components/Pressable/Pressable";
import { TeacherStackParamList } from "../navigation/TeacherStack";

type Props = NativeStackScreenProps<TeacherStackParamList, "TeacherTaskDetails">;

type Submission = {
  id: string;
  student: string;
  submittedAt: string;
  autoScore?: number;
  status: "pending" | "graded";
  finalScore?: number;
};

const mockTaskById = (id: string) => ({
  id,
  title: "Лабораторна робота №2. Масиви та сортування",
  course: "Алгоритми та структури даних",
  deadline: "2025-03-05",
  status: "review" as const,
});

const mockSubmissions: Submission[] = [
  { id: "s1", student: "Петренко Ігор", submittedAt: "2025-02-20 10:41", autoScore: 11, status: "pending" },
  { id: "s2", student: "Івасюк Вадим", submittedAt: "2025-02-20 09:12", autoScore: 12, status: "graded" },
  { id: "s3", student: "Коваль Марія", submittedAt: "2025-02-19 18:33", autoScore: 9, status: "pending" },
];

export const TeacherTaskDetailsScreen = ({ route }: Props) => {
  const { taskId } = route.params;
  const task = useMemo(() => mockTaskById(taskId), [taskId]);
  const [filter, setFilter] = useState<"all" | "pending" | "graded">("all");
  const filterDefs = [
    { v: "all", l: "Усі" },
    { v: "pending", l: "Очікують" },
    { v: "graded", l: "Оцінено" },
  ] as const;

  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [evaluateModal, setEvaluateModal] = useState<{ visible: boolean; submission?: Submission }>({ visible: false });

  const scoreSchema = z.object({
    score: z.number({message: "Обов'язкове поле"})
      .min(1, { message: "Обов'язкове поле" })
      .transform((v) => Number(v))
      .refine((n) => n >= 0 && n <= 100, { message: "Введіть число від 0 до 100" }),
  });

  type ScoreForm = z.infer<typeof scoreSchema>;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ScoreForm>({
    defaultValues: { score: undefined as unknown as number },
    resolver: zodResolver(scoreSchema),
    mode: "onSubmit",
  });

  const filtered = useMemo(() => {
    if (filter === "all") return submissions;
    return submissions.filter((s) => s.status === filter);
  }, [filter, submissions]);

  const statusLabelMap = {
    draft: "Чернетка",
    active: "Активне",
    review: "Очікує перевірки",
    completed: "Завершено",
  } as const;

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={[styles.statusPill, styles[`status_${task.status}` as const]]}>
            <Text style={styles.statusText}>{statusLabelMap[task.status]}</Text>
          </View>
          <Text style={styles.deadline}>Дедлайн: <Text style={styles.deadlineValue}>{task.deadline}</Text></Text>
        </View>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.course}>{task.course}</Text>
        <View style={styles.actions}>
          <Button title="Редагувати" type="secondary" />
          <Button title="Закрити завдання" />
        </View>
      </View>

      <View style={styles.filters}>
        {filterDefs.map((f) => (
          <Pressable
            key={f.v}
            rippleColor="accent"
            containerStyle={styles.filterChipContainer}
            pressableStyle={[styles.filterChip, filter===f.v && styles.filterChipActive]}
            onPress={() => setFilter(f.v)}
          >
            <Text style={[styles.filterText, filter===f.v && styles.filterTextActive]}>{f.l}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{height:10}} />}
        renderItem={({ item }) => (
          <Pressable containerStyle={styles.cardContainer} pressableStyle={styles.card} rippleColor="accent">
            <View style={styles.cardRow}>
              <Text style={styles.student}>{item.student}</Text>
              <View style={styles.cardRight}>
                <View style={[
                  styles.subStatusPill,
                  item.status === "graded" ? styles.subStatusGraded : styles.subStatusPending,
                ]}>
                  <Text style={styles.subStatusText}>{item.status === "graded" ? "Оцінено" : "Очікує"}</Text>
                </View>
                {item.status === "graded" && (() => {
                  const calc = () => {
                    if (item.finalScore !== undefined) return Math.max(0, Math.min(100, Math.round(item.finalScore)));
                    if (item.autoScore !== undefined) {
                      const raw = item.autoScore;
                      const toHundred = raw <= 12 ? Math.round((raw / 12) * 100) : Math.round(raw);
                      return Math.max(0, Math.min(100, toHundred));
                    }
                    return 0;
                  };
                  return <Text style={styles.headerScore}>{calc()}/100</Text>;
                })()}
              </View>
            </View>
            <Text style={styles.meta}>Здано: {item.submittedAt}</Text>
            {item.status === "pending" && item.autoScore !== undefined && (() => {
              const raw = item.autoScore;
              const toHundred = raw <= 12 ? Math.round((raw / 12) * 100) : Math.round(raw);
              const bounded = Math.max(0, Math.min(100, toHundred));
              return (
                <Text style={styles.meta}>
                  Автоматична оцінка: <Text style={styles.autoScore}>{bounded}/100</Text>
                </Text>
              );
            })()}
            <View style={styles.rowActions}>
              <Button
                title="Переглянути"
                type="secondary"
                dense
                onPress={() => {
                  Alert.alert(
                    "Перегляд роботи",
                    `Студент: ${item.student}\nДата: ${item.submittedAt}`,
                    [{ text: "Закрити" }]
                  );
                }}
              />
              {item.status === "pending" ? (
                <Button
                  title="Оцінити"
                  dense
                  onPress={() => {
                    setEvaluateModal({ visible: true, submission: item });
                    reset({ score: undefined });
                  }}
                />
              ) : (
                <Button
                  title="Змінити оцінку"
                  dense
                  onPress={() => {
                    setEvaluateModal({ visible: true, submission: item });
                    reset({ score: (item.finalScore ?? undefined) });
                  }}
                />
              )}
            </View>
          </Pressable>
        )}
      />
      <Modal
        visible={evaluateModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setEvaluateModal((p) => ({ ...p, visible: false }))}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Оцінювання роботи</Text>
            {evaluateModal.submission && (
              <>
                <Text style={styles.modalText}>Студент: {evaluateModal.submission.student}</Text>
                {(() => {
                  const raw = evaluateModal.submission.autoScore ?? 0;
                  const toHundred = raw <= 12 ? Math.round((raw / 12) * 100) : Math.round(raw);
                  const auto100 = Math.max(0, Math.min(100, toHundred));
                  return (
                    <Text style={styles.modalText}>
                      Автоматична оцінка: <Text style={styles.modalScore}>{auto100}/100</Text>
                    </Text>
                  );
                })()}
                <Text style={styles.modalText}>Або введіть свою (0–100):</Text>
                <Controller
                  control={control}
                  name="score"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      keyboardType="number-pad"
                      placeholder="Напр., 87"
                      value={value === undefined ? "" : String(value)}
                      autoComplete="off"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      style={[styles.modalInput, errors.score && styles.modalInputError]}
                    />
                  )}
                />
                {errors.score ? <Text style={styles.modalError}>{errors.score.message}</Text> : null}
                <View style={styles.modalActions}>
                  <Button
                    title="Скасувати"
                    type="secondary"
                    dense
                    onPress={() => setEvaluateModal((p) => ({ ...p, visible: false }))}
                  />
                  <Button
                    title="Підтвердити автооцінку"
                    dense
                    onPress={() => {
                      const sub = evaluateModal.submission!;
                      const raw = sub.autoScore ?? 0;
                      const toHundred = raw <= 12 ? Math.round((raw / 12) * 100) : Math.round(raw);
                      const auto100 = Math.max(0, Math.min(100, toHundred));
                      setSubmissions((prev) => prev.map((s) => (s.id === sub.id ? { ...s, status: "graded", finalScore: auto100 } : s)));
                      setEvaluateModal({ visible: false });
                      reset({ score: undefined });
                    }}
                  />
                  <Button
                    title="Зберегти оцінку"
                    dense
                    onPress={handleSubmit(({ score }) => {
                      const sub = evaluateModal.submission!;
                      setSubmissions((prev) => prev.map((s) => (s.id === sub.id ? { ...s, status: "graded", finalScore: Math.round(score) } : s)));
                      setEvaluateModal({ visible: false });
                      reset({ score: undefined as unknown as number });
                    })}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, gap: 12, backgroundColor: theme.backgroundColor },
  headerCard: {
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colorLines,
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700", lineHeight: 22 },
  course: { color: theme.accentColor, fontWeight: "600" },
  deadline: { color: "#616161" },
  deadlineValue: { color: "#333", fontWeight: "600" },
  actions: { flexDirection: "row", gap: 8 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 12, fontWeight: "600", color: theme.white },
  status_draft: { backgroundColor: "#B0BEC5" },
  status_active: { backgroundColor: theme.accentColor },
  status_review: { backgroundColor: "#FF9800" },
  status_completed: { backgroundColor: "#4CAF50" },

  filters: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  filterChipContainer: { borderRadius: 100, overflow: "hidden" },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: theme.colorLines,
    backgroundColor: theme.white,
  },
  filterChipActive: { backgroundColor: theme.accentColor, borderColor: theme.accentColor },
  filterText: { color: "#444", fontWeight: "500" },
  filterTextActive: { color: theme.white },

  listContent: { paddingBottom: 28 },
  cardContainer: { borderRadius: 12, overflow: "hidden" },
  card: { backgroundColor: theme.white, borderRadius: 12, padding: 12, gap: 6, borderWidth: 1, borderColor: theme.colorLines },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  student: { fontSize: 15, fontWeight: "600" },
  meta: { color: "#616161", fontSize: 13 },
  autoScore: { fontWeight: "700", color: "#333" },
  rowActions: { flexDirection: "row", gap: 8 },
  subStatusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  subStatusPending: { backgroundColor: "#FFB74D" },
  subStatusGraded: { backgroundColor: "#4CAF50" },
  subStatusText: { color: theme.white, fontWeight: "600", fontSize: 12 },
  headerScore: { fontSize: 18, fontWeight: "800", color: "#222" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center", padding: 16 },
  modalCard: { width: "100%", borderRadius: 12, backgroundColor: theme.white, padding: 16, gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  modalText: { color: "#333" },
  modalScore: { fontWeight: "800" },
  modalInput: { borderWidth: 1, borderColor: theme.colorLines, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10 },
  modalInputError: { borderColor: theme.red },
  modalError: { color: theme.red, marginTop: 4 },
  modalActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" },
});
