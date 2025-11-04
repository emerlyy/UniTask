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
  fullWidth?: boolean;
  dense?: boolean;
}

export const Button = ({
	onPress,
	title,
	titleKey,
	animateTitle,
	type = "primary",
	size = "small",
  fullWidth = false,
  dense = false,
}: ButtonProps) => {
	return (
		<Pressable
			containerStyle={[
				styles.container,
				type === "secondary" && styles.secondary,
			]}
			pressableStyle={[styles.button, size === "large" && styles.large, dense && styles.dense, fullWidth && styles.fullWidth]}
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
					dense && styles.buttonTextDense,
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
  dense: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  fullWidth: {
    width: "100%",
  },
	buttonText: {
		color: theme.white,
		fontSize: 16,
		lineHeight: 18,
		fontWeight: "bold",
	},
	buttonTextDense:{
		fontSize: 14,
		lineHeight: 16,
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
