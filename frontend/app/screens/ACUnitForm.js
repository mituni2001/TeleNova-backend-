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
import { addACUnit, updateACUnit } from "../services/api";
import { useLocalSearchParams } from "expo-router";

/* ================= AC CARD ================= */

function ACUnitCard({ title, data, onChange }) {

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

      <RadioGroup
        title="Type"
        options={["Wall Mount", "Ceiling Cassette", "Floor Mount"]}
        selected={data.type}
        onChange={(v) => onChange("type", v)}
      />

      <RadioGroup
        title="Inverter"
        options={["Yes", "No"]}
        selected={data.inverter}
        onChange={(v) => onChange("inverter", v)}
      />

      <Input
        placeholder="BTV/N"
        value={data.btv}
        onChangeText={(v) => onChange("btv", v)}
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

export default function ACUnitForm() {

  const params = useLocalSearchParams();

  let record = null;

  try {
    if (params?.record) {
      record = JSON.parse(decodeURIComponent(params.record));
    }
  } catch (err) {
    console.log("Record parse error", err);
  }

  const emptyUnit = {
    type: "",
    inverter: "",
    btv: "",
    health: "",
  };

  const [units, setUnits] = useState([
    { ...emptyUnit },
    { ...emptyUnit },
    { ...emptyUnit },
  ]);

  /* 🔹 Load old AC Units */

  useEffect(() => {

    if (record && record.acUnits && record.acUnits.length > 0) {

      const filledUnits = record.acUnits.map((unit) => ({
        ...emptyUnit,
        ...unit
      }));

      setUnits(filledUnits);

    }

  }, []);

  /* 🔹 Update state */

  const updateUnit = (index, key, value) => {

    const copy = [...units];
    copy[index][key] = value;
    setUnits(copy);

  };

  /* 🔹 Submit */

  const handleSubmit = async () => {

    const invalid = units.some(
      (u) => !u.type || !u.inverter || !u.health
    );

    if (invalid) {
      Alert.alert("Error", "Please complete all AC unit details");
      return;
    }

    try {

      if (record?._id) {

        await updateACUnit(record._id, {
          acUnits: units
        });

        Alert.alert("Success", "AC Units updated successfully");

      } else {

        await addACUnit({
          acUnits: units
        });

        Alert.alert("Success", "AC Units added successfully");

        setUnits([
          { ...emptyUnit },
          { ...emptyUnit },
          { ...emptyUnit }
        ]);

      }

    } catch (err) {

      console.log(err);

      Alert.alert(
        "Error",
        err.message || "Something went wrong"
      );

    }

  };

  return (

    <LinearGradient
      colors={["#020617", "#0A1A44", "#051E54"]}
      style={{ flex: 1 }}
    >

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>
          {record?._id ? "Update AC Units" : "Add AC Units"}
        </Text>

        <View style={styles.list}>

          {units.map((unit, i) => (

            <ACUnitCard
              key={i}
              title={`AC Unit ${i + 1}`}
              data={unit}
              onChange={(k, v) => updateUnit(i, k, v)}
            />

          ))}

        </View>

        <Button
          title={record?._id ? "Update" : "Submit"}
          onPress={handleSubmit}
        />

      </ScrollView>

    </LinearGradient>

  );

}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  container: {
    padding: 22,
    paddingBottom: 80
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#EAF2FF",
    marginBottom: 20
  },

  list: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16
  },

  section: {
    fontSize: 16,
    fontWeight: "700",
    color: "#93C5FD",
    marginBottom: 10
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
    minHeight: 280,
    overflow: "hidden",
  },

  cardImage: {
    borderRadius: 20,
    opacity: 0.35
  }

});