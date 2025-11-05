import React from "react";
import { StyleSheet, Text, TextInput, View, StyleProp, TextStyle } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { theme } from "../../styles/theme";

interface InputProps extends React.ComponentProps<typeof TextInput> {
	value?: string;
	onChangeText?: (text: string) => void;
	label?: string;
	errorMessage?: string;
	style?: StyleProp<TextStyle>;
  variant?: "outline" | "filled" | "underline";
}

const InputComponent = (
	{ value, onChangeText, label, errorMessage, style, variant = "outline", ...props }: InputProps,
	ref: React.Ref<View>
) => {
		const inputStyle = [
			styles.input,
			variant === "filled" && styles.inputFilled,
			variant === "underline" && styles.inputUnderline,
			style,
		];

		return (
			<Animated.View ref={ref}>
				<View style={styles.labelContainer}>
					{label && <Text style={styles.label}>{label}</Text>}
					{errorMessage && (
						<Animated.Text
							style={styles.errorMessage}
							entering={FadeIn.duration(100)}
							exiting={FadeOut.duration(100)}
						>
							{errorMessage}
						</Animated.Text>
					)}
				</View>
				<TextInput
					style={inputStyle}
					placeholder={props.placeholder}
					value={value}
					onChangeText={onChangeText}
					cursorColor={theme.accentColor}
					{...props}
				/>
			</Animated.View>
		);
};

InputComponent.displayName = "Input";

export const Input = React.forwardRef<View, InputProps>(InputComponent);

const styles = StyleSheet.create({
	labelContainer: {
		marginBottom: 6,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		gap: 6,
	},
	label: {
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 2,
	},
	input: {
		height: 50,
		borderColor: "#e0e3e8",
		borderWidth: 1,
		marginBottom: 2,
		padding: 12,
		borderRadius: 6,
		fontSize: 15,
	},
	inputFilled: {
		backgroundColor: "#F3F4F6",
		borderWidth: 0,
	},
	inputUnderline: {
		borderWidth: 0,
		borderBottomWidth: 1,
		borderRadius: 0,
	},
	errorMessage: {
		color: theme.red,
		marginLeft: 2,
	},
});
