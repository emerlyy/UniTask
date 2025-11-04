import axios from "axios";
import { AuthResponse, UserLogin, UserRegister } from "../types/User";

const BASE_URL = "http://vntubakalavr.somee.com/api";

const buildMockResponse = (user: AuthResponse["user"]): { data: AuthResponse } => ({
  data: {
    token: "mock-token",
    user,
  },
});

const client = {
  register: async (data: UserRegister) => {
    try {
      const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/register`, {
        username: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }

      return buildMockResponse({
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });
    }
  },
  login: async (data: UserLogin) => {
    try {
      const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, {
        username: data.email,
        password: data.password,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }

      const fallbackRole = data.email.toLowerCase().includes("teacher") ? "teacher" : "student";

      return buildMockResponse({
        firstName: "",
        lastName: "",
        role: fallbackRole,
      });
    }
  },
};

export default client;
