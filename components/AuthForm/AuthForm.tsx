import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInputProps,
  View,
} from "react-native";
// Animations removed for this form
import { Controller } from "react-hook-form";
import { theme } from "../../styles/theme";
import { UserRole } from "../../types/User";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Pressable } from "../Pressable/Pressable";
import { Pill } from "../Pill/Pill";
import { AuthFormInputs, useAuthForm } from "./hooks/useAuthForm";

type FormInput = {
  id: keyof AuthFormInputs;
  label: string;
} & TextInputProps;

const inputsLogin: FormInput[] = [
  {
    id: "email",
    label: "Електронна пошта",
    placeholder: "test@vntu.edu.ua",
  },
  {
    id: "password",
    label: "Пароль",
    placeholder: "password212",
    secureTextEntry: true,
  },
];

const inputsRegister: FormInput[] = [
  {
    id: "lastName",
    label: "Прізвище",
    placeholder: "Іванов",
  },
  {
    id: "firstName",
    label: "Ім'я",
    placeholder: "Іван",
  },
  ...inputsLogin,
];

// No AnimatedKeyboardAvoidingView or layout transitions

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "student", label: "Студент" },
  { value: "teacher", label: "Викладач" },
];

export const AuthForm = () => {
  const {
    form: { control, handleSubmit },
    isRegister,
    toggleIsRegister,
    onSubmit,
  } = useAuthForm();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Pill label="Вхід" active={!isRegister} onPress={() => (isRegister ? toggleIsRegister() : undefined)} />
        <Pill label="Реєстрація" active={isRegister} onPress={() => (!isRegister ? toggleIsRegister() : undefined)} />
      </View>

      <View style={styles.form}>
        {(isRegister ? inputsRegister : inputsLogin).map(({ id, ...props }) => {
          return (
            <Controller
              key={id}
              control={control}
              name={id}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  {...props}
                  variant="filled"
                  value={(value as string) ?? ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={error?.message}
                />
              )}
            />
          );
        })}
        {isRegister && (
          <Controller
            control={control}
            name="role"
            rules={{
              required: "Оберіть роль",
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <View key="roleSelector" style={styles.roleContainer}>
                <Text style={styles.roleLabel}>Тип акаунту</Text>
                <View style={styles.roleOptions}>
                  {roleOptions.map((option) => {
                    const isSelected = value === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        rippleColor="accent"
                        onPress={() => onChange(option.value)}
                        containerStyle={styles.rolePressable}
                        pressableStyle={[
                          styles.roleOption,
                          isSelected && styles.roleOptionSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleOptionText,
                            isSelected && styles.roleOptionTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {error?.message && <Text style={styles.errorMessage}>{error.message}</Text>}
              </View>
            )}
          />
        )}
        <View style={styles.bottomContainer}>
          <Button
            size="large"
            title={isRegister ? "Зареєструватись" : "Увійти"}
            // animations off
            onPress={handleSubmit(onSubmit)}
            fullWidth
          />
          <Text style={styles.disclaimer}>
            Продовжуючи, ви погоджуєтесь із умовами використання та політикою конфіденційності.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  form: {
    paddingVertical: 6,
    gap: 12,
  },
  bottomContainer: {
    marginTop: 14,
    gap: 10,
  },
  disclaimer: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 12,
  },
  roleContainer: {
    marginTop: 6,
    gap: 10,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 2,
  },
  roleOptions: {
    flexDirection: "row",
    gap: 10,
  },
  rolePressable: {
    borderRadius: 8,
    overflow: "hidden",
  },
  roleOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colorLines,
    borderRadius: 8,
    backgroundColor: theme.accentColorMuted,
  },
  roleOptionSelected: {
    backgroundColor: theme.accentColor,
    borderColor: theme.accentColor,
  },
  roleOptionText: {
    fontSize: 13,
    color: "#1f2937",
    fontWeight: "700",
    textAlign: "center",
  },
  roleOptionTextSelected: {
    color: theme.white,
  },
  errorMessage: {
    color: theme.red,
    marginLeft: 2,
  },
});
