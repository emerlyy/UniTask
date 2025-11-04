import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../styles/theme";
import { Pressable } from "../Pressable/Pressable";

type FilterType = { value: string; label: string };

interface FilterProps {
	filters: FilterType[];
	active: FilterType["value"];
	onChange: (filter: string) => void;
}

export const Filter = ({ filters, onChange, active }: FilterProps) => {
  return (
    <View style={styles.container}>
      {filters.map((item) => {
        const isActive = active === item.value;
        return (
          <Pressable
            key={item.value}
            rippleColor="accent"
            containerStyle={styles.pillContainer}
            pressableStyle={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onChange(item.value)}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
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
  pillContainer: {
    borderRadius: 100,
    overflow: "hidden",
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: theme.colorLines,
    backgroundColor: theme.white,
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: theme.accentColor,
    borderColor: theme.accentColor,
  },
  pillText: {
    color: "#444",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 16,
  },
  pillTextActive: {
    color: theme.white,
  },
});
