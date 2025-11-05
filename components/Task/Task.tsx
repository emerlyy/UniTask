import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../../navigation/AppNav";
import { theme } from "../../styles/theme";
import { formatDateDisplay } from "../../utils/formatDate";
import { Task as TTask } from "../../types";
import { Pressable } from "../Pressable/Pressable";

type TaskProps = TTask;

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Task">;

export const Task = ({
  course,
  title,
  body,
  publishDate,
  expirationDate,
  mark,
  author,
  submitted,
}: TaskProps) => {
	const navigation = useNavigation<HomeScreenNavigationProp>();

		const handleClick = () => {
			navigation.navigate("Task", {
				title,
				body,
          course,
				publishDate,
				expirationDate,
				mark,
				author,
				submitted,
          status:
            !submitted ? "assigned" : submitted && !mark ? "pending" : "graded",
			});
		};

	const status = (() => {
		if (!submitted) return { label: "Призначено", style: styles.statusAssigned };
		if (submitted && !mark) return { label: "Очікує", style: styles.statusPending };
		return { label: "Оцінено", style: styles.statusGraded };
	})();


  return (
    <Pressable
      containerStyle={styles.container}
      pressableStyle={styles.pressable}
      onPress={handleClick}
      rippleColor="accent"
    >
      <View style={styles.headerRow}>
        <Text style={styles.course}>{course || ""}</Text>
        <View style={[styles.statusPill, status.style]}>
          <Text style={styles.statusText}>
            {status.label}
            {status.label === "Оцінено" && mark ? ` • ${mark}/100` : ""}
          </Text>
        </View>
      </View>
      <Text style={styles.titleText}>{title}</Text>
      {!!author && (
        <Text style={styles.authorText}>Викладач: <Text style={styles.authorValue}>{author}</Text></Text>
      )}
      <View style={styles.metaRow}>
        <Text style={styles.deadline}>Дедлайн: <Text style={styles.deadlineValue}>{formatDateDisplay(expirationDate)}</Text></Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
	container: {
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.colorLines,
    borderRadius: 12,
  },
  pressable: {
    padding: 12,
    gap: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
  },
  authorText: { color: theme.textSecondary },
  authorValue: { color: theme.textPrimary, fontWeight: "600" },
	statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
	statusText: {
		color: theme.white,
		fontSize: 12,
		fontWeight: "600",
	},
  statusAssigned: { backgroundColor: theme.statusAssigned },
  statusPending: { backgroundColor: theme.statusPending },
  statusGraded: { backgroundColor: theme.statusGraded },
  course: { color: theme.accentColor, fontWeight: "600" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  deadline: { color: theme.textSecondary },
  deadlineValue: { color: theme.textPrimary, fontWeight: "600" },
	publishDate: {
		marginBottom: 0,
    color: theme.textSecondary,
		fontSize: 14,
	},
});
