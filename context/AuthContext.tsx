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
import { AuthResponse, UserLogin, UserRegister, UserRole, UserProfile } from "../types/User";
import { loadUser, removeUserToken, saveUser } from "../utils/secureStore";

type AuthContextType = {
  register?: (data: UserRegister) => Promise<void>;
  login?: (data: UserLogin) => Promise<void>;
  logout?: () => void;
  isLoading: boolean;
  userToken: string | null;
  userRole: UserRole | null;
  userProfile: UserProfile | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  userToken: null,
  userRole: null,
  userProfile: null,
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<AuthContextType["userToken"]>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleAuthSuccess = async (payload: AuthResponse) => {
    setUserToken(payload.token);
    setUserRole(payload.user.role);
    setUserProfile(payload.user);
    await saveUser(payload.token, payload.user);
    axios.defaults.headers.common["Authorization"] = `Token ${payload.token}`;
  };

  const register = async (data: UserRegister) => {
    setIsLoading(true);
    try {
      const response = await api.register(data);
      if (!response) return;
      await handleAuthSuccess(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: UserLogin) => {
    setIsLoading(true);
    try {
      const response = await api.login(data);
      if (!response) return;
      await handleAuthSuccess(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    setUserRole(null);
    setUserProfile(null);
    delete axios.defaults.headers.common["Authorization"];
    removeUserToken();
    setIsLoading(false);
  };

  useEffect(() => {
    const loadToken = async () => {
      try {
        setIsLoading(true);
        const stored = await loadUser();
        setUserToken(stored?.token || null);
        setUserRole(stored?.user?.role ?? null);
        setUserProfile(stored?.user ?? null);
      } catch {
        console.log("is logged in error");
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const value = { register, login, logout, isLoading, userToken, userRole, userProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("Auth context error");
  return auth;
};
