import * as SecureStore from "expo-secure-store";
const getToken = async () => {
  const token = await SecureStore.getItemAsync("token");

  return token;
};

const deleteToken = async () => {
  await SecureStore.deleteItemAsync("token");
};

const saveToken = async (token) => {
  await SecureStore.setItemAsync("token", token);
};

export { getToken, deleteToken, saveToken };
