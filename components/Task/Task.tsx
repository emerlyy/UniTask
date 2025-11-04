import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../../navigation/AppNav";
import { theme } from "../../styles/theme";
import { Task as TTask } from "../../types";
import { getMarkText } from "../../utils/getMarkText";
import { Pressable } from "../Pressable/Pressable";

type TaskProps = TTask;

type HomeScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"Home" | "Task"
>;

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

	return (
		<Pressable
			containerStyle={styles.container}
			pressableStyle={styles.pressable}
			onPress={handleClick}
			rippleColor="accent"
		>
			<View style={styles.taskHeader}>
				<Text style={styles.titleText}>{title}</Text>
				<Text style={styles.markText}>{getMarkText(submitted, mark)}</Text>
			</View>
			<Text>{author}</Text>
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
	markText: {
		fontSize: 14,
		lineHeight: 14,
	},
	publishDate: {
		marginBottom: 0,
		color: "#666",
		fontSize: 14,
	},
});
