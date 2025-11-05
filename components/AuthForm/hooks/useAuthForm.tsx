import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../../context/AuthContext";
import { UserRole } from "../../../types/User";
import { isUserRegisterType } from "../../../utils/isUserRegisterType";

const authLoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Обов'язкове поле" })
    .email("Невірний формат"),
  password: z
    .string()
    .min(1, { message: "Обов'язкове поле" })
    .min(5, { message: "Пароль надто короткий" }),
});

const authRegisterFormSchema = authLoginFormSchema.extend({
  firstName: z.string().min(1, { message: "Обов'язкове поле" }),
  lastName: z.string().min(1, { message: "Обов'язкове поле" }),
  role: z.enum(["student", "teacher"], {
    required_error: "Оберіть роль",
    invalid_type_error: "Оберіть роль",
  }),
});

const loginResolver = zodResolver(authLoginFormSchema);
const registerResolver = zodResolver(authRegisterFormSchema);

export type AuthFormInputs = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
};

const loginDefaults: AuthFormInputs = {
  email: "",
  password: "",
};

const registerDefaults: AuthFormInputs = {
  ...loginDefaults,
  firstName: "",
  lastName: "",
  role: undefined,
};

type useAuthFormProps = {
  isRegister: boolean;
};

export const useAuthForm = ({ isRegister }: useAuthFormProps) => {
  const { register, login } = useAuth();

  const resolver = useMemo(
    () => (isRegister ? registerResolver : loginResolver),
    [isRegister]
  );

  const form = useForm<AuthFormInputs>({
    defaultValues: loginDefaults,
    mode: "onSubmit",
    resolver,
  });

  const { reset } = form;

  useEffect(() => {
    reset(isRegister ? registerDefaults : loginDefaults, {
      keepErrors: false,
      keepDirty: false,
      keepTouched: false,
    });
  }, [isRegister, reset]);

  const onSubmit: SubmitHandler<AuthFormInputs> = async (data) => {
    if (isRegister && isUserRegisterType(data)) {
      await register?.(data);
      return;
    }

    await login?.({ email: data.email, password: data.password });
  };

  return {
    form,
    onSubmit,
  };
};
