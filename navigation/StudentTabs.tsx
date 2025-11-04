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
        tabBarInactiveTintColor: "#8A8A8A",
        tabBarStyle: {
          backgroundColor: theme.white,
          borderTopWidth: 1,
          borderTopColor: theme.colorLines,
          height: 58,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
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
