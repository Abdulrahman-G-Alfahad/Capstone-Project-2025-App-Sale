import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import UserContext from "../../context/UserContext";
import { login } from "../../api/auth";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);

  const userInfo = {
    username: username,
    password: password,
  };

  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => login(userInfo),
    onSuccess: (data) => {
      console.log(data);
      console.log(data.token);
      setUser(true);
      const decodedToken = jwtDecode(data.token);
      console.log(decodedToken);
    },
    onError: () => {
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again"
      );
    },
  });

  const handleLogin = () => {
    console.log("Login attempt with:", username, password);
    mutate();
  };

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
          <View style={styles.inputContainer}>
            <Ionicons name="person-circle-outline" size={24} color="#8e8ba7" />
            <TextInput
              style={styles.input}
              placeholder="User Name"
              placeholderTextColor="#8e8ba7"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#8e8ba7" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8e8ba7"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#8e8ba7"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
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
    borderBottomColor: "rgba(167, 139, 250, 0.2)",
    alignItems: "center",
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#E8F0FE",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#E8F0FE",
    textAlign: "center",
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#A78BFA",
    marginBottom: 48,
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(142, 139, 167, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 65,
  },
  input: {
    flex: 1,
    color: "#E8F0FE",
    paddingVertical: 16,
    marginLeft: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: "#A78BFA",
    padding: 20,
    borderRadius: 16,
    marginTop: 40,
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  buttonText: {
    color: "#E8F0FE",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
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
