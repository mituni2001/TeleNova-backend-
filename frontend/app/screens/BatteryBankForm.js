import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  View,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Input from "../components/Input";
import Button from "../components/Button";
import RadioGroup from "../components/RadioGroup";
import { addBatteryBank, updateBatteryBank } from "../services/api";
import { useLocalSearchParams } from "expo-router";

/* ================= BATTERY CARD ================= */

function BatterySection({ title, data, onChange }) {
  const getHealthColor = (health) => {
    if (health === "Good") return "#22C55E";
    if (health === "Weak") return "#FACC15";
    return "#CBD5F5";
  };

  return (
    <ImageBackground
      source={require("../../assets/images/slt3.jpg")}
      style={[styles.card, { borderColor: getHealthColor(data.health) }]}
      imageStyle={styles.cardImage}
    >
      <Text style={styles.section}>{title}</Text>

      <Input
        placeholder="Brand Name"
        value={data.brand}
        onChangeText={(v) => onChange("brand", v)}
      />

      <RadioGroup
        title="Battery Type"
        options={["VRLA", "LEAD ACID", "LFP"]}
        selected={data.batteryType}
        onChange={(v) => onChange("batteryType", v)}
      />

      <RadioGroup
        title="Battery Voltage"
        options={["12V", "48V", "2V"]}
        selected={data.voltage}
        onChange={(v) => onChange("voltage", v)}
      />

      <Input
        placeholder="Capacity (Ah)"
        keyboardType="numeric"
        value={data.ah}
        onChangeText={(v) => onChange("ah", v)}
      />

      <Input
        placeholder="Connected Rectifier"
        value={data.connectedRectifier}
        onChangeText={(v) => onChange("connectedRectifier", v)}
      />

      <RadioGroup
        title="Health"
        options={["Good", "Weak"]}
        selected={data.health}
        onChange={(v) => onChange("health", v)}
      />
    </ImageBackground>
  );
}

/* ================= MAIN SCREEN ================= */

export default function BatteryBankForm() {
  const params = useLocalSearchParams();

  let record = null;
  try {
    if (params?.record) {
      record = JSON.parse(decodeURIComponent(params.record));
    }
  } catch (err) {
    console.log("Record parse error", err);
  }

  const emptyBank = {
    brand: "",
    batteryType: "",
    voltage: "",
    ah: "",
    connectedRectifier: "",
    health: "",
  };

  const [banks, setBanks] = useState([
    { ...emptyBank },
    { ...emptyBank },
    { ...emptyBank },
    { ...emptyBank },
  ]);

  /* ================= LOAD EXISTING RECORD ================= */

  useEffect(() => {
    if (record && record.batteryBanks && record.batteryBanks.length > 0) {
      const filledBanks = record.batteryBanks.map((b) => ({ ...emptyBank, ...b }));
      // Fill up to 4 banks if less than 4
      while (filledBanks.length < 4) filledBanks.push({ ...emptyBank });
      setBanks(filledBanks);
    }
  }, [record]);

  /* ================= UPDATE BANK STATE ================= */

  const updateBank = (index, key, value) => {
    const copy = [...banks];
    copy[index][key] = value;
    setBanks(copy);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const invalid = banks.some(
      (b) => !b.brand || !b.batteryType || !b.voltage || !b.health
    );
    if (invalid) {
      Alert.alert("Error", "Please complete all battery bank details");
      return;
    }

    try {
      if (record?._id) {
        await updateBatteryBank(record._id, { batteryBanks: banks });
        Alert.alert("Success", "Battery Banks updated successfully");
      } else {
        await addBatteryBank({ auditDate: new Date(), batteryBanks: banks });
        Alert.alert("Success", "Battery Banks added successfully");
        setBanks([
          { ...emptyBank },
          { ...emptyBank },
          { ...emptyBank },
          { ...emptyBank },
        ]);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  /* ================= UI ================= */

  return (
    <LinearGradient colors={["#020617", "#0A1A44", "#051E54"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {record?._id ? "Update Battery Banks" : "Add Battery Banks"}
        </Text>

        <View style={styles.list}>
          {banks.map((bank, i) => (
            <BatterySection
              key={i}
              title={`Battery Bank ${i + 1}`}
              data={bank}
              onChange={(k, v) => updateBank(i, k, v)}
            />
          ))}
        </View>

        <Button title={record?._id ? "Update" : "Submit"} onPress={handleSubmit} />
      </ScrollView>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 22,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#EAF2FF",
    marginBottom: 20,
  },
  list: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  section: {
    fontSize: 16,
    fontWeight: "700",
    color: "#93C5FD",
    marginBottom: 10,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 2,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    width: "100%",
    overflow: "hidden",
  },
  cardImage: {
    borderRadius: 20,
    opacity: 0.35,
  },
});