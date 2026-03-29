import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function RadioGroup({ title, options, selected, onChange }) {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.title}>{title}</Text>

      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.option,
            selected === opt && styles.selectedOptionBorder,
          ]}
          onPress={() => onChange(opt)}
        >
          <Text
            style={[
              styles.optionText,
              selected === opt && styles.selectedOptionText,
            ]}
          >
            {selected === opt ? "🔘" : "⚪"} {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: "bold", marginBottom: 5, color: "#FFFFFF" },
  option: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginVertical: 2,
  },
  optionText: { color: "#FFFFFF" },
  selectedOptionText: { color: "#00FF00", fontWeight: "bold" },
  selectedOptionBorder: { borderColor: "#00FF00", borderWidth: 1.5 },
});
