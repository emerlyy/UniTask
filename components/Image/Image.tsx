import {
	Alert,
	Pressable,
	Image as RNImage,
	StyleProp,
	StyleSheet,
	Vibration,
	ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PRESSABLE_RIPPLE_WHITE } from "../../constants/ripple";

interface ImageProps {
	uri: string;
	removable?: boolean;
	onRemoveRequest?: (uri: string) => void;
	onPress?: () => void;
	style: StyleProp<ViewStyle>;
}

export const Image = ({
	uri,
	removable,
	onRemoveRequest,
	onPress,
	style,
}: ImageProps) => {
	const handleRemove = () => {
		onRemoveRequest && onRemoveRequest(uri);
	};

	return (
		<Pressable
			onPress={onPress}
			android_ripple={PRESSABLE_RIPPLE_WHITE}
			style={style}
			{...(removable && {
				onLongPress: () => {
					Vibration.vibrate(50);
					Alert.alert(
						"Підтвердіть дію",
						"Ви дійсно хочете відкріпити зображення?",
						[
							{ text: "Відкріпити", onPress: handleRemove },
							{ text: "Скасувати" },
						],
						{ cancelable: true }
					);
				},
			})}
		>
			<RNImage style={styles.image} source={{ uri: uri }} resizeMode="cover" />
			{removable && (
				<Pressable
					style={styles.removeImageIcon}
					onPress={handleRemove}
					hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
				>
					<Ionicons
						name="close"
						size={16}
						color="white"
						style={{
							textShadowRadius: 3,
							shadowColor: "black",
							shadowOpacity: 2,
						}}
					/>
				</Pressable>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	image: {
		flex: 1,
		aspectRatio: 1,
	},
	removeImageIcon: {
		position: "absolute",
		top: 3,
		right: 3,
		color: "white",
		shadowColor: "red",
		elevation: 1,
	},
});
