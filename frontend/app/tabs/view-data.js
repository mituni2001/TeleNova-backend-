// ViewData.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  ImageBackground,
  StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Buffer } from "buffer";

global.Buffer = Buffer;

export default function ViewData() {
  const router = useRouter();
  const SERVER_URL = "https://telenova-backend.onrender.com";

  const [msanData, setMsanData] = useState([]);
  const [rsuData, setRsuData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const msanRes = await axios.get(`${SERVER_URL}/api/msan`);
      setMsanData(msanRes.data);

      const rsuRes = await axios.get(`${SERVER_URL}/api/rsu`);
      setRsuData(rsuRes.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert("Error", "Failed to load data");
    }
  };

  const handleRecordClick = (item, type) => {
    if (type === "rsu") {
      router.push({
        pathname: "/screens/RSUMenu",
        params: { record: JSON.stringify(item) },
      });
    } else {
      router.push({
        pathname: "/screens/AddMSAN",
        params: { record: JSON.stringify(item) },
      });
    }
  };

  const deleteRecord = async (id, type) => {
    const endpoint = type === "msan" ? "msan" : "rsu";
    Alert.alert("Confirm", `Delete this ${type.toUpperCase()} record?`, [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(`${SERVER_URL}/api/${endpoint}/${id}`);
            Alert.alert("Record Deleted");
            loadData();
          } catch (err) {
            console.log(err.response?.data || err.message);
            Alert.alert("Error", "Delete failed");
          }
        }
      }
    ]);
  };

  const resetAllData = async () => {
    Alert.alert("ADMIN RESET", "Delete ALL MSAN and RSU records?", [
      { text: "Cancel" },
      {
        text: "DELETE ALL",
        onPress: async () => {
          try {
            await axios.delete(`${SERVER_URL}/api/msan/delete/all`);
            await axios.delete(`${SERVER_URL}/api/rsu/delete/all`);
            Alert.alert("All records deleted");
            loadData();
          } catch (err) {
            console.log(err.response?.data || err.message);
            Alert.alert("Reset failed");
          }
        }
      }
    ]);
  };

  const downloadExcel = async (endpoint, fileName) => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/export/${endpoint}`, {
        responseType: "arraybuffer",
      });

      const base64 = Buffer.from(res.data).toString("base64");
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri);

      Alert.alert("SUCCESS", `${fileName} exported!`);
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert("ERROR", err.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/ho2.jpeg")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* EXPORT BUTTONS */}
        <TouchableOpacity onPress={() => downloadExcel("msan", "MSAN_DATA.xlsx")}>
          <LinearGradient colors={["#00FF7F", "#1E90FF"]} style={styles.button}>
            <Text style={styles.buttonText}>Export MSAN Excel</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => downloadExcel("rsu", "RSU_MULTI_SHEET.xlsx")}>
          <LinearGradient colors={["#00FF7F", "#1E90FF"]} style={styles.button}>
            <Text style={styles.buttonText}>Export RSU Excel</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* ADMIN RESET */}
        <TouchableOpacity onPress={resetAllData}>
          <LinearGradient colors={["#ff0000", "#8B0000"]} style={styles.resetBtn}>
            <Text style={styles.buttonText}>ADMIN RESET (Delete All)</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* ===== MSAN HEADER ===== */}
        <LinearGradient colors={["#FFD700", "#90EE90", "#87CEFA"]} style={styles.headerGradient}>
          <Text style={styles.headerText}>MSAN Records</Text>
        </LinearGradient>

        {msanData.map((item) => (
          <View key={item._id} style={styles.card}>
            <TouchableOpacity onPress={() => handleRecordClick(item, "msan")}>

              <Text style={styles.text}>
                <Text style={styles.label}>MSAN: </Text>
                {item.msanName}
              </Text>

              <Text style={styles.text}>
                <Text style={styles.label}>Vendor: </Text>
                {item.vendor}
              </Text>

              <Text style={styles.text}>
                <Text style={styles.label}>Type: </Text>
                {item.msanType}
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteRecord(item._id, "msan")}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* ===== RSU HEADER ===== */}
        <LinearGradient colors={["#FFD700", "#90EE90", "#87CEFA"]} style={styles.headerGradient}>
          <Text style={styles.headerText}>RSU Records</Text>
        </LinearGradient>

        {rsuData.map((item) => (
          <View key={item._id} style={styles.card}>
            <TouchableOpacity onPress={() => handleRecordClick(item, "rsu")}>

              <Text style={styles.text}>
                <Text style={styles.label}>RSU: </Text>
                {item.rsuName}
              </Text>

              <Text style={styles.text}>
                <Text style={styles.label}>Primary Rectifier: </Text>
                {item.primaryRectifier?.type || "-"}
              </Text>

              <Text style={styles.text}>
                <Text style={styles.label}>Secondary Rectifier: </Text>
                {item.secondaryRectifier?.type || "-"}
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteRecord(item._id, "rsu")}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  container: { padding: 20, gap: 10 },

  card: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 10
  },

  text: {
    color: "#fff",
    fontSize: 16
  },

  label: {
    color: "#90EE90", // Light green
    fontWeight: "bold"
  },

  deleteBtn: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center"
  },

  deleteText: {
    color: "#fff",
    fontWeight: "bold"
  },

  button: {
    width: 250,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10
  },

  resetBtn: {
    width: 250,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10
  },

  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18
  },

  headerGradient: {
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 5,
    alignItems: "center"
  },

  headerText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20
  }
});