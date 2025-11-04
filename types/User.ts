export type UserRole = "student" | "teacher";

export type UserRegister = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

export type UserLogin = {
  email: string;
  password: string;
};
