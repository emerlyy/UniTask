import { Text } from "react-native";
import { theme } from "../styles/theme";

export const getMarkText = (isSubmitted: boolean, mark?: number) => {
	if (!isSubmitted) return "Не здано";
	if (!mark) return "Не оцінено";
	return (
		<>
			{mark}
            <Text style={{ color: theme.textSecondary }}>/100</Text>
		</>
	);
};
