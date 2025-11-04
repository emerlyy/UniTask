import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Logout } from "../components/Logout/Logout";
import { TaskScreen } from "../screens/TaskScreen";
import { Task } from "../types";
import { StudentTabs } from "./StudentTabs";

export type StudentStackParamList = {
  Tabs: undefined;
  Task: Task & { status?: 'assigned' | 'pending' | 'graded' };
};

const Stack = createNativeStackNavigator<StudentStackParamList>();

export const StudentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: Logout,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={StudentTabs}
        options={{ title: "Taskify" }}
      />
      <Stack.Screen
        name="Task"
        component={TaskScreen}
        options={{
          title: "Завдання",
        }}
      />
    </Stack.Navigator>
  );
};
