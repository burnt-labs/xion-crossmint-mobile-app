import "react-native-reanimated";
import "react-native-get-random-values";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AbstraxionProvider } from "@burnt-labs/abstraxion-react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

import { Buffer } from "buffer";
import crypto from "react-native-quick-crypto";
global.crypto = crypto;
global.Buffer = Buffer;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { XION_CONFIG } from "@/config/constants";

// Debug mode: Set to true to bypass treasury for testing
const DEBUG_MODE = process.env.EXPO_PUBLIC_DEBUG_MODE === "true" || false;
const treasuryAddress = process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS || XION_CONFIG.TREASURY_ADDRESS;

const baseConfig = {
  gasPrice: "0.001uxion",
  rpcUrl: process.env.EXPO_PUBLIC_RPC_ENDPOINT || XION_CONFIG.RPC_URL,
  restUrl: process.env.EXPO_PUBLIC_REST_ENDPOINT || XION_CONFIG.REST_URL,
  callbackUrl: "xion-crossmint-mobile://",
};

// Only add treasury if not in debug mode and treasury is available
const treasuryConfig = DEBUG_MODE ? baseConfig : {
  ...baseConfig,
  treasury: treasuryAddress,
};

console.log("Abstraxion Config:", {
  debugMode: DEBUG_MODE,
  treasury: DEBUG_MODE ? "DISABLED (Debug Mode)" : treasuryAddress,
  rpcUrl: treasuryConfig.rpcUrl,
  restUrl: treasuryConfig.restUrl,
});

const crossmintApiKey = process.env.EXPO_PUBLIC_CROSSMINT_API_KEY || XION_CONFIG.CROSSMINT_API_KEY;
if (!crossmintApiKey) {
  console.error("EXPO_PUBLIC_CROSSMINT_API_KEY is not set");
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AbstraxionProvider config={treasuryConfig}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AbstraxionProvider>
  );
}
