import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import {
	Image,
	ImageSourcePropType,
	ImageStyle,
	Modal,
	Pressable,
	StyleProp,
	StyleSheet,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImageModalProps {
	visible: boolean;
	onRequestClose: () => void;
	style?: StyleProp<ImageStyle>;
	source: ImageSourcePropType;
}

export const ImageModal = ({
	visible,
	onRequestClose,
	source,
	style,
}: ImageModalProps) => {
	return (
		<Modal
			onRequestClose={onRequestClose}
			style={{ ...StyleSheet.absoluteFillObject }}
			visible={visible}
			animationType="fade"
			transparent
			statusBarTranslucent
		>
			<View style={[styles.modalView, style]}>
				<Pressable
					hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
					style={{
						backgroundColor: "#00000000",
						position: "absolute",
						top: "5%",
						right: "5%",
						zIndex: 999,
					}}
					onPress={onRequestClose}
				>
					<Ionicons
						name="close"
						size={30}
						color="white"
						style={{
							textShadowRadius: 3,
							shadowColor: "black",
							shadowOpacity: 2,
						}}
					/>
				</Pressable>
				<ReactNativeZoomableView
					style={styles.zoomableView}
					maxZoom={3}
					minZoom={1}
					zoomStep={3}
				>
					<Image
						source={source}
						resizeMethod="resize"
						resizeMode="contain"
						style={styles.modalImage}
					/>
				</ReactNativeZoomableView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalView: {
		flex: 1,
		backgroundColor: "#000000cc",
	},
	zoomableView: {
		width: "80%",
		height: "100%",
	},
	modalImage: {
		width: "100%",
		height: "100%",
	},
});
