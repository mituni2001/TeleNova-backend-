import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/auth/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const GradientButton = ({ title, onPress }) => {
    const scale = new Animated.Value(1);

    const handlePressIn = () =>
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
    const handlePressOut = () =>
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

    // Text color logic
    const textColor = title === "Logout" ? "#FF4444" : "#000";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={["#8BC34A", "#42A5F5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HERO SECTION ================= */}
      <View style={styles.heroWrapper}>
        <Image
          source={require("../../assets/images/ho.jpeg")}
          style={styles.heroImage}
        />

        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)", "transparent"]}
          style={styles.heroOverlay}
        />

        <View style={styles.heroContent}>
          {/* LOGO */}
          <Image
            source={require("../../assets/images/logo.jpg")}
            style={styles.logo} // rectangle logo
          />

          <View style={styles.textBox}>
            <Text style={styles.title}>TeleNova</Text>
            <Text style={styles.subtitle}>Network & Data Management</Text>
          </View>
        </View>
      </View>

      {/* ================= ACTION CARD ================= */}
      <ImageBackground
        source={require("../../assets/images/bg1.png")}
        style={styles.card}
        imageStyle={{ borderRadius: 18 }}
      >
        <Text style={styles.cardTitle}>Quick Actions</Text>

        <GradientButton
          title="Add Network Data"
          onPress={() => router.push("/tabs/add-data")}
        />
        <GradientButton
          title="View Network Data"
          onPress={() => router.push("/tabs/view-data")}
        />
        <GradientButton title="Logout" onPress={handleLogout} />
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#061A40" },

  /* HERO */
  heroWrapper: {
    height: 380,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  heroImage: { width: "100%", height: "100%", position: "absolute" },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 200,
    height: 70,
    marginBottom: 18,
    resizeMode: "contain",
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  textBox: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 6,
  },

  /* CARD */
  card: {
    marginTop: -45,
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 22,
    elevation: 8,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 18,
    textAlign: "center",
  },

  /* BUTTONS */
  button: { marginVertical: 8, borderRadius: 16, elevation: 4 },
  buttonGradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },
});