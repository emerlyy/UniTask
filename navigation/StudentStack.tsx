import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Logout } from "../components/Logout/Logout";
import { HomeScreen } from "../screens/HomeScreen";
import { TaskScreen } from "../screens/TaskScreen";
import { Task } from "../types";

export type StudentStackParamList = {
  Home: undefined;
  Task: Task;
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
        name="Home"
        component={HomeScreen}
        options={{
          title: "Taskify",
        }}
      />
      <Stack.Screen
        name="Task"
        component={TaskScreen}
        options={{
          title: "",
        }}
      />
    </Stack.Navigator>
  );
};

