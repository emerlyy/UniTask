import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tasksData from "../constants/mockdata.json";
import { theme } from "../styles/theme";
import { Filter } from "../components/Filter/Filter";
import { TaskCard } from "../components/TaskCard/TaskCard";

export const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const filters = [
    { value: "all", label: "Усі" },
    { value: "assigned", label: "Призначені" },
    { value: "pending", label: "Очікують" },
    { value: "graded", label: "Оцінено" },
  ];

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case "assigned":
        return tasksData.filter((t) => !t.submitted);
      case "pending":
        return tasksData.filter((t) => t.submitted && !t.mark);
      case "graded":
        return tasksData.filter((t) => t.submitted && !!t.mark);
      default:
        return tasksData;
    }
  }, [activeFilter]);

  const withStatus = useMemo(() => (
    filtered.map((t) => ({
      ...t,
      _status: !t.submitted ? ("assigned" as const) : t.submitted && !t.mark ? ("pending" as const) : ("graded" as const),
    }))
  ), [filtered]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Filter filters={filters} active={activeFilter} onChange={setActiveFilter} />
      </View>

      <FlatList
        data={withStatus}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TaskCard
            title={item.title}
            course={item.course}
            expirationDate={item.expirationDate}
            author={item.author}
            mark={item.mark}
            status={item._status}
            onPress={() => navigation.navigate("Task", { id: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterContainer: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: theme.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLines,
  },
  list: { padding: 12, paddingBottom: 24 },
});
