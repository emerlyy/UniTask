import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/Button/Button";
import { Input } from "../components/Input/Input";
import { theme } from "../styles/theme";
import { Task } from "../types";

const taskSchema = z.object({
  title: z.string().min(1, { message: "Обов'язкове поле" }),
  body: z.string().min(1, { message: "Обов'язкове поле" }),
  expirationDate: z.string().min(1, { message: "Обов'язкове поле" }),
  maxMark: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: "Використовуйте лише цифри",
    }),
});

type TeacherTaskForm = z.infer<typeof taskSchema>;

const defaultValues: TeacherTaskForm = {
  title: "",
  body: "",
  expirationDate: "",
  maxMark: "",
};

export const TeacherHomeScreen = () => {
  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherTaskForm>({
    defaultValues,
    resolver: zodResolver(taskSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: TeacherTaskForm) => {
    const newTask: Task = {
      title: data.title,
      body: data.body,
      expirationDate: data.expirationDate,
      publishDate: new Date().toLocaleDateString("uk-UA"),
      mark: data.maxMark ? Number(data.maxMark) : undefined,
      author: "Ви",
      submitted: false,
    };

    setCreatedTasks((prev) => [newTask, ...prev]);
    reset({ ...defaultValues });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Створити завдання</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Назва"
              placeholder="Лабораторна робота №1"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.title?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="body"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Опис"
              placeholder="Опишіть завдання..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.body?.message}
              multiline
              numberOfLines={4}
              style={[styles.multilineInput]}
            />
          )}
        />
        <Controller
          control={control}
          name="expirationDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Дедлайн"
              placeholder="2025-05-01"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.expirationDate?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="maxMark"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Максимальний бал (необов'язково)"
              placeholder="12"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.maxMark?.message}
              keyboardType="number-pad"
            />
          )}
        />
        <Button title="Зберегти завдання" size="large" onPress={handleSubmit(onSubmit)} />
      </View>

      <View style={styles.previewSection}>
        <Text style={styles.previewTitle}>Створені завдання</Text>
        {createdTasks.length === 0 ? (
          <Text style={styles.emptyText}>Поки що немає створених завдань.</Text>
        ) : (
          createdTasks.map((task, index) => (
            <View key={`${task.title}-${index}`} style={styles.taskCard}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskMeta}>Дедлайн: {task.expirationDate}</Text>
              {task.mark !== undefined && (
                <Text style={styles.taskMeta}>Максимальний бал: {task.mark}</Text>
              )}
              <Text style={styles.taskDescription}>{task.body}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 20,
  },
  formCard: {
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },
  previewSection: {
    gap: 12,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#666",
  },
  taskCard: {
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colorLines,
    gap: 6,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  taskMeta: {
    color: "#555",
  },
  taskDescription: {
    color: "#333",
  },
});
