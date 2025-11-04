import { useEffect } from "react";
import {
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	ViewStyle,
} from "react-native";
import Animated, {
	AnimatedStyle,
	Easing,
	ReduceMotion,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { PRESSABLE_RIPPLE_ACCENT } from "../../constants/ripple";
import { theme } from "../../styles/theme";

interface FilterButtonProps {
	defaultColor: string;
	activeColor: string;
	isActive: boolean;
	style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
	isFirst: boolean;
	isLast: boolean;
	onPress: () => void;
	label: string;
}

export const FilterButton = ({
	defaultColor,
	activeColor,
	isActive,
	onPress,
	isFirst,
	isLast,
	label,
}: FilterButtonProps) => {
	const progress = useSharedValue(0);

	useEffect(() => {
		progress.value = withTiming(isActive ? 1 : 0, {
			duration: 100,
			easing: Easing.linear,
			reduceMotion: ReduceMotion.System,
		});
	}, [isActive, progress]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: interpolateColor(
				progress.value,
				[0, 1],
				[defaultColor, activeColor]
			),
		};
	});

	return (
		<Animated.View
			style={[
				styles.container,
				isFirst && styles.firstButton,
				isLast && styles.lastButton,
				isActive && styles.filterButtonActive,
				animatedStyle,
			]}
		>
			<Pressable
				android_ripple={PRESSABLE_RIPPLE_ACCENT}
				onPress={onPress}
				style={[styles.pressable]}
			>
				<Text style={styles.filterButtonText}>{label}</Text>
			</Pressable>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: theme.accentColor,
		borderTopLeftRadius:1,
	},
	firstButton: {
		borderTopLeftRadius: 8,
		borderBottomLeftRadius: 8,
		marginRight: -1,
	},
	lastButton: {
		marginLeft: -1,
		borderTopRightRadius: 8,
		borderBottomRightRadius: 8,
	},
	pressable: {
		textAlign: "center",
		paddingHorizontal: 4,
		paddingVertical: 8,
	},
	filterButtonActive: {
		borderWidth: 1,
		zIndex: 1,
	},
	filterButtonText: {
		textAlign: "center",
		fontSize: 14,
		fontWeight: "500",
	},
});
