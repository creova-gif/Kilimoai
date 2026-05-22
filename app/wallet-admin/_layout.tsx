import { Stack } from 'expo-router';

export default function WalletAdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="payouts" />
    </Stack>
  );
}
