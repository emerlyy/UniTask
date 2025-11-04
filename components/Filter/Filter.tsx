import { StyleSheet, View } from "react-native";
import { theme } from "../../styles/theme";
import { FilterButton } from "./FilterButton";

type FilterType = { value: string; label: string };

interface FilterProps {
	filters: FilterType[];
	active: FilterType["value"];
	onChange: (filter: string) => void;
}

export const Filter = ({ filters, onChange, active }: FilterProps) => {
	return (
		<View style={styles.container}>
			{filters.map((item, index, array) => {
				const isActive = active === item.value;
				return (
					<FilterButton
						key={item.value}
						label={item.label}
						defaultColor={theme.accentColorMuted}
						activeColor={theme.accentColorLight}
						isActive={isActive}
						isFirst={index === 0}
						isLast={index === array.length - 1}
						onPress={() => onChange(item.value)}
					/>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
	},
});
