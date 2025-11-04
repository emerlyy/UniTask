import { Text } from "react-native";

export const getMarkText = (isSubmitted: boolean, mark?: number) => {
	if (!isSubmitted) return "Не здано";
	if (!mark) return "Не оцінено";
	return (
		<>
			{mark}
			<Text style={{ color: "#666" }}>/100</Text>
		</>
	);
};
