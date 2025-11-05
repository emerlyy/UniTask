import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BRAND_NAME } from "../constants/branding";
import { Logout } from "../components/Logout/Logout";
import { TeacherDashboardScreen } from "../screens/TeacherDashboardScreen";
import { TeacherTaskDetailsScreen } from "../screens/TeacherTaskDetailsScreen";
import { TeacherTaskCreateScreen } from "../screens/TeacherTaskCreateScreen";

export type TeacherStackParamList = {
  TeacherDashboard: undefined;
  TeacherTaskDetails: { taskId: string };
  TeacherTaskCreate: undefined;
};

const Stack = createNativeStackNavigator<TeacherStackParamList>();

export const TeacherStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: Logout,
        headerShadowVisible: false,
        title: BRAND_NAME,
      }}
    >
      <Stack.Screen
        name="TeacherDashboard"
        component={TeacherDashboardScreen}
        options={{ title: "Панель викладача" }}
      />
      <Stack.Screen
        name="TeacherTaskDetails"
        component={TeacherTaskDetailsScreen}
        options={{ title: "Завдання" }}
      />
      <Stack.Screen
        name="TeacherTaskCreate"
        component={TeacherTaskCreateScreen}
        options={{ title: "Створити завдання" }}
      />
    </Stack.Navigator>
  );
};
