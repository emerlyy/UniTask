import axios from "axios";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api/client";
import { UserLogin, UserRegister } from "../types/User";
import { loadUser, removeUserToken, saveUser } from "../utils/secureStore";

type AuthContextType = {
  register?: (data: UserRegister) => Promise<any>;
  login?: (data: UserLogin) => Promise<any>;
  logout?: () => void;
  isLoading: boolean;
  userToken: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  userToken: null,
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<AuthContextType["userToken"]>(null);

  const register = async (data: UserRegister) => {
    setIsLoading(true);
    const response = await api.register(data);
    setIsLoading(false);
    if (!response) return;
    login(data);
  };

  const login = async (data: UserLogin) => {
    setIsLoading(true);
    const response = await api.login(data);
    if (!response) return;
    console.log(response.data.token);
    setUserToken(response.data.token);
    saveUser(response.data.token, { firstName: "", lastName: "" });

    axios.defaults.headers.common["Authorization"] = `Token ${response.data.token}`;

    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    removeUserToken();
    setIsLoading(false);
  };

  useEffect(() => {
    const loadToken = async () => {
      try {
        setIsLoading(true);
        const user = await loadUser();
        setUserToken(user?.token || null);
        setIsLoading(false);
      } catch {
        console.log("is logged in error");
      }
    };

    loadToken();
  }, []);

  const value = { register, login, logout, isLoading, userToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("Auth context error");
  return auth;
};

