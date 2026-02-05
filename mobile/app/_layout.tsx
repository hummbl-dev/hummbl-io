// Using P1 (First Principles) - Root layout with tab navigation

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="mental-models/[id]"
          options={{
            headerShown: true,
            title: 'Mental Model',
            headerStyle: { backgroundColor: colors.primary[500] },
            headerTintColor: colors.text.inverse,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="narratives/[id]"
          options={{
            headerShown: true,
            title: 'Narrative',
            headerStyle: { backgroundColor: colors.primary[500] },
            headerTintColor: colors.text.inverse,
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}
