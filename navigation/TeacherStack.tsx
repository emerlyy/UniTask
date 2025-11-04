import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Logout } from "../components/Logout/Logout";
import { TeacherHomeScreen } from "../screens/TeacherHomeScreen";

export type TeacherStackParamList = {
  TeacherHome: undefined;
};

const Stack = createNativeStackNavigator<TeacherStackParamList>();

export const TeacherStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: Logout,
        headerShadowVisible: false,
        title: "Taskify",
      }}
    >
      <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} options={{ title: "Завдання" }} />
    </Stack.Navigator>
  );
};

