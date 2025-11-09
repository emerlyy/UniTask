import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "../components/Button/Button";
import { Input } from "../components/Input/Input";
import { theme } from "../styles/theme";
import { formatDateDisplay } from "../utils/formatDate";

const schema = z.object({
  course: z.string().min(1, { message: "Обов'язкове поле" }),
  title: z.string().min(1, { message: "Обов'язкове поле" }),
  body: z.string().min(1, { message: "Обов'язкове поле" }),
  deadline: z
    .string()
    .optional()
    .transform((v) => (v ?? "").trim())
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v) || /^\d{2}\.\d{2}\.\d{4}$/.test(v), {
      message: "Формат ДД.ММ.РРРР або YYYY-MM-DD",
    }),
  latePenalty: z
    .string()
    .transform((v) => (v ?? "").trim())
    .refine((v) => v === "" || /^\d{1,2}$/.test(v), { message: "0-99" })
    .optional(),
});

type FormValues = z.infer<typeof schema>;

export const TeacherTaskCreateScreen = () => {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      course: "",
      title: "",
      body: "",
      deadline: "",
      latePenalty: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: FormValues) => {
    Alert.alert(
      "Завдання створено",
      `Курс: ${data.course}\nНазва: ${data.title}\nТермін здачі: ${data.deadline ? formatDateDisplay(data.deadline) : "—"}${referenceAsset ? "\nЕталон: " + referenceAsset.name : ""}`,
      [{ text: "OK", onPress: () => reset() }]
    );
  };

  const [referenceAsset, setReferenceAsset] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const pickReference = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: [
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/*",
        ],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets?.length) {
        setReferenceAsset(res.assets[0]);
      }
    } catch (e) {
      console.log("reference file pick error", e);
    }
  };

  const removeReference = () => setReferenceAsset(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Controller
          control={control}
          name="course"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Курс / предмет" placeholder="Алгоритми та структури даних" value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={errors.course?.message} />
          )}
        />

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Назва" placeholder="Лабораторна робота №3" value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={errors.title?.message} />
          )}
        />
        <Controller
          control={control}
          name="body"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Опис" placeholder="Опишіть завдання..." value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={errors.body?.message} multiline numberOfLines={6} style={styles.multiline} />
          )}
        />
        <Controller
          control={control}
          name="deadline"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Термін здачі (ДД.ММ.РРРР)" placeholder="01.05.2025" value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={errors.deadline?.message} />
          )}
        />

        <Controller
          control={control}
          name="latePenalty"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Штраф за запізнення, % (необов'язково)" placeholder="Напр., 10" value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={errors.latePenalty?.message} />
          )}
        />

        <View style={styles.refBlock}>
          <Text style={styles.refLabel}>Еталонна відповідь</Text>
          {referenceAsset ? (
            <View style={styles.refFileRow}>
              <Text style={styles.refFileName} numberOfLines={2}>{referenceAsset.name}</Text>
              <Button title="Видалити" type="secondary" dense onPress={removeReference} />
            </View>
          ) : (
            <Button title="Додати файл" type="secondary" onPress={pickReference} />
          )}
        </View>
      </View>

      <Button title="Зберегти як чернетку" type="secondary" size="large" onPress={handleSubmit(onSubmit)} />
      <Button title="Опублікувати" size="large" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12, gap: 12 },
  card: {
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colorLines,
  },
  multiline: { height: 140, textAlignVertical: "top" },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  switchLabel: { fontSize: 14 },
  refBlock: { gap: 8 },
  refLabel: { fontWeight: "600" },
  refFileRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  refFileName: { flex: 1 },
});
