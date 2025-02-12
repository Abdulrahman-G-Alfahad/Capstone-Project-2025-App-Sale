import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const StatusModal = ({
  visible,
  onClose,
  type = "success",
  title,
  message,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getIconName = () => {
    switch (type) {
      case "success":
        return "check-bold";
      case "error":
        return "close";
      default:
        return "check-bold";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#FFFFFF";
      case "error":
        return "#FFFFFF";
      default:
        return "#FFFFFF";
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#9D7BEF";
      case "error":
        return "#FF5252";
      default:
        return "#9D7BEF";
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalView,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#9991b1" />
          </TouchableOpacity>

          <View style={styles.iconWrapper}>
            <View style={styles.hueCircle} />
            <View style={styles.decorativeDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: getBackgroundColor() },
              ]}
            >
              <MaterialCommunityIcons
                name={getIconName()}
                size={65}
                color={getIconColor()}
                style={styles.icon}
              />
            </View>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.title}>{title || "Success!"}</Text>
            <Text style={styles.message}>
              {message || "Money Transfered Successfully"}
            </Text>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: getBackgroundColor() },
              ]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20, 30, 48, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#1A2942",
    borderRadius: 24,
    padding: 32,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#9D7BEF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: "rgba(157, 123, 239, 0.2)",
    position: "relative",
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  iconWrapper: {
    position: "relative",
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  hueCircle: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(157, 123, 239, 0.12)",
    transform: [{ scale: 1 }],
  },
  decorativeDots: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  dot: {
    position: "absolute",
    backgroundColor: "#2C8C7D",
  },
  dot1: {
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 0,
    left: "50%",
    marginLeft: -5,
    opacity: 0.3,
  },
  dot2: {
    width: 16,
    height: 16,
    borderRadius: 8,
    bottom: "25%",
    right: 0,
    opacity: 0.5,
  },
  dot3: {
    width: 12,
    height: 12,
    borderRadius: 6,
    bottom: "25%",
    left: 0,
    opacity: 0.2,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#9D7BEF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
    zIndex: 1,
  },
  icon: {
    marginLeft: 0,
    marginTop: 0,
    transform: [{ scale: 1.4 }],
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#E8F0FE",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 16,
    color: "#8e8ba7",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  modalButton: {
    width: "100%",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#9D7BEF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 9,
  },
  modalButtonText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default StatusModal;
