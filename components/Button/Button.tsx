import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { theme } from "../../styles/theme";
import { Pressable } from "../Pressable/Pressable";

interface ButtonProps {
	onPress?: () => void;
	title?: string;
	animateTitle?: boolean;
	titleKey?: string;
	type?: "primary" | "secondary";
	size?: "small" | "large";
}

export const Button = ({
	onPress,
	title,
	titleKey,
	animateTitle,
	type = "primary",
	size = "small",
}: ButtonProps) => {
	return (
		<Pressable
			containerStyle={[
				styles.container,
				type === "secondary" && styles.secondary,
			]}
			pressableStyle={[styles.button, size === "large" && styles.large]}
			rippleColor={type === "primary" ? "white" : "accent"}
			onPress={onPress}
		>
			<Animated.Text
				key={titleKey}
				entering={animateTitle ? FadeIn.delay(100) : undefined}
				exiting={animateTitle ? FadeOut.duration(100) : undefined}
				style={[
					styles.buttonText,
					type === "secondary" && styles.buttonTextSecondary,
				]}
			>
				{title}
			</Animated.Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 6,
		overflow: "hidden",
		backgroundColor: theme.accentColor,
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 14,
	},
	buttonText: {
		color: theme.white,
		fontSize: 16,
		lineHeight: 18,
		fontWeight: "bold",
	},
	large: {
		paddingVertical: 15,
		paddingHorizontal: 16,
	},
	secondary: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: theme.accentColor,
	},
	buttonTextSecondary: {
		color: theme.accentColor,
	},
});
