import { FlatList, StyleProp, View, ViewStyle } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Task as TTask } from "../../types";
import { Task } from "../Task/Task";

interface TaskListProps {
  tasks: TTask[];
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const TaskList = ({ tasks, contentContainerStyle }: TaskListProps) => {
  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
      data={tasks}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInUp.delay(index * 20)}>
          <Task {...item} />
        </Animated.View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 12 }}></View>}
    />
  );
};

