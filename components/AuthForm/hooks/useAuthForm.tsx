import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../../context/AuthContext";
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

export type AuthFormInputs = z.infer<typeof authRegisterFormSchema>;

const initialState: AuthFormInputs = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  role: 'student',
};

export const useAuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { register, login } = useAuth();

  const form = useForm<AuthFormInputs>({
    defaultValues: initialState,
    mode: "onSubmit",
    resolver: isRegister ? registerResolver : loginResolver,
  });

  const toggleIsRegister = () => {
    setIsRegister((prev) => !prev);
  };

  const { reset } = form;

  useEffect(() => {
    reset(initialState, {
      keepErrors: false,
      keepDirty: false,
      keepTouched: false,
    });
  }, [isRegister, reset]);

  const onSubmit: SubmitHandler<AuthFormInputs> = (data) => {
    if (isRegister && isUserRegisterType(data)) {
      register?.(data);
      return;
    }

    login?.(data);
  };

  return {
    form,
    isRegister,
    toggleIsRegister,
    onSubmit,
  };
};
