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

export type UserProfile = {
  firstName: string;
  lastName: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  user: UserProfile;
};
