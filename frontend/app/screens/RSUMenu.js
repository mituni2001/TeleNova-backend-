// RSUMenu.jsx
import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  StatusBar,
  ImageBackground,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button";

export default function RSUMenu() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ RSU record passed from previous screen
  const record = params?.record;

  // Navigate to specific form with record
  const navigateForm = (path, rec) => {
    router.push({
      pathname: path,
      params: { record: rec }, // pass RSU record
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#020617", "#0A1A44", "#051E54"]}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>RSU System</Text>
            <Text style={styles.subtitle}>Power & Environment Monitoring</Text>
          </View>

          {/* Card with buttons */}
          <ImageBackground
            source={require("../../assets/images/slt3.jpg")}
            style={styles.card}
            imageStyle={styles.cardImage}
          >
            <Button
              title="Rectifier"
              onPress={() => navigateForm("/screens/RectifierForm", record)}
            />

            <Button
              title="Battery Bank"
              onPress={() => navigateForm("/screens/BatteryBankForm", record)}
            />

            <Button
              title="AC Unit"
              onPress={() => navigateForm("/screens/ACUnitForm", record)}
            />

            <Button
              title="Generator"
              onPress={() => navigateForm("/screens/GeneratorForm", record)}
            />

            <Button
              title="AC Load"
              onPress={() => navigateForm("/screens/ACLoadForm", record)}
            />
          </ImageBackground>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 15,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#EAF2FF",
  },
  subtitle: {
    fontSize: 14,
    color: "#6EA8FF",
  },
  card: {
    padding: 20,
    borderRadius: 20,
    gap: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(80,140,255,0.35)",
  },
  cardImage: {
    borderRadius: 20,
    opacity: 0.35,
  },
});