# XION Crossmint Mobile NFT Marketplace

A React Native mobile application that integrates XION blockchain with Crossmint payment processing to create a seamless NFT marketplace experience.

## Features

- 🔐 XION wallet connection via Abstraxion
- 🖼️ Collection browsing with real-time metadata
- 💳 Crossmint React Native SDK with embedded checkout
- 💰 Support for both fiat and crypto payments
- 📱 Native mobile UI with platform-specific styling
- 🔄 Pull-to-refresh for collections
- 📳 Haptic feedback on all interactions
- 👆 Long-press gestures for additional options
- 🎨 iOS/Android native design patterns

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

## Setup

1. **Clone the repository and install dependencies:**
   ```bash
   cd xion-crossmint-mobile-app
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   - `EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS`: Your XION treasury address
   - `EXPO_PUBLIC_CROSSMINT_API_KEY`: Your Crossmint API key

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your device:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation screens
│   │   └── index.tsx      # Main NFT marketplace screen
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable components
│   ├── CollectionCard.tsx # Collection display
│   ├── WalletHeader.tsx   # Wallet connection UI
│   └── CrossmintPaymentModal.tsx # Payment checkout
├── config/               # Configuration files
│   └── constants.ts      # App constants and config
├── data/                 # Static data
│   └── collections.json  # Collections list
└── assets/              # Images and fonts
```

## Key Components

### CollectionCard
Displays collection information in a mobile-optimized single-column layout with:
- Full-width cards with native shadows
- Price badge overlay on images
- Tap entire card to purchase
- Platform-specific typography

### WalletHeader
Manages wallet connection state and displays connected address with:
- Tap to copy address with haptic feedback
- Long-press to show options (copy/disconnect)
- Native iOS/Android styling

### CrossmintPaymentModal
Handles the payment flow using Crossmint's React Native SDK:
- Embedded checkout experience
- Native modal presentation
- Support for credit card payments
- Crypto payments (currently disabled)

## Adding Collections

Edit `data/collections.json` to add new collections:

```json
{
  "collections": [
    {
      "id": "unique-uuid",
      "contractAddress": "xion-contract-address"
    }
  ]
}
```

## Crossmint Integration

This app uses Crossmint's React Native SDK (@crossmint/client-sdk-react-native-ui) for native mobile checkout. The payment flow:

1. User taps a collection card
2. Native modal opens with CrossmintEmbeddedCheckout
3. User enters payment details in the embedded form
4. Payment is processed with haptic feedback
5. NFT is delivered to user's XION wallet

### Required Headers
The app automatically includes required mobile authentication headers:
- `x-app-identifier`: Bundle identifier for mobile apps
- `authorization`: ClientSecret authentication

## UI/UX Design

### Native Mobile Patterns
- **iOS**: SF Pro fonts, system blue (#007AFF), native shadows
- **Android**: System fonts, Material Design elevations
- **Gestures**: Tap, long-press, pull-to-refresh
- **Feedback**: Haptic responses on all interactions

### User Interactions
- **Wallet Button**: 
  - Tap to copy address
  - Long-press for disconnect option
- **Collection Cards**: Tap anywhere to purchase
- **Main Screen**: Pull down to refresh collections

## Development Tips

- Use `npm run ios` or `npm run android` for native builds
- Run `npx expo prebuild` if you encounter native module errors
- Check `metro.config.js` for bundler configuration
- Environment variables must be prefixed with `EXPO_PUBLIC_`
- Test payment flows in Crossmint's staging environment first
- Use `npx expo start -c` to clear cache if you encounter bundling issues

## Troubleshooting

**Wallet Connection Issues:**
- Ensure you have the correct RPC/REST endpoints
- Check that your treasury address is valid

**Payment Failures:**
- Verify your Crossmint API key is correct
- Ensure you're using the right environment (staging/production)

**Build Errors:**
- Clear metro cache: `npx expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Run prebuild for native modules: `npx expo prebuild --clean`

**Native Module Errors:**
- "Cannot find native module": Run `npx expo prebuild`
- "Unable to resolve module": Install missing packages (e.g., `npm install nanoid`)

## Resources

- [XION Documentation](https://docs.burnt.com/xion)
- [Crossmint Headless Checkout](https://docs.crossmint.com/payments/headless/overview)
- [Abstraxion React Native](https://github.com/burnt-labs/abstraxion)
- [Expo Documentation](https://docs.expo.dev)
