import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion-react-native";
import { WalletHeader } from "@/components/WalletHeader";
import { CollectionCard } from "@/components/CollectionCard";
import { CrossmintPaymentModal } from "@/components/CrossmintPaymentModal";
import collectionsData from "@/data/collections.json";

interface Collection {
  id: string;
  contractAddress: string;
  metadata?: {
    name: string;
    symbol: string;
    description: string;
    image: string;
  };
}

export default function NFTMarketplace() {
  const { data: account, login, logout } = useAbstraxionAccount();
  const { client: signingClient } = useAbstraxionSigningClient();
  
  const [collections, setCollections] = useState<Collection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCollections = useCallback(async () => {
    if (!signingClient || !account?.bech32Address) {
      return;
    }

    try {
      setError(null);
      const collectionsWithInfo = await Promise.all(
        collectionsData.collections.map(async (collection) => {
          try {
            const contractInfo = await signingClient.queryContractSmart(
              collection.contractAddress,
              { contract_info: {} }
            );
            
            const hasRoyaltyInfo = await signingClient.queryContractSmart(
              collection.contractAddress,
              { extension: { msg: { royalty_info: {} } } }
            ).catch(() => null);

            const metadata = await signingClient.queryContractSmart(
              collection.contractAddress,
              { contract_metadata: {} }
            ).catch(() => null);

            return {
              ...collection,
              contractInfo,
              hasRoyaltyInfo: !!hasRoyaltyInfo,
              metadata: metadata || contractInfo,
            };
          } catch (err) {
            console.error(`Error fetching collection ${collection.id}:`, err);
            return collection;
          }
        })
      );
      setCollections(collectionsWithInfo);
    } catch (error) {
      console.error("Error loading collections:", error);
      setError("Failed to load collections. Pull to refresh.");
    } finally {
      setRefreshing(false);
    }
  }, [signingClient, account?.bech32Address]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCollections();
  }, [loadCollections]);

  const handleBuyPress = useCallback((collectionId: string) => {
    if (!account?.bech32Address) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      handleLogin();
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCollection(collectionId);
    setPaymentModalVisible(true);
  }, [account?.bech32Address]);

  const handleLogin = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    login();
  }, [login]);

  const handleLogout = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logout();
  }, [logout]);

  const renderCollection = useCallback(({ item }: { item: Collection }) => (
    <CollectionCard
      id={item.id}
      contractAddress={item.contractAddress}
      metadata={item.metadata}
      onBuyPress={() => handleBuyPress(item.id)}
    />
  ), [handleBuyPress]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      {!account?.bech32Address ? (
        <>
          <Text style={styles.emptyStateTitle}>Welcome to Digital Asset Marketplace</Text>
          <Text style={styles.emptyStateText}>
            Connect your wallet to start exploring and purchasing Digital Assets
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.emptyStateTitle}>No Collections Available</Text>
          <Text style={styles.emptyStateText}>
            Check back later for new collections
          </Text>
        </>
      )}
    </View>
  );

  const renderHeader = () => {
    const isLoggedOut = !account?.bech32Address;
    
    return (
      <View style={[styles.header, isLoggedOut && styles.headerCentered]}>
        <Text style={[styles.title, isLoggedOut && styles.textCentered]}>Collections</Text>
        <Text style={[styles.subtitle, isLoggedOut && styles.textCentered]}>
          {account?.bech32Address 
            ? `${collections.length} collection${collections.length !== 1 ? 's' : ''} available`
            : 'Connect wallet to view collections'
          }
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (account?.bech32Address) return null;
    
    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={handleLogin}
          activeOpacity={0.9}
        >
          <Ionicons name="wallet" size={20} color="#FFFFFF" />
          <Text style={styles.connectText}>Connect Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
      />
      
      <WalletHeader
        address={account?.bech32Address}
        onConnect={handleLogin}
        onDisconnect={handleLogout}
      />

      <FlatList
        data={account?.bech32Address ? collections : []}
        renderItem={renderCollection}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            colors={["#007AFF"]}
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        windowSize={10}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {selectedCollection && (
        <CrossmintPaymentModal
          visible={paymentModalVisible}
          onClose={() => {
            setPaymentModalVisible(false);
            setSelectedCollection(null);
          }}
          collectionId={selectedCollection}
          recipientAddress={account?.bech32Address || ""}
          onSuccess={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            console.log("Purchase successful!");
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: "#000000",
    letterSpacing: Platform.OS === 'ios' ? 0.374 : 0,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#8E8E93",
    fontWeight: '400',
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 17,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 15,
    textAlign: "center",
    fontWeight: '500',
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 100,
    gap: 8,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    minWidth: 200,
  },
  connectText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.4,
  },
  headerCentered: {
    alignItems: "center",
  },
  textCentered: {
    textAlign: "center",
  },
});