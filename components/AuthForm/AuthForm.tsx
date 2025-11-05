import { StyleSheet, Text, TextInputProps, View } from "react-native";
import { Controller } from "react-hook-form";
import { theme } from "../../styles/theme";
import { UserRole } from "../../types/User";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Pressable } from "../Pressable/Pressable";
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


const roleOptions: { value: UserRole; label: string }[] = [
  { value: "student", label: "Студент" },
  { value: "teacher", label: "Викладач" },
];

type AuthFormProps = {
  isRegister: boolean;
};

export const AuthForm = ({ isRegister }: AuthFormProps) => {
  const {
    form: { control, handleSubmit },
    onSubmit,
  } = useAuthForm({ isRegister });

  return (
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
            onPress={handleSubmit(onSubmit)}
            fullWidth
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingVertical: 6,
    gap: 12,
  },
  bottomContainer: {
    marginTop: 14,
    gap: 10,
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
    color: theme.textPrimary,
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
