import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { CrossmintHostedCheckout } from "@crossmint/client-sdk-react-ui";
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
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>NFT Price</Text>
            <Text style={styles.price}>{CROSSMINT_CONFIG.DEFAULT_PRICE}</Text>
          </View>

          <CrossmintHostedCheckout
            clientId={XION_CONFIG.CROSSMINT_API_KEY}
            lineItems={{
              collectionLocator: `crossmint:${collectionId}`,
              callData: {
                totalPrice: CROSSMINT_CONFIG.DEFAULT_PRICE_VALUE,
                quantity: 1,
              },
            }}
            appearance={{
              display: "popup",
              overlay: true,
              button: {
                style: {
                  borderRadius: 8,
                  fontSize: 16,
                  padding: "12px 24px",
                  width: "100%",
                },
              },
              checkout: {
                modal: {
                  width: "500px",
                },
              },
            }}
            payment={{
              crypto: {
                enabled: true,
                defaultChain: "base-sepolia",
                defaultCurrency: "usdc",
              },
              fiat: {
                enabled: true,
                defaultCurrency: "usd",
                receiptEmail: "",
              },
            }}
            recipient={{
              walletAddress: recipientAddress,
            }}
            onSuccess={handleSuccess}
            onError={(error) => {
              console.error("Payment error:", error);
            }}
          />
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
  priceInfo: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
});