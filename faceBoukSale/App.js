import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Login from "./src/Screen/Auth/Login";
import Dashboard from "./src/Screen/Home/Dashoard";
import Profile from "./src/Screen/Auth/Profile";
export default function App() {
  return (
    <View style={styles.container}>
      <Login />
      {/* <Dashboard /> */}
      {/* <Profile /> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
