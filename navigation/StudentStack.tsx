import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BRAND_NAME } from "../constants/branding";
import { Logout } from "../components/Logout/Logout";
import { TaskScreen } from "../screens/TaskScreen";
import { StudentTabs } from "./StudentTabs";

export type StudentStackParamList = {
  Tabs: undefined;
  Task: { id: string };
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
        options={{ title: BRAND_NAME }}
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
