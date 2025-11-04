import {
	PressableAndroidRippleConfig,
	Pressable as RNPressable,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from "react-native";
import {
	PRESSABLE_RIPPLE_ACCENT,
	PRESSABLE_RIPPLE_WHITE,
} from "../../constants/ripple";

interface PressableProps extends React.ComponentProps<typeof RNPressable> {
	rippleColor?: "none" | "white" | "accent";
	containerStyle?: StyleProp<ViewStyle>;
	pressableStyle?: StyleProp<ViewStyle>;
	children?: React.ReactNode;
}
export const Pressable = ({
	rippleColor = "none",
	containerStyle,
	pressableStyle,
	children,
	...props
}: PressableProps) => {
	let ripple: PressableAndroidRippleConfig | null = null;

	switch (rippleColor) {
		case "white":
			ripple = PRESSABLE_RIPPLE_WHITE;
			break;
		case "accent":
			ripple = PRESSABLE_RIPPLE_ACCENT;
			break;
	}

	return (
		<View style={[styles.container, containerStyle]}>
			<RNPressable android_ripple={ripple} style={pressableStyle} {...props}>
				{children}
			</RNPressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
	},
});
