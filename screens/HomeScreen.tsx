import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Filter } from "../components/Filter/Filter";
import { TaskList } from "../components/TaskList/TaskList";
import taks from "../constants/mockdata.json";
import { theme } from "../styles/theme";
import { Task } from "../types";

const filters = [
  { value: "all", label: "Усі" },
  { value: "assigned", label: "Призначені" },
  { value: "pending", label: "Очікують" },
  { value: "graded", label: "Оцінено" },
];

export const HomeScreen = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [tasks] = useState(taks.sort((task) => (task.mark ? 1 : -1)));

  const changeFilter = (filter: string) => {
    setActiveFilter(filter);
  };

  const filteredTasks = useMemo(() => {
    switch (activeFilter) {
      case "assigned":
        return tasks.filter((item) => !item.submitted);
      case "pending":
        return tasks.filter((item) => item.submitted && !item.mark);
      case "graded":
        return tasks.filter((item) => item.submitted && !!item.mark);
      default:
        return tasks;
    }
  }, [activeFilter, tasks]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Filter
          filters={filters}
          active={activeFilter}
          onChange={changeFilter}
        />
      </View>
      <TaskList
        tasks={filteredTasks as Task[]}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLines,
  },
  list: {
    padding: 12,
  },
});
