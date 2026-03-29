import React, { useState, useEffect } from "react";
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
import RadioGroup from "../components/RadioGroup";
import { addGenerator, updateGenerator } from "../services/api";
import { useLocalSearchParams } from "expo-router";

export default function GeneratorForm() {

  const params = useLocalSearchParams();

  let record = null;

  try {
    if (params?.record) {
      record = JSON.parse(decodeURIComponent(params.record));
    }
  } catch (err) {
    console.log("Record parse error", err);
  }

  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [brand, setBrand] = useState("");
  const [ats, setAts] = useState("");
  const [available, setAvailable] = useState("");

  /* 🔹 Load existing generator data */

  useEffect(() => {

    if (record && record.generator) {

      setModel(record.generator.model || "");
      setCapacity(record.generator.capacity || "");
      setBrand(record.generator.brand || "");
      setAts(record.generator.ats ? "Yes" : "No");
      setAvailable(record.generator.available ? "Yes" : "No");

    }

  }, []);

  /* 🔹 Submit */

  const handleSubmit = async () => {

    if (!model || !capacity || !ats || !available) {
      Alert.alert("Error", "Please complete all required fields");
      return;
    }

    const atsBool = ats === "Yes";
    const availableBool = available === "Yes";

    try {

      if (record?._id) {

        await updateGenerator(record._id, {
          generator: {
            model,
            capacity,
            brand,
            ats: atsBool,
            available: availableBool
          }
        });

        Alert.alert("Success", "Generator updated successfully");

      } else {

        await addGenerator({
          generator: {
            model,
            capacity,
            brand,
            ats: atsBool,
            available: availableBool
          }
        });

        Alert.alert("Success", "Generator added successfully");

        setModel("");
        setCapacity("");
        setBrand("");
        setAts("");
        setAvailable("");

      }

    } catch (err) {

      console.log(err);

      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Something went wrong"
      );

    }

  };

  return (

    <LinearGradient
      colors={["#020617", "#0A1A44", "#051E54"]}
      style={{ flex: 1 }}
    >

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.title}>
          {record?._id ? "Update Generator" : "Add Generator"}
        </Text>

        <ImageBackground
          source={require("../../assets/images/slt3.jpg")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >

          <Input
            placeholder="Model"
            value={model}
            onChangeText={setModel}
          />

          <Input
            placeholder="Capacity"
            value={capacity}
            onChangeText={setCapacity}
          />

          <Input
            placeholder="Brand"
            value={brand}
            onChangeText={setBrand}
          />

          <RadioGroup
            title="ATS"
            options={["Yes", "No"]}
            selected={ats}
            onChange={setAts}
          />

          <RadioGroup
            title="Available"
            options={["Yes", "No"]}
            selected={available}
            onChange={setAvailable}
          />

          <Button
            title={record?._id ? "Update" : "Submit"}
            onPress={handleSubmit}
          />

        </ImageBackground>

      </ScrollView>

    </LinearGradient>

  );

}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  container: {
    padding: 22,
    paddingBottom: 40
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#EAF2FF",
    marginBottom: 20,
    letterSpacing: 0.6
  },

  card: {
    borderRadius: 20,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(80,140,255,0.35)",
    shadowColor: "#3B82F6",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    overflow: "hidden"
  },

  cardImage: {
    borderRadius: 20,
    opacity: 0.35
  }

});