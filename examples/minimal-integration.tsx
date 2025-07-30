/**
 * Minimal Crossmint + XION Integration Example
 * This shows the bare minimum code needed to accept credit card payments
 */

import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { 
  CrossmintProvider, 
  CrossmintEmbeddedCheckout 
} from '@crossmint/client-sdk-react-native-ui';

// Configuration
const CROSSMINT_API_KEY = "sk_staging_YOUR_KEY_HERE";
const COLLECTION_ID = "your-collection-id";
const NFT_PRICE = "0.001"; // $0.001 USD

export function MinimalCrossmintIntegration() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [userWallet] = useState("xion1..."); // Get from wallet provider

  const handlePurchase = () => {
    if (!userWallet) {
      alert("Please connect your wallet first");
      return;
    }
    setShowCheckout(true);
  };

  const handleSuccess = () => {
    console.log("Purchase successful!");
    setShowCheckout(false);
    // Add your success logic here
  };

  if (showCheckout) {
    return (
      <CrossmintProvider apiKey={CROSSMINT_API_KEY}>
        <CrossmintEmbeddedCheckout
          lineItems={{
            collectionLocator: `crossmint:${COLLECTION_ID}`,
            callData: {
              totalPrice: NFT_PRICE,
              quantity: 1,
            },
          }}
          payment={{
            crypto: { enabled: false },
            fiat: { enabled: true, defaultCurrency: "usd" },
          }}
          recipient={{
            walletAddress: userWallet,
          }}
          onEvent={(event) => {
            console.log("Crossmint event:", event);
            if (event.type === "payment:process.succeeded") {
              handleSuccess();
            }
          }}
        />
      </CrossmintProvider>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        NFT Purchase Demo
      </Text>
      <Text style={{ marginBottom: 20 }}>
        Price: ${NFT_PRICE} USD
      </Text>
      <Button 
        title="Buy with Credit Card" 
        onPress={handlePurchase}
      />
    </View>
  );
}