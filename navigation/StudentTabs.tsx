import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "../screens/HomeScreen";
import { StudentAnalyticsScreen } from "../screens/StudentAnalyticsScreen";
import { theme } from "../styles/theme";

export type StudentTabsParamList = {
  Dashboard: undefined;
  Analytics: undefined;
};

const Tab = createBottomTabNavigator<StudentTabsParamList>();

export const StudentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.accentColor,
        tabBarIcon: ({ color, size, focused }) => {
          const name = route.name === "Dashboard"
            ? (focused ? "home" : "home-outline")
            : (focused ? "stats-chart" : "stats-chart-outline");
          return <Ionicons name={name as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} options={{ title: "Завдання" }} />
      <Tab.Screen name="Analytics" component={StudentAnalyticsScreen} options={{ title: "Статистика" }} />
    </Tab.Navigator>
  );
};
