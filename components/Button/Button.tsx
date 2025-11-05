import { StyleSheet, View } from "react-native";
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
			containerStyle={[styles.container]}
			pressableStyle={[
				styles.button,
				size === "large" && styles.large,
				dense && styles.dense,
				fullWidth && styles.fullWidth,
				type === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
			]}
			rippleColor={type === "primary" ? "white" : "accent"}
			onPress={onPress}
		>
			<View style={styles.visualOverlay} pointerEvents="none" />
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
		borderRadius: 12,
		overflow: "hidden",
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 14,
	},
  buttonPrimary: {
    backgroundColor: theme.accentColor,
    borderWidth: 1,
    borderColor: theme.accentColor,
    shadowColor: theme.black,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    borderRadius: 12,
  },
  buttonSecondary: {
    backgroundColor: theme.accentColorMuted,
    borderWidth: 1,
    borderColor: theme.accentColor,
    borderRadius: 12,
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
		fontWeight: "800",
		letterSpacing: 0.4,
		textTransform: "uppercase",
	},
	buttonTextDense:{
		fontSize: 14,
		lineHeight: 16,
	},
	large: {
		paddingVertical: 15,
		paddingHorizontal: 16,
	},
	buttonTextSecondary: {
		color: theme.accentColor,
	},
  visualOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: theme.overlayWhiteMid,
    opacity: 0.35,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
