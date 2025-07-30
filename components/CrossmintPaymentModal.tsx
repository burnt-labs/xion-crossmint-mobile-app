import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { 
  CrossmintProvider, 
  CrossmintEmbeddedCheckout 
} from "@crossmint/client-sdk-react-native-ui";
import { XION_CONFIG, CROSSMINT_CONFIG } from "@/config/constants";
import { Ionicons } from "@expo/vector-icons";

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
  const handleSuccess = () => {
    console.log("Payment successful!");
    onSuccess?.();
    onClose();
  };

  const handleError = (error: any) => {
    console.error("Payment error:", error);
  };

  if (!visible) return null;

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
          <CrossmintProvider apiKey={XION_CONFIG.CROSSMINT_API_KEY}>
            <CrossmintEmbeddedCheckout
              lineItems={{
                collectionLocator: `crossmint:${collectionId}`,
                callData: {
                  totalPrice: CROSSMINT_CONFIG.DEFAULT_PRICE_VALUE,
                  quantity: 1,
                },
              }}
              payment={{
                crypto: {
                  enabled: false, // Disabled until we have proper wallet integration
                  defaultChain: "base-sepolia",
                  defaultCurrency: "usdc",
                },
                fiat: {
                  enabled: true,
                  defaultCurrency: "usd",
                },
              }}
              recipient={{
                walletAddress: recipientAddress,
              }}
              onEvent={(event) => {
                console.log("Crossmint event:", event);
                if (event.type === "payment:process.succeeded") {
                  handleSuccess();
                } else if (event.type === "payment:process.failed") {
                  handleError(event);
                }
              }}
            />
          </CrossmintProvider>
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
    padding: 20,
  },
});