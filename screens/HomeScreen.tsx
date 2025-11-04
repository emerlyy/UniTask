import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Filter } from "../components/Filter/Filter";
import { TaskList } from "../components/TaskList/TaskList";
import taks from "../constants/mockdata.json";
import { theme } from "../styles/theme";
import { Task } from "../types";

const filters = [
  { value: "scheduled", label: "Призначені" },
  { value: "submitted", label: "Здані" },
  { value: "all", label: "Всі" },
];

export const HomeScreen = () => {
  const [activeFilter, setActiveFilter] = useState(filters[0].value);
  const [tasks, setTasks] = useState(taks.sort((task) => (task.mark ? 1 : -1)));

  const changeFilter = (filter: string) => {
    setActiveFilter(filter);
  };

  const filteredTasks = useMemo(() => {
    switch (activeFilter) {
      case "scheduled":
        return tasks.filter((item) => !item.submitted);
      case "submitted":
        return tasks.filter((item) => !!item.submitted);
      default:
        return tasks;
    }
  }, [activeFilter]);

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
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLines,
  },
  list: {
    padding: 12,
  },
});
