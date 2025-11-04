import axios from "axios";
import { UserLogin, UserRegister } from "../types/User";

const BASE_URL = "http://vntubakalavr.somee.com/api";

const client = {
  register: async (data: UserRegister) => {
    try {
      // const response = await axios.post(`${BASE_URL}/auth/register`, {
      //   username: data.email,
      //   password: data.password,
      //   firstName: data.firstName,
      //   lastName: data.lastName,
      //   role: data.role,
      // });
      // return response;
      return {data:{token:
        '2'
      }}
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  },
  login: async (data: UserLogin) => {
    try {
      // const response = await axios.post<{ token: string }>(`${BASE_URL}/auth/login`, {
      //   username: data.email,
      //   password: data.password,
      // });
      // return response;
      return {data:{token:
        '2'
      }}
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  },
};

export default client;
