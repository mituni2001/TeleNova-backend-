import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await loginUser({ email, password });
      router.replace("/tabs/home");
    } catch (err) {
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg1.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <BlurView intensity={80} tint="dark" style={styles.card}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>
          Sign in to continue to your dashboard
        </Text>

        {/* EMAIL */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* SIGN IN BUTTON */}
        <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>SIGN IN</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* SOCIAL LOGIN */}
        <View style={styles.socialRow}>
          <View style={styles.socialBtn}>
            <Text style={styles.socialText}>G</Text>
          </View>
          <View style={styles.socialBtn}>
            <Text style={styles.socialText}>f</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.register}>
            Don’t have an account? <Text style={styles.link}>Register</Text>
          </Text>
        </TouchableOpacity>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  card: {
    width: "90%",
    padding: 25,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 25,
  },

  inputContainer: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  input: {
    height: 50,
    color: "#fff",
  },

  forgot: {
    color: "#aee2ff",
    textAlign: "right",
    marginBottom: 20,
    fontSize: 13,
  },

  button: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },

  socialBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  socialText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  register: {
    textAlign: "center",
    color: "#ddd",
    fontSize: 13,
  },

  link: {
    color: "#4facfe",
    fontWeight: "bold",
  },
});

