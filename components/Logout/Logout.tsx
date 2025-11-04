import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { PRESSABLE_RIPPLE_ACCENT } from "../../constants/ripple";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";

export const Logout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout!();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>Івасюк Вадим</Text>
      <View style={styles.iconContainer}>
        <Pressable
          onPress={() =>
            Alert.alert(
              "Підтвердіть дію",
              "Ви дійсно хочете вийти?",
              [{ text: "Вийти", onPress: handleLogout }, { text: "Скасувати" }],
              { cancelable: true }
            )
          }
          android_ripple={PRESSABLE_RIPPLE_ACCENT}
          style={{ flex: 1, height: "100%", width: "100%", padding: 6 }}
        >
          <Image
            style={styles.icon}
            source={require("../../assets/logout-icon.png")}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 4 },
  userName: {
    marginBottom: -2,
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 16,
    color: theme.accentColor,
  },
  iconContainer: {
    borderRadius: 24,
    overflow: "hidden",
  },
  icon: {
    height: 24,
    aspectRatio: 1,
  },
});
