import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
	Dimensions,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from "react-native-reanimated";
import { theme } from "../../styles/theme";
import { Button } from "../Button/Button";
import { Image } from "../Image/Image";
import { ImageModal } from "../ImageModal/ImageModal";

const PICKER_TYPES: string[] = [
	"image/*",
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const PREVIEW_SIZE = Dimensions.get("screen").width / 3 - 16;
const isImageAsset = (asset: DocumentPicker.DocumentPickerAsset) =>
	asset.mimeType?.startsWith("image/") ||
	(/\.(png|jpe?g|gif|webp|heic)$/i.test(asset.name));

export const FilePicker = () => {
	const [assets, setAssets] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
	const [activeImage, setActiveImage] = useState<string | null>(null);

	const handlePress = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: PICKER_TYPES,
				multiple: true,
				copyToCacheDirectory: true,
			});

			if (!result.canceled && result.assets) {
				setAssets((prev) => [...prev, ...result.assets]);
			}
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}
		}
	};

	const handleRemove = (uri: string) => {
		setAssets((prev) => prev.filter((item) => item.uri !== uri));
		setActiveImage((prev) => (prev === uri ? null : prev));
	};

	return (
		<View>
			{!!assets.length && (
				<ScrollView
					style={styles.scroll}
					contentContainerStyle={styles.imagesContainer}
				>
					{assets.map((item, index) => {
						const showAsImage = isImageAsset(item);

						return (
							<Animated.View
								key={item.uri}
								entering={FadeIn.delay(index * 20)}
								exiting={FadeOut.duration(100)}
								layout={LinearTransition.delay(100)}
							>
								{showAsImage ? (
									<Image
										style={styles.imageContainer}
										onPress={() => setActiveImage(item.uri)}
										removable
										onRemoveRequest={handleRemove}
										uri={item.uri}
									/>
								) : (
									<View style={styles.fileContainer}>
										<Text style={styles.fileName} numberOfLines={2}>
											{item.name}
										</Text>
										<Pressable
											onPress={() => handleRemove(item.uri)}
											style={styles.fileRemove}
											hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
										>
											<Text style={styles.fileRemoveText}>Видалити</Text>
										</Pressable>
									</View>
								)}
							</Animated.View>
						);
					})}
				</ScrollView>
			)}
			<Button
				title="+ Прикріпити файли"
				type="secondary"
				onPress={handlePress}
			/>
			<ImageModal
				visible={!!activeImage}
				onRequestClose={() => setActiveImage(null)}
				source={{ uri: activeImage || undefined }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	scroll: {
		maxHeight: 140,
		marginBottom: 10,
	},
	imagesContainer: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 6,
		paddingBottom: 4,
	},
	imageContainer: {
		width: PREVIEW_SIZE,
		aspectRatio: 1,
		borderWidth: 1,
		borderColor: theme.colorLines,
		borderRadius: 6,
		overflow: "hidden",
	},
	fileContainer: {
		width: PREVIEW_SIZE,
		minHeight: 84,
		borderWidth: 1,
		borderColor: theme.colorLines,
		borderRadius: 6,
		backgroundColor: theme.accentColorMuted,
		alignItems: "center",
		justifyContent: "space-between",
		padding: 8,
		gap: 8,
	},
	fileName: {
		textAlign: "center",
		fontSize: 12,
	},
	fileRemove: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		backgroundColor: theme.accentColor,
	},
	fileRemoveText: {
		color: theme.white,
		fontSize: 11,
		fontWeight: "500",
	},
});
