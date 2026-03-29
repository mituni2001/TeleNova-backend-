import React, { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Input from "../components/Input";
import Button from "../components/Button";
import { addRSU, updateRSU } from "../services/api"; // RSU backend
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ACLoadForm() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ Safe parse RSU record
  const record = useMemo(() => {
    try {
      return params?.record
        ? JSON.parse(decodeURIComponent(params.record))
        : null;
    } catch {
      return null;
    }
  }, [params?.record]);

  // ✅ Form states
  const [phase1, setPhase1] = useState("");
  const [phase2, setPhase2] = useState("");
  const [phase3, setPhase3] = useState("");
  const [neutral, setNeutral] = useState("");

  // ✅ Prefill previous AC Load if exists
  useEffect(() => {
    if (!record?.acLoad) return;

    setPhase1(String(record.acLoad.phase1 || ""));
    setPhase2(String(record.acLoad.phase2 || ""));
    setPhase3(String(record.acLoad.phase3 || ""));
    setNeutral(String(record.acLoad.neutral || ""));
  }, [record]);

  // ✅ Submit handler
  const handleSubmit = async () => {
    if (!phase1 && !phase2 && !phase3) {
      Alert.alert("Error", "Enter at least one phase load");
      return;
    }

    const payload = {
      rsuName: record?.rsuName || "RSU001", // existing RSU name or default
      acLoad: {
        phase1: Number(phase1 || 0),
        phase2: Number(phase2 || 0),
        phase3: Number(phase3 || 0),
        neutral: Number(neutral || 0),
      },
    };

    try {
      if (record?._id) {
        // Update existing RSU record
        await updateRSU(record._id, payload);
        Alert.alert("Success", "AC Load Updated");
      } else {
        // First-time save
        await addRSU(payload);
        Alert.alert("Success", "AC Load Saved");
      }

      router.back(); // Go back to previous screen
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Save/Update failed");
    }
  };

  return (
    <LinearGradient
      colors={["#020617", "#0A1A44", "#051E54"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {record?._id ? "Update AC Load" : "Add AC Load"}
        </Text>

        <ImageBackground
          source={require("../../assets/images/slt3.jpg")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <Input
            placeholder="Phase 1"
            value={phase1}
            onChangeText={setPhase1}
            keyboardType="numeric"
          />
          <Input
            placeholder="Phase 2"
            value={phase2}
            onChangeText={setPhase2}
            keyboardType="numeric"
          />
          <Input
            placeholder="Phase 3"
            value={phase3}
            onChangeText={setPhase3}
            keyboardType="numeric"
          />
          <Input
            placeholder="Neutral"
            value={neutral}
            onChangeText={setNeutral}
            keyboardType="numeric"
          />

          <Button
            title={record?._id ? "Update" : "Save"}
            onPress={handleSubmit}
          />
        </ImageBackground>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 22 },
  title: { fontSize: 26, fontWeight: "800", color: "#EAF2FF", marginBottom: 20 },
  card: { borderRadius: 20, padding: 18, gap: 14, overflow: "hidden" },
  cardImage: { borderRadius: 20, opacity: 0.35 },
});