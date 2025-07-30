/**
 * Complete Wallet + Crossmint Integration Example
 * Shows how to integrate XION wallet with Crossmint payments
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import {
  AbstraxionProvider,
  useAbstraxionAccount,
  useAbstraxionClient,
} from '@burnt-labs/abstraxion-react-native';
import {
  CrossmintProvider,
  CrossmintEmbeddedCheckout,
} from '@crossmint/client-sdk-react-native-ui';

// Wrap your app with providers
export function App() {
  return (
    <AbstraxionProvider
      config={{
        chain: "xion-testnet-2",
        rpcUrl: "https://rpc.xion-testnet-2.burnt.com:443",
      }}
    >
      <CrossmintProvider apiKey={process.env.EXPO_PUBLIC_CROSSMINT_API_KEY}>
        <NFTMarketplace />
      </CrossmintProvider>
    </AbstraxionProvider>
  );
}

function NFTMarketplace() {
  const { data: account } = useAbstraxionAccount();
  const { login, logout } = useAbstraxionClient();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  // Mock NFT data
  const nfts = [
    { id: '1', name: 'Cool NFT #1', price: '0.001', collectionId: 'abc123' },
    { id: '2', name: 'Cool NFT #2', price: '0.002', collectionId: 'abc123' },
  ];

  const handlePurchase = (nft: any) => {
    if (!account?.bech32Address) {
      alert('Please connect your wallet first');
      return;
    }
    setSelectedNFT(nft);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    console.log('Payment successful!');
    setShowCheckout(false);
    setSelectedNFT(null);
    
    // You could refresh user's NFT balance here
    refreshUserNFTs();
  };

  const refreshUserNFTs = async () => {
    // Query blockchain for user's NFTs
    if (account?.bech32Address) {
      // Implementation depends on your contract
      console.log('Refreshing NFTs for:', account.bech32Address);
    }
  };

  // Show checkout modal
  if (showCheckout && selectedNFT) {
    return (
      <View style={{ flex: 1 }}>
        <CrossmintEmbeddedCheckout
          lineItems={{
            collectionLocator: `crossmint:${selectedNFT.collectionId}`,
            callData: {
              totalPrice: selectedNFT.price,
              quantity: 1,
            },
          }}
          payment={{
            crypto: { enabled: false },
            fiat: { 
              enabled: true, 
              defaultCurrency: "usd",
            },
          }}
          recipient={{
            walletAddress: account.bech32Address,
          }}
          onEvent={(event) => {
            console.log('Crossmint event:', event);
            
            switch (event.type) {
              case 'payment:process.started':
                console.log('Payment started');
                break;
                
              case 'payment:process.succeeded':
                handlePaymentSuccess();
                break;
                
              case 'payment:process.failed':
                console.error('Payment failed:', event.error);
                alert('Payment failed. Please try again.');
                break;
                
              case 'checkout:closed':
                setShowCheckout(false);
                break;
            }
          }}
        />
      </View>
    );
  }

  // Main marketplace view
  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Wallet Section */}
      <View style={{ marginBottom: 30 }}>
        {account?.bech32Address ? (
          <View>
            <Text>Connected: {account.bech32Address.slice(0, 10)}...</Text>
            <Button title="Disconnect" onPress={logout} />
          </View>
        ) : (
          <Button title="Connect Wallet" onPress={login} />
        )}
      </View>

      {/* NFT List */}
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Available NFTs
      </Text>
      
      {nfts.map((nft) => (
        <View 
          key={nft.id} 
          style={{ 
            padding: 15, 
            marginBottom: 10, 
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 16 }}>{nft.name}</Text>
          <Text style={{ color: '#666' }}>Price: ${nft.price}</Text>
          <Button
            title="Buy with Card"
            onPress={() => handlePurchase(nft)}
            disabled={!account?.bech32Address}
          />
        </View>
      ))}
    </View>
  );
}

/**
 * Advanced: Query user's NFTs from contract
 */
export async function queryUserNFTs(
  signingClient: any,
  contractAddress: string,
  userAddress: string
) {
  try {
    // Query CW721 tokens
    const response = await signingClient.queryContractSmart(
      contractAddress,
      {
        tokens: {
          owner: userAddress,
          limit: 100,
        },
      }
    );
    
    // Get metadata for each token
    const tokensWithMetadata = await Promise.all(
      response.tokens.map(async (tokenId: string) => {
        const metadata = await signingClient.queryContractSmart(
          contractAddress,
          {
            nft_info: { token_id: tokenId },
          }
        );
        return { tokenId, ...metadata };
      })
    );
    
    return tokensWithMetadata;
  } catch (error) {
    console.error('Error querying NFTs:', error);
    return [];
  }
}