import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInputProps,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { Controller, RegisterOptions } from "react-hook-form";
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

const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);

const layoutTransition = LinearTransition;

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "student", label: "Студент" },
  { value: "teacher", label: "Викладач" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getValidationRules = (
  field: FormInput["id"],
  isRegister: boolean
): RegisterOptions<AuthFormInputs, FormInput["id"]> | undefined => {
  switch (field) {
    case "email":
      return {
        required: "Обов'язкове поле",
        pattern: {
          value: EMAIL_REGEX,
          message: "Невірний формат",
        },
      };
    case "password":
      return {
        required: "Обов'язкове поле",
        minLength: {
          value: 5,
          message: "Пароль надто короткий",
        },
      };
    case "firstName":
    case "lastName":
      return isRegister
        ? {
            required: "Обов'язкове поле",
          }
        : undefined;
    default:
      return undefined;
  }
};

export const AuthForm = () => {
  const {
    form: { control, handleSubmit },
    isRegister,
    toggleIsRegister,
    onSubmit,
  } = useAuthForm();

  return (
    <AnimatedKeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      layout={layoutTransition}
    >
      <Animated.Text
        key={isRegister ? "registerTitle" : "loginTitle"}
        style={styles.title}
        entering={FadeIn.delay(100)}
        exiting={FadeOut.duration(100)}
      >
        {isRegister ? "Реєстрація" : "Вхід"}
      </Animated.Text>
      <Animated.View style={styles.form} layout={layoutTransition}>
        {(isRegister ? inputsRegister : inputsLogin).map(({ id, ...props }) => {
          const rules = getValidationRules(id, isRegister);

          return (
            <Controller
              key={id}
              control={control}
              name={id}
              rules={rules}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  {...props}
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
              <Animated.View
                key="roleSelector"
                entering={FadeInUp}
                layout={layoutTransition}
                style={styles.roleContainer}
              >
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
              </Animated.View>
            )}
          />
        )}
        <Animated.View layout={layoutTransition} entering={FadeInUp} style={styles.bottomContainer}>
          <Button
            size="large"
            title={isRegister ? "Зареєструватись" : "Увійти"}
            animateTitle={true}
            titleKey={isRegister ? "registerButton" : "loginButton"}
            onPress={handleSubmit(onSubmit)}
          />
          <Animated.View
            style={styles.bottomTextContainer}
            key={isRegister ? "registerText" : "loginText"}
            entering={FadeIn.delay(100)}
            exiting={FadeOut.duration(100)}
          >
            <Text style={styles.bottomText}>
              {isRegister ? "Вже зареєстровані?" : "Немає акаунту?"}
            </Text>
            <Pressable
              rippleColor="accent"
              onPress={toggleIsRegister}
              containerStyle={{ borderRadius: 6, margin: -6 }}
              pressableStyle={{ padding: 6 }}
            >
              <Text style={styles.linkText}>
                {isRegister ? "Увійти" : "Зареєструватись"}
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </AnimatedKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  form: {
    padding: 20,
    gap: 12,
    backgroundColor: theme.white,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    shadowColor: "#666",
  },
  bottomContainer: {
    marginTop: 12,
  },
  bottomTextContainer: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  bottomText: {},
  linkText: {
    color: theme.accentColor,
    fontWeight: "500",
  },
  roleContainer: {
    marginTop: 4,
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
    borderRadius: 6,
    overflow: "hidden",
  },
  roleOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.accentColor,
    borderRadius: 6,
    backgroundColor: theme.white,
  },
  roleOptionSelected: {
    backgroundColor: theme.accentColor,
  },
  roleOptionText: {
    fontSize: 15,
    color: theme.accentColor,
    fontWeight: "500",
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
