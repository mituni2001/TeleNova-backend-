// services/api.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Buffer } from "buffer";

// ------------------ AXIOS INSTANCE ------------------
const api = axios.create({
  baseURL: "https://telenova-backend.onrender.com/api",
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// ================== MSAN ==================
export const addMSAN = (data) => api.post("/msan", data);
export const getMSAN = () => api.get("/msan");
export const updateMSAN = (id, data) => api.put(`/msan/${id}`, data);


// ================== RSU ==================
export const addRSU = (data) => api.post("/rsu", data);
export const getRSU = () => api.get("/rsu");
export const updateRSU = (id, data) => api.put(`/rsu/${id}`, data);


// ================== BATTERY BANK ==================
export const addBatteryBank = (data) => api.post("/battery-bank", data);
export const getBatteryBanks = () => api.get("/battery-bank");
export const updateBatteryBank = (id, data) =>
  api.put(`/battery-bank/${id}`, data);


// ================== AC UNIT ==================
export const addACUnit = (data) => api.post("/ac-unit", data);
export const getACUnits = () => api.get("/ac-unit");
export const updateACUnit = (id, data) =>
  api.put(`/ac-unit/${id}`, data);


// ================== GENERATOR ==================
export const addGenerator = (data) => api.post("/generator", data);
export const getGenerators = () => api.get("/generator");
export const updateGenerator = (id, data) =>
  api.put(`/generator/${id}`, data);

// ================== AC LOAD ==================
export const addACLoad = (data) => api.post("/ac-load", data);
export const getACLoads = () => api.get("/ac-load");
export const updateACLoad = (id, data) =>
  api.put(`/ac-load/${id}`, data);


// ================== EXCEL EXPORT ==================
export const exportExcel = async (endpoint, data, fileName) => {
  try {
    const res = await api.post(`/export/${endpoint}`, data, {
      responseType: "arraybuffer",
    });

    const base64 = Buffer.from(res.data, "binary").toString("base64");

    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri);

    console.log(`${fileName} exported successfully`);
  } catch (err) {
    console.log("Export failed:", err.message);
  }
};

export default api;