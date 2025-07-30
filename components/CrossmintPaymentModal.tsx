import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { 
  CrossmintProvider, 
  CrossmintEmbeddedCheckout 
} from "@crossmint/client-sdk-react-native-ui";
import { XION_CONFIG, CROSSMINT_CONFIG } from "@/config/constants";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSuccess?.();
    onClose();
  };

  const handleError = (error: any) => {
    console.error("Payment error:", error);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Complete Purchase</Text>
          <View style={styles.placeholder} />
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 24,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#C6C6C8",
  },
  title: {
    fontSize: 17,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: "#000000",
    letterSpacing: Platform.OS === 'ios' ? -0.4 : 0,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
});