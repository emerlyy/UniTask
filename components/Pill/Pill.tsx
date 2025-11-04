import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import { Pressable } from "../Pressable/Pressable";
import { theme } from "../../styles/theme";

type PillProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  pillStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Pill = ({ label, active = false, onPress, containerStyle, pillStyle, textStyle }: PillProps) => {
  return (
    <Pressable
      rippleColor="accent"
      containerStyle={[styles.container, containerStyle]}
      pressableStyle={[styles.pill, active && styles.pillActive, pillStyle]}
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.textActive, textStyle]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    overflow: "hidden",
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  text: {
    color: "#444",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 16,
  },
  textActive: {
    color: theme.white,
  },
});

