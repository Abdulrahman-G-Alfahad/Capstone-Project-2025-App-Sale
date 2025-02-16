import axios from "axios";
import { getToken } from "./storage";

const transactionApi = axios.create({
  // baseURL: "http://192.168.68.129:8080",
  baseURL: "http://192.168.2.132:8082",
  // baseURL: "http://192.168.2.132:8080",
});
transactionApi.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default transactionApi;
