import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../../navigation/AppNav";
import { theme } from "../../styles/theme";
import { Task as TTask } from "../../types";
import { Pressable } from "../Pressable/Pressable";

type TaskProps = TTask;

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Task">;

export const Task = ({
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
			publishDate,
			expirationDate,
			mark,
			author,
			submitted,
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
			<View style={styles.taskHeader}>
				<Text style={styles.titleText}>{title}</Text>
				<View style={[styles.statusPill, status.style]}>
					<Text style={styles.statusText}>
						{status.label}
						{status.label === "Оцінено" && mark ? ` • ${mark}/100` : ""}
					</Text>
				</View>
			</View>
			<Text style={styles.author}>{author}</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					marginTop: 8,
				}}
			>
				<Text style={styles.publishDate}>Опубліковано: {publishDate}</Text>
				<Text style={styles.publishDate}>Здати до: {expirationDate}</Text>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.white,
		borderWidth: 0.5,
		borderColor: theme.accentColor,
		borderRadius: 8,
	},
	pressable: {
		padding: 12,
	},
	taskHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	titleText: {
		fontSize: 15,
		fontWeight: "bold",
		marginBottom: 0,
		flex: 1,
	},
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
	statusAssigned: { backgroundColor: "#90A4AE" },
	statusPending: { backgroundColor: "#FF9800" },
	statusGraded: { backgroundColor: "#4CAF50" },
	author: {
		color: "#333",
		marginTop: 2,
	},
	publishDate: {
		marginBottom: 0,
		color: "#666",
		fontSize: 14,
	},
});
