import React from "react";
import { Stack } from "expo-router";

export default function MovieLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Movies",
        }}
      />
    </Stack>
  );
}
