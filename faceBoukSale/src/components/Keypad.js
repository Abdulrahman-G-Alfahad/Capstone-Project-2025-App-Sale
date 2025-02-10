import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Keypad = ({
  onNumberPress,
  onDecimalPress,
  onDeletePress,
  onClearPress,
}) => {
  const renderKeypadButton = (
    content,
    onPress,
    style = {},
    textStyle = styles.keypadButtonText,
    isIcon = false
  ) => (
    <TouchableOpacity
      style={[styles.keypadButton, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isIcon ? (
        <Ionicons name={content} size={24} color="#E8F0FE" />
      ) : (
        <Text style={textStyle}>{content}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.keypad}>
      <View style={styles.keypadRow}>
        {renderKeypadButton("1", () => onNumberPress("1"))}
        {renderKeypadButton("2", () => onNumberPress("2"))}
        {renderKeypadButton("3", () => onNumberPress("3"))}
      </View>
      <View style={styles.keypadRow}>
        {renderKeypadButton("4", () => onNumberPress("4"))}
        {renderKeypadButton("5", () => onNumberPress("5"))}
        {renderKeypadButton("6", () => onNumberPress("6"))}
      </View>
      <View style={styles.keypadRow}>
        {renderKeypadButton("7", () => onNumberPress("7"))}
        {renderKeypadButton("8", () => onNumberPress("8"))}
        {renderKeypadButton("9", () => onNumberPress("9"))}
      </View>
      <View style={styles.keypadRow}>
        {renderKeypadButton(".", onDecimalPress)}
        {renderKeypadButton("0", () => onNumberPress("0"))}
        {renderKeypadButton(
          "backspace-outline",
          onDeletePress,
          {},
          styles.keypadButtonText,
          true
        )}
      </View>
      <View style={styles.clearSection}>
        {renderKeypadButton(
          "Reset Amount",
          onClearPress,
          styles.clearButton,
          styles.clearButtonText
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keypad: {
    marginVertical: 12,
    gap: 10,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  keypadButton: {
    flex: 1,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keypadButtonText: {
    color: "#E8F0FE",
    fontSize: 22,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif",
  },
  clearSection: {
    marginTop: 10,
    height: 48,
  },
  clearButton: {
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButtonText: {
    color: "#A78BFA",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif",
  },
});

export default Keypad;
