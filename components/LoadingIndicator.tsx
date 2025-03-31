import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";

interface LoadingIndicatorProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "Loading...",
  size = "large",
  color = "#007aff",
  fullScreen = true,
}) => {
  return (
    <View
      style={[styles.container, fullScreen && styles.fullScreen]}
      testID="loading-indicator"
    >
      <ActivityIndicator size={size} color={color} testID="loading-spinner" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreen: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
