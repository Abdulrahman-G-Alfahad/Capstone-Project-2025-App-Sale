import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Login from "./src/Screen/Auth/Login";
// import Dashboard from "./src/Screen/Home/Dashoard";
// import Profile from "./src/Screen/Auth/Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { getToken, deleteToken } from "./src/api/storage";
import UserContext from "./src/context/UserContext";
import { NavigationContainer } from "@react-navigation/native";
import HomeStack from "./src/navigation/Navigation";

export default function App() {
  const queryClient = new QueryClient();
  const [user, setUser] = useState(false);

  const checkToken = async () => {
    const token = await getToken();
    if (token) {
      setUser(true);
    } else {
      console.log("No token found");
    }
  };

  useEffect(() => {
    checkToken();
    // deleteToken();
  }, []);

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ user, setUser }}>
          <View style={styles.container}>
            <StatusBar style="auto" />
            {user ? <HomeStack /> : <Login />}
          </View>
        </UserContext.Provider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141E30",
  },
});
