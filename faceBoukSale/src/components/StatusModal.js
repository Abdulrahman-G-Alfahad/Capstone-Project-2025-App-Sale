import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StatusModal = ({
  visible,
  onClose,
  type = "success",
  title,
  message,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      checkAnim.setValue(0);
      dot1Anim.setValue(0);
      dot2Anim.setValue(0);
      dot3Anim.setValue(0);

      // Main modal animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After modal appears, animate check and dots
        Animated.sequence([
          // Check mark animation
          Animated.timing(checkAnim, {
            toValue: 1,
            duration: 250,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
          // Dots animation sequence
          Animated.stagger(80, [
            Animated.spring(dot1Anim, {
              toValue: 1,
              tension: 80,
              friction: 6,
              useNativeDriver: true,
            }),
            Animated.spring(dot2Anim, {
              toValue: 1,
              tension: 80,
              friction: 6,
              useNativeDriver: true,
            }),
            Animated.spring(dot3Anim, {
              toValue: 1,
              tension: 80,
              friction: 6,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      });
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
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
        return "close-thick";
      default:
        return "check-bold";
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
            <Ionicons name="close" size={20} color="rgba(153, 145, 177, 0.4)" />
          </TouchableOpacity>

          <View style={styles.iconWrapper}>
            <View style={styles.hueCircle} />
            <Animated.View
              style={[
                styles.dot1,
                {
                  opacity: dot1Anim,
                  transform: [
                    { scale: dot1Anim },
                    {
                      translateY: dot1Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot2,
                {
                  opacity: dot2Anim,
                  transform: [
                    { scale: dot2Anim },
                    {
                      translateY: dot2Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot3,
                {
                  opacity: dot3Anim,
                  transform: [
                    { scale: dot3Anim },
                    {
                      translateY: dot3Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [
                    {
                      scale: checkAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.5, 1.2, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Animated.View
                style={{
                  opacity: checkAnim,
                  transform: [
                    {
                      scale: checkAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 1.2, 1],
                      }),
                    },
                  ],
                }}
              >
                <MaterialCommunityIcons
                  name={getIconName()}
                  size={42}
                  color="#FFFFFF"
                />
              </Animated.View>
            </Animated.View>
          </View>

          <Text style={styles.title}>{title || "Success"}</Text>
          <Text style={styles.message}>
            {message || "Face enrollment completed successfully!"}
          </Text>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.modalButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20, 30, 48, 0.98)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#1A2942",
    borderRadius: 24,
    padding: 20,
    width: "75%",
    maxWidth: 320,
    alignItems: "center",
    shadowColor: "#9D7BEF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(157, 123, 239, 0.12)",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 8,
    zIndex: 1,
  },
  iconWrapper: {
    position: "relative",
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  hueCircle: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(157, 123, 239, 0.12)",
  },
  dot1: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(46, 196, 182, 0.25)",
    top: 15,
    right: 45,
  },
  dot2: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(46, 196, 182, 0.4)",
    bottom: 35,
    left: 40,
  },
  dot3: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(46, 196, 182, 0.3)",
    bottom: 70,
    right: 30,
  },
  iconContainer: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#9D7BEF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#9D7BEF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "rgba(142, 139, 167, 0.7)",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#9D7BEF",
    borderRadius: 30,
    marginTop: 4,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default StatusModal;
