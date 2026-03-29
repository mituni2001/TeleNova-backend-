import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={["#00FF87", "#00B4D8"]} // Green → Blue Gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",

    // Shadow effect
    shadowColor: "#00B4D8",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },

  text: {
    color: "#021024",
    fontWeight: "bold",
    fontSize: 16,
  },
});