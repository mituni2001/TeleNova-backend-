import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require("../../assets/images/msa1.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)", "black"]}
          style={styles.gradientOverlay}
        >
          <View style={styles.bottomContent}>
            <Text style={styles.title}>Welcome To TeleNova 👋</Text>
            <Text style={styles.subtitle}>
              Smart Telecom Network Management for MSAN and RSU Systems
            </Text>

            {/* GET STARTED BUTTON */}
            <TouchableOpacity
              onPress={() => router.push("/auth/login")}
              activeOpacity={0.8}
              style={{ width: "100%", marginBottom: 12 }}
            >
              <LinearGradient
                colors={["#FFD700", "#90EE90", "#87CEFA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.gradientButtonText}>GET STARTED</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* CREATE ACCOUNT BUTTON */}
            <TouchableOpacity
              onPress={() => router.push("/auth/register")}
              activeOpacity={0.7}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>CREATE AN ACCOUNT</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  gradientOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 30,
    paddingBottom: 50,
  },

  bottomContent: {
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
    lineHeight: 40,
  },

  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
  },

  /* NEW GRADIENT BUTTON */
  gradientButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  gradientButtonText: {
    color: "#000", // black text
    fontWeight: "bold",
    fontSize: 18,
  },

  secondaryButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});