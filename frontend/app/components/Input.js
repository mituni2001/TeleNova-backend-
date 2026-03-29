import { TextInput, StyleSheet } from "react-native";

export default function Input({ placeholder, value, onChangeText, secureTextEntry }) {
  return (
    <TextInput
      style={[styles.input, { color: "#ffffff" }]}
      placeholder={placeholder}
      placeholderTextColor="#ffffff"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      selectionColor="#ffffff"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#0b2d5c", // dark background
  },
});

