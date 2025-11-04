import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Logout } from "../components/Logout/Logout";
import { TeacherDashboardScreen } from "../screens/TeacherDashboardScreen";
import { TeacherTaskDetailsScreen } from "../screens/TeacherTaskDetailsScreen";

export type TeacherStackParamList = {
  TeacherDashboard: undefined;
  TeacherTaskDetails: { taskId: string };
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
    </Stack.Navigator>
  );
};
