// screens/AddMSAN.jsx

import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, Alert, ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Input from "../components/Input";
import Button from "../components/Button";
import RadioGroup from "../components/RadioGroup";
import { addMSAN, updateMSAN } from "../services/api";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function AddMSAN() {

  const router = useRouter();
  const params = useLocalSearchParams();

  /* ================= Decode Record ================= */

  const record = useMemo(() => {
    try {
      return params?.record
        ? JSON.parse(decodeURIComponent(params.record))
        : null;
    } catch (err) {
      console.log("Record decode error", err);
      return null;
    }
  }, [params?.record]);

  /* ================= States ================= */

  const [msanType, setMsanType] = useState("");
  const [vendor, setVendor] = useState("");
  const [name, setName] = useState("");
  const [rectifierType, setRectifierType] = useState("");
  const [faultyModuleCount, setFaultyModuleCount] = useState("");
  const [workingModuleCount, setWorkingModuleCount] = useState("");

  const [batteries, setBatteries] = useState([
    { type: "", voltage: "", health: "" }
  ]);

  const [isUpdate, setIsUpdate] = useState(false);

  /* ================= Prefill ================= */

  useEffect(() => {

    if (record) {

      setMsanType(record.msanType || "");
      setVendor(record.vendor || "");
      setName(record.msanName || "");
      setRectifierType(record.rectifierType || "");

      setFaultyModuleCount(
        record.faultyRectifierModules?.toString() || ""
      );

      setWorkingModuleCount(
        record.workingRectifierModules?.toString() || ""
      );

      setBatteries(
        record.battery?.length
          ? record.battery
          : [{ type: "", voltage: "", health: "" }]
      );

      setIsUpdate(true);

    }

  }, [record]);

  /* ================= Battery Update ================= */

  const handleBatteryChange = (key, value) => {

    setBatteries((prev) => {

      const copy = [...prev];
      copy[0] = { ...copy[0], [key]: value };
      return copy;

    });

  };

  /* ================= Submit ================= */

  const handleSubmit = async () => {

    if (!msanType || !vendor || !name) {
      return Alert.alert("Error", "Please fill required fields");
    }

    if (!batteries[0].type || !batteries[0].voltage || !batteries[0].health) {
      return Alert.alert("Error", "Complete battery details");
    }

    const payload = {

      msanType,
      vendor,
      msanName: name,
      rectifierType,

      faultyRectifierModules: Number(faultyModuleCount || 0),

      workingRectifierModules: Number(workingModuleCount || 0),

      battery: [
        {
          type: batteries[0].type,
          voltage: Number(batteries[0].voltage),
          health: batteries[0].health
        }
      ]

    };

    try {

      let res;

      if (isUpdate && record?._id) {

        res = await updateMSAN(record._id, payload);

      } else {

        res = await addMSAN(payload);

      }

      if (res.data.success) {

        Alert.alert(
          "Success",
          isUpdate ? "MSAN updated!" : "MSAN saved!"
        );

        router.push("/tabs/view-data");

      }

    } catch (err) {

      console.log("MSAN error", err.response?.data || err.message);

      Alert.alert("Error", "Server error");

    }

  };

  /* ================= UI ================= */

  return (

    <LinearGradient
      colors={["#020617", "#0A1A44", "#051E54"]}
      style={{ flex: 1 }}
    >

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>
          {isUpdate ? "Update MSAN" : "Add MSAN"}
        </Text>

        <ImageBackground
          source={require("../../assets/images/slt3.jpg")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >

          <RadioGroup
            title="MSAN Type"
            options={["Indoor", "Outdoor"]}
            selected={msanType}
            onChange={setMsanType}
          />

          <RadioGroup
            title="Vendor"
            options={["Huawei", "ZTE", "Nokia"]}
            selected={vendor}
            onChange={setVendor}
          />

          <Input
            placeholder="MSAN Name"
            value={name}
            onChangeText={setName}
          />

          <Input
            placeholder="Rectifier Type"
            value={rectifierType}
            onChangeText={setRectifierType}
          />

          <Input
            placeholder="Faulty Modules"
            value={faultyModuleCount}
            onChangeText={setFaultyModuleCount}
            keyboardType="numeric"
          />

          <Input
            placeholder="Working Modules"
            value={workingModuleCount}
            onChangeText={setWorkingModuleCount}
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Battery Info</Text>

          <RadioGroup
            title="Battery Type"
            options={["VRLA", "LEAD ACID", "LFP"]}
            selected={batteries[0]?.type}
            onChange={(v) => handleBatteryChange("type", v)}
          />

          <RadioGroup
            title="Voltage"
            options={["12", "48"]}
            selected={batteries[0]?.voltage?.toString()}
            onChange={(v) => handleBatteryChange("voltage", v)}
          />

          <RadioGroup
            title="Health"
            options={["Good", "Weak"]}
            selected={batteries[0]?.health}
            onChange={(v) => handleBatteryChange("health", v)}
          />

          <Button
            title={isUpdate ? "Update" : "Save"}
            onPress={handleSubmit}
          />

        </ImageBackground>

      </ScrollView>

    </LinearGradient>

  );

}

/* ================= Styles ================= */

const styles = StyleSheet.create({

  container: {
    padding: 22
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10
  },

  card: {
    padding: 18,
    borderRadius: 20,
    overflow: "hidden"
  },

  cardImage: {
    opacity: 0.3
  },

  sectionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10
  }

});