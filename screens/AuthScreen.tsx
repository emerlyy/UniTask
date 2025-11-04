import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthForm } from "../components/AuthForm/AuthForm";

export const AuthScreen = () => {
	return (
		<SafeAreaView style={styles.container}>
			<AuthForm />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12,
		alignItems: "stretch",
		justifyContent: "center",
	},
});
