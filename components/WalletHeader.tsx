import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

interface WalletHeaderProps {
  address?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletHeader({
  address,
  onConnect,
  onDisconnect,
}: WalletHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (address) {
      await Clipboard.setStringAsync(address);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    if (addr.length < 15) return addr;
    return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
  };

  const handleLongPress = () => {
    if (!address) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Wallet Options",
      formatAddress(address),
      [
        {
          text: "Copy Address",
          onPress: copyToClipboard,
        },
        {
          text: "Disconnect",
          onPress: onDisconnect,
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {address ? (
        <TouchableOpacity
          style={styles.walletButton}
          onPress={copyToClipboard}
          onLongPress={handleLongPress}
          activeOpacity={0.9}
          delayLongPress={500}
        >
          <View style={styles.walletInfo}>
            <View style={styles.walletIcon}>
              <Ionicons name="wallet" size={16} color="#007AFF" />
            </View>
            <Text style={styles.addressText}>{formatAddress(address)}</Text>
            <Ionicons
              name={copied ? "checkmark-circle" : "copy"}
              size={18}
              color={copied ? "#34C759" : "#8E8E93"}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.connectButton}
          onPress={onConnect}
          activeOpacity={0.9}
        >
          <Ionicons name="wallet" size={20} color="#FFFFFF" />
          <Text style={styles.connectText}>Connect Wallet</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  walletButton: {
    backgroundColor: "#F2F2F7",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  walletInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  walletIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5F1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
    letterSpacing: -0.2,
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 100,
    gap: 8,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  connectText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.4,
  },
});