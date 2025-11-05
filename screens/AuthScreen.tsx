import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Pill } from "../components/Pill/Pill";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";
import { AuthForm } from "../components/AuthForm/AuthForm";
import { BRAND_NAME } from "../constants/branding";

const SHEET_MAX_HEIGHT = Math.round(Dimensions.get("window").height * 0.72);

export const AuthScreen = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <View style={styles.root}> 
      <View style={styles.heroArea}>
        <View style={styles.heroBgShapeA} />
        <View style={styles.heroBgShapeB} />
        <SafeAreaView edges={["top"]}>
          <View style={styles.topTabsContainer}>
            <Pill label="Вхід" active={!isRegister} onPress={() => setIsRegister(false)} />
            <Pill label="Реєстрація" active={isRegister} onPress={() => setIsRegister(true)} />
          </View>
        </SafeAreaView>
          <View style={styles.bottomBlock}>
            <Text style={styles.brand}>{BRAND_NAME}</Text>
          </View>
      </View>

      <KeyboardAvoidingView style={[styles.sheetArea, { maxHeight: SHEET_MAX_HEIGHT }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <SafeAreaView edges={["bottom"]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            <AuthForm isRegister={isRegister} />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.accentColor },
  heroArea: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    justifyContent: "space-between",
    position: "relative",
    flexGrow:1
  },
  heroBgShapeA: {
    position: "absolute",
    right: -40,
    top: -30,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: theme.overlayWhiteLow,
  },
  heroBgShapeB: {
    position: "absolute",
    left: -60,
    bottom: -60,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: theme.overlayWhiteLow,
  },
  brand: { color: theme.white, fontSize: 34, fontWeight: "900" },
  tagline: { color: theme.accentText, marginTop: 8, fontWeight: "700", maxWidth: "90%" },
  bottomBlock: { alignItems: "center", gap: 4, marginTop: 12, marginBottom:12 },
  topTabsContainer: {
    alignSelf: "center",
    flexDirection: "row",
    flexGrow:1,
    gap: 8,
    marginTop: 4,
    backgroundColor: theme.white,
    borderRadius: 999,
    padding: 6,
    borderWidth: 1,
    borderColor: theme.colorLines,
  },
  sheetArea: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    shadowColor: theme.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 12,
    elevation: 6,
  },
  sheetContent: {
    paddingBottom: 8,
  },
});
