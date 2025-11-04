import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/Button/Button";
import { ImagePicker } from "../components/ImagePicker/ImagePicker";
import { RootStackParamList } from "../navigation/AppNav";
import { theme } from "../styles/theme";
import { getMarkText } from "../utils/getMarkText";

type TaskScreenProps = NativeStackScreenProps<RootStackParamList, "Task">;

import * as Notifications from "expo-notifications";

const triggerNotifications = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You’ve got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: {seconds:2},
  });
};

export const TaskScreen = ({
  route: {
    params: { title, body, expirationDate, publishDate, mark },
  },
}: TaskScreenProps) => {
  const isSubmitted = true;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.taskInfo}>
        <View style={styles.taskInfoHeader}>
          <Text style={styles.taskTitle}>{title}</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.markText}>
              {getMarkText(isSubmitted, mark)}
            </Text>
            <Text style={{ color: "#333" }}>
              Термін здачі: {expirationDate}
            </Text>
          </View>
        </View>
        <Text style={styles.taskBody}>{body}</Text>
      </ScrollView>
      <View style={styles.bottomControls}>
        <View style={styles.bottomControlsHeader}>
          <Text style={styles.bottomControlsText}>Ваша робота</Text>
          <Text style={styles.markText}>{getMarkText(isSubmitted, mark)}</Text>
        </View>
        <ImagePicker />
        <Button
          title="Відправити"
          onPress={async () => {
            await triggerNotifications();
            console.log('dadsar')
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskInfo: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colorLines,
  },
  taskInfoHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.accentColor,
  },
  taskTitle: {
    fontSize: 24,
    marginBottom: 8,
    color: theme.accentColor,
  },
  taskBody: {
    fontSize: 14,
    lineHeight: 18,
  },
  bottomControls: {
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: theme.white,
    // elevation: 3,
    // shadowColor: theme.accentColor,
    // borderTopWidth: 1,
    // borderTopColor: "#e7e7e7",
  },
  bottomControlsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  bottomControlsText: {
    fontSize: 20,
    lineHeight: 20,
    marginBottom: 12,
  },
  markText: {
    fontSize: 14,
    lineHeight: 14,
  },
});
