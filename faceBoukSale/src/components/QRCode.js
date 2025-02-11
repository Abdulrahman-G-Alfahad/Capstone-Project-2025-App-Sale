import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

const QRCode = ({ isVisible, onClose, onSuccess }) => {
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ data }) => {
    try {
      if (scanned || !data) return;
      setScanned(true);

      console.log("Raw QR Data:", data);
      const qrData = JSON.parse(data);
      console.log("Parsed QR Data:", qrData);

      // Validate required fields
      if (
        !qrData.type ||
        !qrData.amount ||
        !qrData.userId ||
        !qrData.timestamp
      ) {
        throw new Error("Missing required QR code data");
      }

      // Validate amount format
      const amount = parseFloat(qrData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount format");
      }

      // Validate timestamp
      const timestamp = new Date(qrData.timestamp);
      if (isNaN(timestamp.getTime())) {
        throw new Error("Invalid timestamp");
      }

      // Validate type
      if (!["PAYMENT", "transfer", "request"].includes(qrData.type)) {
        throw new Error("Invalid transaction type");
      }

      onSuccess(qrData);
      onClose();
    } catch (error) {
      console.error("QR Scan Error:", error);
      Alert.alert(
        "Invalid QR Code",
        `Please scan a valid payment QR code. ${error.message}`,
        [
          { text: "Try Again", onPress: () => setScanned(false) },
          { text: "Cancel", style: "cancel", onPress: onClose },
        ]
      );
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Scan QR Code</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#9991b1" />
            </TouchableOpacity>
          </View>

          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
              <View style={styles.overlay}>
                <View style={styles.scanArea} />
              </View>
              <Text style={styles.scanText}>
                Position QR code within the frame
              </Text>
            </CameraView>
          </View>

          {scanned && (
            <TouchableOpacity
              style={styles.rescanButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.rescanButtonText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
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
  modalContent: {
    flex: 1,
    width: "100%",
    backgroundColor: "#141E30",
    borderRadius: 24,
    overflow: "hidden",
    margin: 16,
    marginTop: 60,
    marginBottom: 30,
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.2)",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E8F0FE",
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 8,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "#A78BFA",
    backgroundColor: "transparent",
    borderRadius: 16,
  },
  scanText: {
    position: "absolute",
    bottom: 100,
    color: "#E8F0FE",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  rescanButton: {
    backgroundColor: "#A78BFA",
    padding: 16,
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  rescanButtonText: {
    color: "#E8F0FE",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default QRCode;
