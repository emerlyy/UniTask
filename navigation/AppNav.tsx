import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { AuthStack } from "./AuthStack";
import { StudentStack, StudentStackParamList } from "./StudentStack";
import { TeacherStack } from "./TeacherStack";

export type RootStackParamList = StudentStackParamList;

export const AppNav = () => {
  const { isLoading, userToken, userRole } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userToken) {
    return <AuthStack />;
  }

  return userRole === "teacher" ? <TeacherStack /> : <StudentStack />;
};
