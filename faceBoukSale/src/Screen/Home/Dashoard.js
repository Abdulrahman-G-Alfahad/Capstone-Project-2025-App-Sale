import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Animated,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Keypad from "../../components/Keypad";
import FaceID from "../../components/FaceID";
import { makeFaceIdPayment } from "../../api/transactions";
import { useMutation } from "@tanstack/react-query";
import { getBusinessProfile } from "../../api/auth";
import { getToken } from "../../api/storage";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [amountScale] = useState(new Animated.Value(1));
  const [showFaceID, setShowFaceID] = useState(false);
  const [faceId, setFaceId] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [receiver, setReceiver] = useState("");
  const [associate, setAssociate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const formData = {
    faceId: faceId,
    amount: amount,
    method: "FACEID",
    receiverId: receiver,
    associateId: associate,
  };

  // console.log(formData);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if data already exists
        const storedData = await AsyncStorage.getItem("businessData");
        if (storedData) {
          const { receiverId, associateId } = JSON.parse(storedData);
          setReceiver(receiverId);
          setAssociate(associateId);
          setIsInitialized(true);
          return;
        }

        // If not stored, fetch and store
        setIsLoading(true);
        const token = await getToken();
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const business = await getBusinessProfile(userId);
        const businessData = {
          receiverId: business.business.id,
          associateId: userId,
        };

        // Store data
        await AsyncStorage.setItem(
          "businessData",
          JSON.stringify(businessData)
        );

        // Set state
        setReceiver(businessData.receiverId);
        setAssociate(businessData.associateId);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize business data:", error);
        Alert.alert(
          "Error",
          "Failed to load business profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized]);

  const animateAmount = () => {
    Animated.sequence([
      Animated.timing(amountScale, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(amountScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNumberPress = (num) => {
    if (amount.includes(".") && amount.split(".")[1]?.length >= 3) return;
    setAmount((prev) => prev + num);
    animateAmount();
  };

  const handleDecimalPress = () => {
    if (!amount.includes(".")) {
      setAmount((prev) => (prev === "" ? "0." : prev + "."));
      animateAmount();
    }
  };

  const handleDeletePress = () => {
    setAmount((prev) => prev.slice(0, -1));
    animateAmount();
  };

  const handleClearPress = () => {
    setAmount("");
    animateAmount();
  };

  const { mutate } = useMutation({
    mutationKey: ["faceIdPayment"],
    mutationFn: () => makeFaceIdPayment(formData),
    onSuccess: (data) => {
      console.log(data);
      Alert.alert("Success", "Payment completed successfully!", [
        {
          text: "Continue",
        },
      ]);
    },
    onError: () => {
      Alert.alert("Error", "Payment failed. Please try again later.");
    },
  });

  const handleFaceIDPress = () => {
    setShowFaceID(true);
  };

  const handleFacePayment = () => {
    console.log("Face payment initiated", faceId);
    mutate();
  };

  const handleFaceIDSuccess = (data) => {
    setFaceId(data.facialId);
    setShowFaceID(false);
    Alert.alert("Success", "Face enrollment completed successfully!", [
      {
        text: "Continue",
        onPress: handleFacePayment,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingRow}>
            <Text style={styles.logoText}>
              <Text style={styles.logoBold}>F</Text>
              ace<Text style={styles.logoBold}>B</Text>ouk
            </Text>
            <TouchableOpacity
              style={styles.profileIcon}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="person" size={20} color="#A78BFA" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.contentContainer}>
            {/* Amount input Card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Enter Amount</Text>
              <Animated.View
                style={[
                  styles.balanceRow,
                  { transform: [{ scale: amountScale }] },
                ]}
              >
                <Text
                  style={[
                    styles.amountDisplay,
                    !amount && styles.amountDisplayPlaceholder,
                  ]}
                >
                  {amount || "0.00"}
                </Text>
                <Text style={styles.currencyText}>KD</Text>
              </Animated.View>

              {/* Keypad Component */}
              <Keypad
                onNumberPress={handleNumberPress}
                onDecimalPress={handleDecimalPress}
                onDeletePress={handleDeletePress}
                onClearPress={handleClearPress}
              />

              {/* The Two Buttons */}
              <View style={styles.balanceActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.FaceIDScanButton]}
                  activeOpacity={0.8}
                  onPress={handleFaceIDPress}
                >
                  <View style={styles.actionButtonContent}>
                    <Ionicons name="scan-outline" size={24} color="#E8F0FE" />
                    <Text style={styles.actionButtonText}>FaceID Scan</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.QRCodeScanButton]}
                  activeOpacity={0.8}
                >
                  <View style={styles.actionButtonContent}>
                    <Ionicons
                      name="qr-code-outline"
                      size={24}
                      color="#E8F0FE"
                    />
                    <Text style={styles.actionButtonText}>QR Code Scan</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <FaceID
        isVisible={showFaceID}
        onClose={() => setShowFaceID(false)}
        onSuccess={handleFaceIDSuccess}
        userData={{ email, username, fullName }}
        mode="authenticate"
        setFaceId={setFaceId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  container: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: Platform.OS === "ios" ? 12 : 16,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: "flex-start",
  },
  contentContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingTop: 12,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  logoText: {
    color: "#E8F0FE",
    fontSize: 24,
    fontWeight: "500",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif",
  },
  logoBold: {
    color: "#E8F0FE",
    fontWeight: "700",
  },
  profileIcon: {
    padding: 8,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderRadius: 20,
    width: 40,
    height: 40,
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
    alignItems: "center",
    justifyContent: "center",
  },
  balanceCard: {
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 24,
    padding: 20,
    marginTop: 0,
    marginBottom: 12,
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  balanceLabel: {
    color: "#A78BFA",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    opacity: 0.9,
    marginBottom: 12,
    textAlign: "center",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(167, 139, 250, 0.05)",
  },
  amountDisplay: {
    color: "#E8F0FE",
    fontSize: 42,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    letterSpacing: 1,
    flex: 1,
  },
  amountDisplayPlaceholder: {
    opacity: 0.5,
  },
  currencyText: {
    color: "#E8F0FE",
    fontSize: 32,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    marginLeft: 12,
    opacity: 0.9,
  },
  balanceActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 0,
  },
  actionButtonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  FaceIDScanButton: {
    backgroundColor: "#A78BFA",
  },
  QRCodeScanButton: {
    backgroundColor: "#0D9488",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif",
    letterSpacing: 0.3,
  },
});

export default Dashboard;
