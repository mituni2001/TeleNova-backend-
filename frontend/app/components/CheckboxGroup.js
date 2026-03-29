import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CheckboxGroup({
  title,
  options,
  selected,
  onChange,
  textColor = "#FFFFFF", // default text
  getColor = () => "#22C55E", // function to get color dynamically
}) {
  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <TouchableOpacity
            key={opt}
            style={[
              styles.option,
              isSelected && { backgroundColor: getColor(opt) },
            ]}
            onPress={() => toggleOption(opt)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.optionText,
                isSelected && { color: "#FFFFFF" }, // white text when selected
              ]}
            >
              {isSelected ? "✅" : "⬜"} {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  title: { fontWeight: "700", fontSize: 15, marginBottom: 6 },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CBD5F5",
  },
});

