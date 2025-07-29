import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { XION_CONFIG } from "@/config/constants";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

interface CrossmintPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  collectionId: string;
  recipientAddress: string;
  onSuccess?: () => void;
}

export function CrossmintPaymentModal({
  visible,
  onClose,
  collectionId,
  recipientAddress,
  onSuccess,
}: CrossmintPaymentModalProps) {
  const [loading, setLoading] = useState(true);

  // Generate the checkout URL for the embedded webview
  const generateCheckoutUrl = () => {
    const apiKey = XION_CONFIG.CROSSMINT_API_KEY;
    const isProduction = apiKey.startsWith("ck_production") || apiKey.startsWith("sk_production");
    const baseUrl = isProduction 
      ? "https://www.crossmint.com" 
      : "https://staging.crossmint.com";
    
    // Try different URL formats based on Crossmint's checkout options
    // Option 1: Direct checkout buy URL
    const checkoutPath = "/checkout/buy";
    
    // Construct parameters for NFT purchase
    const params = new URLSearchParams({
      clientId: apiKey,
      mintTo: recipientAddress,
      // NFT specific parameters
      collection: collectionId,
      // Price in USD
      price: "0.001",
      quantity: "1",
    });

    const checkoutUrl = `${baseUrl}${checkoutPath}?${params.toString()}`;
    
    console.log("=== Crossmint Checkout Debug ===");
    console.log("API Key:", apiKey);
    console.log("Is Production:", isProduction);
    console.log("Base URL:", baseUrl);
    console.log("Collection ID:", collectionId);
    console.log("Recipient Address:", recipientAddress);
    console.log("Full Checkout URL:", checkoutUrl);
    console.log("================================");

    return checkoutUrl;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("Received message from checkout:", data);
      
      if (data.type === "checkout:success") {
        Alert.alert(
          "Success",
          "Your NFT purchase was successful!",
          [{ text: "OK", onPress: () => { onSuccess?.(); onClose(); }}]
        );
      } else if (data.type === "checkout:error") {
        Alert.alert(
          "Error",
          data.message || "An error occurred during checkout",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.log("Non-JSON message received:", event.nativeEvent.data);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Purchase</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* WebView implementation until native SDK checkout is available */}
          <View style={styles.webviewContainer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333" />
                <Text style={styles.loadingText}>Loading checkout...</Text>
              </View>
            )}
            <WebView
              source={{ uri: generateCheckoutUrl() }}
              onLoadEnd={() => setLoading(false)}
              onMessage={handleMessage}
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
            />
          </View>
          
          <View style={styles.info}>
            <Text style={styles.infoText}>
              Debug: Check console for checkout URL details
            </Text>
            <Text style={styles.debugText} numberOfLines={3}>
              URL: {generateCheckoutUrl()}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    position: "relative",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  info: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  debugText: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
    marginTop: 4,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});