import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";
import { AuthForm } from "../components/AuthForm/AuthForm";

export const AuthScreen = () => {
  const [sheetHeight, setSheetHeight] = useState(0);

  return (
    <View style={styles.root}>
      {/* Accent hero header */}
      <View style={[styles.heroArea, sheetHeight ? { paddingBottom: sheetHeight + 8 } : null]}>
        <View style={styles.heroBgShapeA} />
        <View style={styles.heroBgShapeB} />
        <SafeAreaView edges={["top"]}>
          <Text style={styles.brand}>Taskify</Text>
          <Text style={styles.tagline}>Організуйте навчання без зайвого стресу</Text>
        </SafeAreaView>
      </View>

      {/* Bottom sheet form */}
      <SafeAreaView
        edges={["bottom"]}
        style={styles.sheetArea}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          setSheetHeight(h);
        }}
      >
        <AuthForm />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.accentColor },
  heroArea: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    justifyContent: "flex-end",
    position: "relative",
  },
  heroBgShapeA: {
    position: "absolute",
    right: -40,
    top: -30,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroBgShapeB: {
    position: "absolute",
    left: -60,
    bottom: -60,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  brand: { color: theme.white, fontSize: 34, fontWeight: "900" },
  tagline: { color: "#E7F0FF", marginTop: 8, fontWeight: "700", maxWidth: "90%" },
  sheetArea: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 12,
    elevation: 6,
  },
});
