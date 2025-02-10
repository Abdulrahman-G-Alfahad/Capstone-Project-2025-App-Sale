import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

const Login = () => {
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Login</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Sign in to Continue</Text>

        <View style={styles.form}>
          <View
            style={[
              styles.inputContainer,
              isFocused.username && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="person-circle-outline"
              size={24}
              color="rgba(142, 139, 167, 0.6)"
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(142, 139, 167, 0.6)"
              autoCapitalize="none"
              onFocus={() =>
                setIsFocused((prev) => ({ ...prev, username: true }))
              }
              onBlur={() =>
                setIsFocused((prev) => ({ ...prev, username: false }))
              }
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              isFocused.password && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="rgba(142, 139, 167, 0.6)"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(142, 139, 167, 0.6)"
              secureTextEntry={true}
              onFocus={() =>
                setIsFocused((prev) => ({ ...prev, password: true }))
              }
              onBlur={() =>
                setIsFocused((prev) => ({ ...prev, password: false }))
              }
            />
            <TouchableOpacity style={styles.eyeIcon}>
              <Ionicons
                name="eye-off-outline"
                size={24}
                color="rgba(142, 139, 167, 0.6)"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.15)",
    alignItems: "center",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#E8F0FE",
    letterSpacing: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#E8F0FE",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 17,
    color: "#A78BFA",
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  form: {
    width: "100%",
    flex: 1,
    justifyContent: "space-between",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(142, 139, 167, 0.08)",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 65,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.1)",
    transition: "all 0.3s",
  },
  inputContainerFocused: {
    backgroundColor: "rgba(142, 139, 167, 0.12)",
    borderColor: "rgba(167, 139, 250, 0.3)",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    color: "#E8F0FE",
    paddingVertical: 16,
    paddingHorizontal: 0,
    marginLeft: 4,
    fontSize: 16,
    letterSpacing: 0.3,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  eyeIcon: {
    padding: 8,
    marginLeft: -4,
  },
  loginButton: {
    backgroundColor: "#A78BFA",
    padding: 20,
    borderRadius: 16,
    marginTop: "auto",
    marginBottom: 32,
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.3)",
  },
  buttonText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    paddingBottom: 20,
  },
  registerText: {
    color: "#A78BFA",
    fontSize: 15,
    fontWeight: "500",
  },
  registerHighlight: {
    color: "#E8F0FE",
    fontWeight: "700",
  },
  faceIdButton: {
    backgroundColor: "#0D9488",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  faceIdButtonText: {
    color: "#E8F0FE",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default Login;
