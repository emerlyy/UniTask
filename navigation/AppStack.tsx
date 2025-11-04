import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Logout } from "../components/Logout/Logout";
import { HomeScreen } from "../screens/HomeScreen";
import { TaskScreen } from "../screens/TaskScreen";
import { Task } from "../types";

export type AppStackParamList = {
  Home: undefined;
  Task: Task;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
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

