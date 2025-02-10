import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Profile = () => {
  const [businessName, setBusinessName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchLocation, setBranchLocation] = useState("");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          // Add your logout logic here
          console.log("User logged out");
        },
        style: "destructive",
      },
    ]);
  };

  const renderInput = (label, value, icon) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={24} color="#6B7280" />
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value || "Not provided"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Branch Profile</Text>
        </View>

        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Profile Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.card}>
              {renderInput("Business Name", businessName, "business-outline")}
              {renderInput("Branch Name", branchName, "git-branch-outline")}
              {renderInput(
                "Branch Location",
                branchLocation,
                "location-outline"
              )}
            </View>
          </ScrollView>

          {/* Footer with Logout Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.1)",
    height: Platform.OS === "ios" ? 60 : 70,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E8F0FE",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    color: "#E8F0FE",
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 2,
    minHeight: 56,
  },
  inputText: {
    color: "#E8F0FE",
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
    letterSpacing: 0.5,
  },
  placeholderText: {
    color: "#8e8ba7",
    fontStyle: "italic",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(167, 139, 250, 0.1)",
    backgroundColor: "#141E30",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A78BFA",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

export default Profile;
