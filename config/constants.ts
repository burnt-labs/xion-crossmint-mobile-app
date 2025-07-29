export const XION_CONFIG = {
  RPC_URL: process.env.EXPO_PUBLIC_RPC_ENDPOINT || "https://rpc.xion-testnet-2.burnt.com:443",
  REST_URL: process.env.EXPO_PUBLIC_REST_ENDPOINT || "https://api.xion-testnet-2.burnt.com",
  CHAIN_ID: "xion-testnet-2",
  TREASURY_ADDRESS: process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS || "",
  CROSSMINT_API_KEY: process.env.EXPO_PUBLIC_CROSSMINT_API_KEY || "",
};

// Validate required environment variables
if (!XION_CONFIG.CROSSMINT_API_KEY && process.env.NODE_ENV === 'production') {
  console.warn("CROSSMINT_API_KEY is not set. Payment functionality will not work.");
}

export const CROSSMINT_CONFIG = {
  ENVIRONMENT: "staging" as const, // or "production"
  PAYMENT_OPTIONS: {
    crypto: {
      enabled: true,
      defaultChain: "base-sepolia",
      defaultCurrency: "usdc",
    },
    fiat: {
      enabled: true,
      defaultCurrency: "usd",
    },
  },
  DEFAULT_PRICE: "$0.001",
  DEFAULT_PRICE_VALUE: "0.001",
};