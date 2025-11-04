import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Task } from "../types";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Task: Task;
};

export const AppNav = () => {
  const { isLoading, userToken } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return userToken !== null ? <AppStack /> : <AuthStack />;
};
