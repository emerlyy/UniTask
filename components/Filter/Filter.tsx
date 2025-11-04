import { StyleSheet, View } from "react-native";
import { Pill } from "../Pill/Pill";

type FilterType = { value: string; label: string };

interface FilterProps {
	filters: FilterType[];
	active: FilterType["value"];
	onChange: (filter: string) => void;
}

export const Filter = ({ filters, onChange, active }: FilterProps) => {
  return (
    <View style={styles.container}>
      {filters.map((item) => (
        <Pill key={item.value} label={item.label} active={active === item.value} onPress={() => onChange(item.value)} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
  },
});
