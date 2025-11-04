import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/Button/Button";
import { FilePicker } from "../components/FilePicker/FilePicker";
import { RootStackParamList } from "../navigation/AppNav";
import { theme } from "../styles/theme";
import { getMarkText } from "../utils/getMarkText";
import { formatDateDisplay } from "../utils/formatDate";

type TaskScreenProps = NativeStackScreenProps<RootStackParamList, "Task">;

export const TaskScreen = ({
  route: {
    params: { title, body, expirationDate, publishDate, mark, author },
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
              Термін здачі: {formatDateDisplay(expirationDate)}
            </Text>
          </View>
          {!!author && (
            <Text style={{ color: "#616161", marginTop: 6 }}>
              Викладач: <Text style={{ color: "#333", fontWeight: "600" }}>{author}</Text>
            </Text>
          )}
        </View>
        <Text style={styles.taskBody}>{body}</Text>
      </ScrollView>
      <View style={styles.bottomControls}>
        <View style={styles.bottomControlsHeader}>
          <Text style={styles.bottomControlsText}>Ваша робота</Text>
          <Text style={styles.markText}>{getMarkText(isSubmitted, mark)}</Text>
        </View>
        <FilePicker />
        <Button
          title="Відправити"
          onPress={async () => {
        
            console.log('Submit')
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
