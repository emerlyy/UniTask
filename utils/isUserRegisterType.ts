import { UserLogin, UserRegister } from "../types/User";

export const isUserRegisterType = (
  user: UserRegister | UserLogin
): user is UserRegister => {
  const candidate = user as UserRegister;
  return (
    candidate.firstName !== undefined &&
    candidate.lastName !== undefined &&
    candidate.role !== undefined &&
    (candidate.role === "student" || candidate.role === "teacher")
  );
};
