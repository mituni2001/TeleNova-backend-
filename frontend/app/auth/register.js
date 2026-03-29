import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerUser } from "../services/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await registerUser({ email, password });
      router.replace("/tabs/home");
    } catch (err) {
      Alert.alert("Registration Failed", err.message || "Something went wrong");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg1.png")}
      style={styles.background}
    >
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/logo.jpg")}
          style={styles.logo}
        />

        <Text style={styles.title}>Create Account</Text>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Register" onPress={handleRegister} />

        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.switchText}>
            Already have an account?{" "}
            <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "88%",
    backgroundColor: "#0f3b75",
    borderRadius: 18,
    padding: 25,
    elevation: 10,
  },
  logo: {
    width: 150,
    height: 45,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  switchText: {
    color: "#cbdfff",
    textAlign: "center",
    marginTop: 15,
  },
  link: {
    color: "#4da3ff",
    fontWeight: "bold",
  },
});

