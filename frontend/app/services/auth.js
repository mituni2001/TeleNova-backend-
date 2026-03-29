import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

// named exports
export const loginUser = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  if (!res.data?.token) throw new Error("Login Failed");
  await AsyncStorage.setItem("token", res.data.token);
  return res.data;
};

export const registerUser = async ({ email, password }) => {
  const res = await api.post("/auth/register", { email, password });
  if (!res.data?.token) throw new Error("Registration Failed");
  await AsyncStorage.setItem("token", res.data.token);
  return res.data;
};

export const getToken = async () => await AsyncStorage.getItem("token");

// **add this default export at the bottom**
export default {
  loginUser,
  registerUser,
  getToken
};




