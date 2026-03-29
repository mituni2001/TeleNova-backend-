import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      {/* Landing / redirect screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Auth screens */}
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />

      {/* App tabs */}
      <Stack.Screen name="tabs/home" options={{ headerShown: false }} />
      <Stack.Screen name="tabs/add-data" options={{ headerShown: false }} />
      <Stack.Screen name="tabs/view-data" options={{ headerShown: false }} />
    </Stack>
  );
}


