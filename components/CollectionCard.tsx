import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { CROSSMINT_CONFIG } from "@/config/constants";
import { Ionicons } from "@expo/vector-icons";

interface CollectionMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
}

interface CollectionCardProps {
  id: string;
  contractAddress: string;
  metadata?: CollectionMetadata;
  onBuyPress: () => void;
}

const { width } = Dimensions.get("window");
const CARD_MARGIN = 20;

export function CollectionCard({
  id,
  metadata,
  onBuyPress,
}: CollectionCardProps) {
  const defaultImage = require("@/assets/images/partial-react-logo.png");
  const imageSource = metadata?.image
    ? { uri: metadata.image }
    : defaultImage;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onBuyPress}
      activeOpacity={0.95}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{CROSSMINT_CONFIG.DEFAULT_PRICE}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>
              {metadata?.name || `Collection ${id.slice(0, 8)}`}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {metadata?.description || "Digital collectible on Xion"}
            </Text>
          </View>
          
          <View style={styles.buyButtonContainer}>
            <View style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Buy Now</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: CARD_MARGIN,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#F2F2F7",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  priceTag: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backdropFilter: "blur(10px)",
  },
  priceText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  textContent: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#000000",
    marginBottom: 4,
    letterSpacing: Platform.OS === "ios" ? -0.4 : 0,
  },
  description: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 18,
  },
  buyButtonContainer: {
    flexShrink: 0,
  },
  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 100,
    gap: 4,
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
});