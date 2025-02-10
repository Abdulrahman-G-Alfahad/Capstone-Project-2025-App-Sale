import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Screen/Auth/Login";
import Profile from "../Screen/Auth/Profile";
import Dashboard from "../Screen/Home/Dashoard";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default HomeStack;
