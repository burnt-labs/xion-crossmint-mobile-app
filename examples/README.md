# Crossmint + XION Integration Examples

This folder contains minimal, working examples of Crossmint integration patterns.

## Examples Included

### 1. `minimal-integration.tsx`
The absolute minimum code needed to accept credit card payments for NFTs.
- Basic CrossmintEmbeddedCheckout setup
- Simple success handling
- Mobile-ready implementation

### 2. `api-integration.ts`
Direct API integration without using the SDK.
- Creating orders via API
- Proper mobile headers (`x-app-identifier`)
- clientSecret authentication
- Webhook handling for backend

### 3. `wallet-integration.tsx`
Complete example with XION wallet integration.
- Abstraxion wallet connection
- NFT marketplace example
- Query user's NFTs
- Full payment flow

## Quick Start

1. **Get your API keys**:
   ```bash
   # Staging (for testing)
   https://staging.crossmint.com
   
   # Production (when ready)
   https://crossmint.com
   ```

2. **Install dependencies**:
   ```bash
   npm install @crossmint/client-sdk-react-native-ui
   npm install @burnt-labs/abstraxion-react-native
   ```

3. **Set environment variables**:
   ```bash
   EXPO_PUBLIC_CROSSMINT_API_KEY=sk_staging_xxx
   EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS=xion1...
   ```

4. **Copy an example and customize**:
   - Replace API keys
   - Update collection IDs
   - Modify styling to match your app

## Common Patterns

### Error Handling
```typescript
onEvent={(event) => {
  if (event.type === "payment:process.failed") {
    // Show user-friendly error
    Alert.alert("Payment Failed", "Please try again");
  }
}}
```

### Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

onEvent={(event) => {
  if (event.type === "payment:process.started") {
    setIsLoading(true);
  } else if (event.type === "payment:process.succeeded") {
    setIsLoading(false);
  }
}}
```

### Price Formatting
```typescript
// Always use strings for prices
const price = "0.001"; // $0.001 USD

// Format for display
const displayPrice = `$${parseFloat(price).toFixed(2)} USD`;
```

## Testing

Use these test credit cards in staging:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0000 0000 3220`

## Need Help?

- Check the [main guide](../CROSSMINT_XION_GUIDE.md)
- See [error reference](../CROSSMINT_ERRORS.md)
- Review the [full app implementation](../components/)