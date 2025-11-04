import { PressableAndroidRippleConfig } from "react-native";
import { theme } from "../styles/theme";

export const PRESSABLE_RIPPLE_WHITE: PressableAndroidRippleConfig = {
	color: "#fbfbfb22",
};

export const PRESSABLE_RIPPLE_ACCENT: PressableAndroidRippleConfig = {
	color: `${theme.accentColor}11`,
};
