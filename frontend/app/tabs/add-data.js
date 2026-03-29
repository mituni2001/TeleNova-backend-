import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function ModernScreen() {
  const router = useRouter();

  // Animated blobs
  const blobAnim1 = useRef(new Animated.Value(0)).current;
  const blobAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobAnim1, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(blobAnim1, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blobAnim2, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(blobAnim2, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const blob1Style = {
    transform: [
      { translateX: blobAnim1.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] }) },
      { translateY: blobAnim1.interpolate({ inputRange: [0, 1], outputRange: [-30, 30] }) },
    ],
  };

  const blob2Style = {
    transform: [
      { translateX: blobAnim2.interpolate({ inputRange: [0, 1], outputRange: [30, -30] }) },
      { translateY: blobAnim2.interpolate({ inputRange: [0, 1], outputRange: [50, -50] }) },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated image blobs */}
      <Animated.View style={[styles.blob, blob1Style, { top: -50, left: -50 }]}>
        <ImageBackground
          source={require("../../assets/images/msa1.jpeg")}
          style={styles.blob}
          imageStyle={{ borderRadius: 125 }}
        />
      </Animated.View>

      <Animated.View style={[styles.blob, blob2Style, { bottom: 100, right: -80 }]}>
        <ImageBackground
          source={require("../../assets/images/ho.jpeg")}
          style={styles.blob}
          imageStyle={{ borderRadius: 125, opacity: 0.6 }}
        />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Device Data</Text>
          <View style={styles.underline} />
          <Text style={styles.subtitle}>TELECOM INFRASTRUCTURE</Text>
        </View>

        {/* Glassmorphism Card */}
        <BlurView intensity={35} tint="dark" style={styles.glassCard}>
          <Text style={styles.cardTitle}>Select Service</Text>

          {/* MSAN Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.modernButton}
            onPress={() => router.push("/screens/AddMSAN")}
          >
            <LinearGradient
              colors={["#FFF176", "#00FF87", "#00B4D8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={[styles.buttonText, { color: "#000" }]}>MSAN SYSTEM</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* RSU Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.modernButton, { marginTop: 16 }]}
            onPress={() => router.push("/screens/RSUMenu")}
          >
            <LinearGradient
              colors={["#FFF176", "#00FF87", "#00B4D8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={[styles.buttonText, { color: "#000" }]}>RSU MENU</Text>
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>

        <Text style={styles.footerText}>Manage your devices effortlessly.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  scrollContainer: { padding: 24, paddingTop: 80, alignItems: "center" },

  blob: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    overflow: "hidden",
  },

  header: { marginBottom: 50, alignItems: "center" },
  title: { fontSize: 40, fontWeight: "900", color: "#fff", textAlign: "center" },
  underline: { height: 4, width: 60, backgroundColor: "#10b981", marginTop: 5, borderRadius: 2 },
  subtitle: { fontSize: 12, color: "#94a3b8", letterSpacing: 3, marginTop: 15, fontWeight: "600" },

  glassCard: {
    width: width - 48,
    padding: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    shadowColor: "#0ea5e9",
    shadowOpacity: 0.3,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  cardTitle: { color: "#fff", fontSize: 18, marginBottom: 25, fontWeight: "600", textAlign: "center" },

  modernButton: { height: 60, borderRadius: 15, overflow: "hidden", elevation: 5 },
  buttonGradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonText: { fontSize: 16, fontWeight: "bold", color: "#000", letterSpacing: 1 },

  footerText: { color: "#475569", marginTop: 40, fontSize: 14, fontWeight: "500" },
});