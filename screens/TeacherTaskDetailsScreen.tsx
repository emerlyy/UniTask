import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
import { submissionsApi as api } from "../api/submissions";
import { Button } from "../components/Button/Button";
import { Pill } from "../components/Pill/Pill";
import { Pressable } from "../components/Pressable/Pressable";
import { TeacherStackParamList } from "../navigation/TeacherStack";
import { theme } from "../styles/theme";
import { formatDateDisplay } from "../utils/formatDate";

type Props = NativeStackScreenProps<
  TeacherStackParamList,
  "TeacherTaskDetails"
>;

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
  {
    id: "s1",
    student: "Петренко Ігор",
    submittedAt: "2025-02-20 10:41",
    autoScore: 87,
    status: "pending",
  },
  {
    id: "s2",
    student: "Івасюк Вадим",
    submittedAt: "2025-02-20 09:12",
    autoScore: 92,
    finalScore:92,
    status: "graded",
  },
  {
    id: "s3",
    student: "Коваль Марія",
    submittedAt: "2025-02-19 18:33",
    autoScore: 74,
    status: "pending",
  },
];

const scoreSchema = z.object({
  score: z.coerce
    .number({ message: "Обов'язкове поле" })
    .min(0, { message: "Введіть число від 0 до 100" })
    .max(100, { message: "Введіть число від 0 до 100" }),
});

type ScoreForm = z.infer<typeof scoreSchema>;

export const TeacherTaskDetailsScreen = ({ route }: Props) => {
  const { taskId } = route.params;
  const task = useMemo(() => mockTaskById(taskId), [taskId]);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "graded">("all");

  const filterDefs = [
    { v: "all", l: "Усі" },
    { v: "pending", l: "Очікують" },
    { v: "graded", l: "Оцінено" },
  ] as const;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScoreForm>({
    defaultValues: { score: undefined as unknown as number },
    resolver: zodResolver(scoreSchema),
    mode: "onSubmit",
  });

  const filteredSubmissions = useMemo(() => {
    if (filter === "all") return submissions;
    return submissions.filter((submission) => submission.status === filter);
  }, [filter, submissions]);

  const statusLabelMap = {
    draft: "Чернетка",
    active: "Активне",
    review: "Очікує перевірки",
    completed: "Завершено",
  } as const;

  const openEvaluateModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setModalVisible(true);
    reset({ score: submission.finalScore ?? undefined });
  };

  const closeEvaluateModal = () => {
    setModalVisible(false);
    setSelectedSubmission(null);
    reset({ score: undefined as unknown as number });
  };

  const handleConfirmAutoScore = async () => {
    if (!selectedSubmission) return;
    if (selectedSubmission.autoScore === undefined) return;

    await api.updateSubmissionScore(selectedSubmission.id, {
      score: selectedSubmission.autoScore,
      source: "auto",
    });

    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === selectedSubmission.id
          ? {
              ...submission,
              status: "graded",
              finalScore: selectedSubmission.autoScore!,
            }
          : submission
      )
    );

    closeEvaluateModal();
  };

  const handleSaveManualScore = handleSubmit(async ({ score }) => {
    if (!selectedSubmission) return;

    const roundedScore = Math.round(score);

    await api.updateSubmissionScore(selectedSubmission.id, {
      score: roundedScore,
      source: "manual",
    });

    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === selectedSubmission.id
          ? { ...submission, status: "graded", finalScore: roundedScore }
          : submission
      )
    );

    closeEvaluateModal();
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View
            style={[
              styles.statusPill,
              styles[`status_${task.status}` as const],
            ]}
          >
            <Text style={styles.statusText}>{statusLabelMap[task.status]}</Text>
          </View>
          <Text style={styles.deadline}>
            Термін здачі:{" "}
            <Text style={styles.deadlineValue}>
              {formatDateDisplay(task.deadline)}
            </Text>
          </Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.course}>{task.course}</Text>

        <View style={styles.actions}>
          <Button title="Редагувати" type="secondary" />
          <Button title="Закрити завдання" />
        </View>
      </View>

      <View style={styles.filters}>
        {filterDefs.map((definition) => (
          <Pill
            key={definition.v}
            label={definition.l}
            active={filter === definition.v}
            onPress={() => setFilter(definition.v)}
          />
        ))}
      </View>

      <FlatList
        data={filteredSubmissions}
        keyExtractor={(submission) => submission.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            containerStyle={styles.cardContainer}
            pressableStyle={styles.card}
            rippleColor="accent"
          >
            <View style={styles.cardRow}>
              <Text style={styles.student}>{item.student}</Text>
              <View style={styles.cardRight}>
                <View
                  style={[
                    styles.subStatusPill,
                    item.status === "graded"
                      ? styles.subStatusGraded
                      : styles.subStatusPending,
                  ]}
                >
                  <Text style={styles.subStatusText}>
                    {item.status === "graded" ? "Оцінено" : "Очікує"}
                  </Text>
                </View>
                {item.status === "graded" && (
                  <Text style={styles.headerScore}>{item.finalScore}/100</Text>
                )}
              </View>
            </View>

            <Text style={styles.meta}>
              Здано: {formatDateDisplay(item.submittedAt)}
            </Text>

            {item.status === "pending" && item.autoScore !== undefined && (
              <Text style={styles.meta}>
                Автоматична оцінка:{" "}
                <Text style={styles.autoScore}>{item.autoScore}/100</Text>
              </Text>
            )}

            <View style={styles.rowActions}>
              <Button
                title="Переглянути"
                type="secondary"
                dense
                onPress={() => {
                  Alert.alert(
                    "Перегляд роботи",
                    `Студент: ${item.student}\nДата: ${formatDateDisplay(
                      item.submittedAt
                    )}`,
                    [{ text: "Закрити" }]
                  );
                }}
              />
              <Button
                title={item.status === "pending" ? "Оцінити" : "Змінити оцінку"}
                dense
                onPress={() => openEvaluateModal(item)}
              />
            </View>
          </Pressable>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeEvaluateModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Оцінювання роботи</Text>

            {selectedSubmission && (
              <>
                <Text style={styles.modalText}>
                  Студент: {selectedSubmission.student}
                </Text>

                {selectedSubmission.autoScore !== undefined && (
                  <Text style={styles.modalText}>
                    Автоматична оцінка:
                    <Text style={styles.modalScore}>
                      {" "}
                      {selectedSubmission.autoScore}/100
                    </Text>
                  </Text>
                )}

                <Text style={styles.modalText}>Або введіть свою (0–100):</Text>

                <Controller
                  control={control}
                  name="score"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      keyboardType="number-pad"
                      placeholder="Напр., 87"
                      value={value === undefined ? "" : String(value)}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      style={[
                        styles.modalInput,
                        errors.score && styles.modalInputError,
                      ]}
                    />
                  )}
                />

                {errors.score && (
                  <Text style={styles.modalError}>{errors.score.message}</Text>
                )}

                <View style={styles.modalActions}>
                  <Button
                    title="Скасувати"
                    type="secondary"
                    dense
                    onPress={closeEvaluateModal}
                  />
                  {selectedSubmission.autoScore !== undefined && (
                    <Button
                      title="Підтвердити автооцінку"
                      dense
                      onPress={handleConfirmAutoScore}
                    />
                  )}
                  <Button
                    title="Зберегти оцінку"
                    dense
                    onPress={handleSaveManualScore}
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
  container: {
    flex: 1,
    padding: 12,
    gap: 12,
    backgroundColor: theme.backgroundColor,
  },
  headerCard: {
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colorLines,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700", lineHeight: 22 },
  course: { color: theme.accentColor, fontWeight: "600" },
  deadline: { color: theme.textSecondary },
  deadlineValue: { color: theme.textPrimary, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 8 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 12, fontWeight: "600", color: theme.white },
  status_draft: { backgroundColor: theme.statusAssigned },
  status_active: { backgroundColor: theme.accentColor },
  status_review: { backgroundColor: theme.statusPending },
  status_completed: { backgroundColor: theme.statusGraded },
  filters: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  listContent: { paddingBottom: 28 },
  cardContainer: { borderRadius: 12, overflow: "hidden" },
  card: {
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colorLines,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  student: { fontSize: 15, fontWeight: "600" },
  meta: { color: theme.textSecondary, fontSize: 13 },
  autoScore: { fontWeight: "700", color: theme.textPrimary },
  rowActions: { flexDirection: "row", gap: 8 },
  subStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  subStatusPending: { backgroundColor: theme.statusPendingLight },
  subStatusGraded: { backgroundColor: theme.statusGraded },
  subStatusText: { color: theme.white, fontWeight: "600", fontSize: 12 },
  headerScore: { fontSize: 18, fontWeight: "800", color: theme.textPrimary },
  modalBackdrop: {
    flex: 1,
    backgroundColor: theme.overlayBlack35,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: theme.white,
    padding: 16,
    gap: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  modalText: { color: theme.textPrimary },
  modalScore: { fontWeight: "800" },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colorLines,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  modalInputError: { borderColor: theme.red },
  modalError: { color: theme.red, marginTop: 4 },
  modalActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },
});
