import * as ImagePickerL from "expo-image-picker";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from "react-native-reanimated";
import { theme } from "../../styles/theme";
import { Button } from "../Button/Button";
import { Image } from "../Image/Image";
import { ImageModal } from "../ImageModal/ImageModal";

export const ImagePicker = () => {
	const [picked, setPicked] = useState<ImagePickerL.ImagePickerResult>({
		assets: [],
		canceled: false,
	});

	const handlePress = async () => {
		try {
			let result = await ImagePickerL.launchImageLibraryAsync({
				mediaTypes: ImagePickerL.MediaTypeOptions.Images,
				allowsMultipleSelection: true,
			});
			setPicked(result);
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}
		}
	};

	const handleRemove = (uri: string) => {
		setPicked((prev) => ({
			assets: prev.assets?.filter((item) => item.uri !== uri) || [],
			canceled: false,
		}));
	};

	const [activeImage, setActiveImage] = useState<string | null>(null);

	return (
		<View>
			{!!picked?.assets?.length && (
				<ScrollView
					style={styles.scroll}
					contentContainerStyle={styles.imagesContainer}
				>
					{picked.assets.map((item, index) => (
						<Animated.View
							key={item.uri}
							entering={FadeIn.delay(index * 20)}
							exiting={FadeOut.duration(100)}
							layout={LinearTransition.delay(100)}
						>
							<Image
								style={[
									styles.imageContainer,
									{ width: Dimensions.get("screen").width / 3 - 16 },
								]}
								onPress={() => setActiveImage(item.uri)}
								removable
								onRemoveRequest={handleRemove}
								uri={item.uri}
							/>
						</Animated.View>
					))}
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
		width: 80,
		aspectRatio: 1,
		borderWidth: 1,
		borderColor: theme.colorLines,
		borderRadius: 6,
		overflow: "hidden",
	},
	image: {
		flex: 1,
		aspectRatio: 1,
	},
	removeImageIcon: {
		position: "absolute",
		top: -7,
		right: -7,
		padding: 10,
		color: "white",
	},
});
