/**
 * Direct API Integration Example
 * Shows how to use Crossmint API directly without SDK
 */

// Required headers for mobile apps
const MOBILE_HEADERS = {
  'Content-Type': 'application/json',
  'x-app-identifier': 'com.your.app.id', // REQUIRED for mobile!
};

// API Configuration
const CROSSMINT_API_BASE = 'https://staging.crossmint.com/api';
const API_KEY = 'sk_staging_YOUR_KEY_HERE';

/**
 * Create an order using Crossmint API
 */
export async function createCrossmintOrder(params: {
  collectionId: string;
  recipientAddress: string;
  email?: string;
}) {
  try {
    const response = await fetch(`${CROSSMINT_API_BASE}/v1/orders`, {
      method: 'POST',
      headers: {
        ...MOBILE_HEADERS,
        'authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        lineItems: {
          collectionLocator: `crossmint:${params.collectionId}`,
          callData: {
            totalPrice: "0.001",
            quantity: 1,
          },
        },
        payment: {
          method: "fiat",
          currency: "usd",
          receiptEmail: params.email, // Email goes in payment, not recipient!
        },
        recipient: {
          walletAddress: params.recipientAddress,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Order creation failed');
    }

    const data = await response.json();
    
    // Handle different response formats
    const orderId = data.orderId || data.data?.orderId || data.id;
    
    return {
      orderId,
      checkoutUrl: data.checkoutUrl,
    };
  } catch (error) {
    console.error('Crossmint order error:', error);
    throw error;
  }
}

/**
 * Get order status
 */
export async function getOrderStatus(orderId: string) {
  const response = await fetch(
    `${CROSSMINT_API_BASE}/v1/orders/${orderId}`,
    {
      headers: {
        ...MOBILE_HEADERS,
        'authorization': `Bearer ${API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get order status');
  }

  return response.json();
}

/**
 * Example: Using clientSecret authentication (recommended by Crossmint team)
 */
export async function createOrderWithClientSecret(params: {
  clientSecret: string;
  collectionId: string;
  recipientAddress: string;
}) {
  const response = await fetch(`${CROSSMINT_API_BASE}/v1/orders`, {
    method: 'POST',
    headers: {
      ...MOBILE_HEADERS,
      'authorization': `clientSecret ${params.clientSecret}`, // Note format!
    },
    body: JSON.stringify({
      lineItems: {
        collectionLocator: `crossmint:${params.collectionId}`,
        callData: {
          totalPrice: "0.001",
          quantity: 1,
        },
      },
      payment: {
        method: "fiat",
        currency: "usd",
      },
      recipient: {
        walletAddress: params.recipientAddress,
      },
    }),
  });

  return response.json();
}

/**
 * Webhook handler for your backend
 */
export async function handleCrossmintWebhook(
  request: Request
): Promise<Response> {
  const signature = request.headers.get('x-crossmint-signature');
  
  // Verify webhook signature (implement based on Crossmint docs)
  if (!verifyWebhookSignature(signature)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const body = await request.json();
  const { event, data } = body;

  switch (event) {
    case 'order.completed':
      console.log('Order completed:', data.orderId);
      // Update your database
      await markOrderComplete(data.orderId);
      break;
      
    case 'order.failed':
      console.log('Order failed:', data.orderId);
      // Handle failure
      await markOrderFailed(data.orderId, data.error);
      break;
      
    case 'nft.minted':
      console.log('NFT minted:', data.tokenId);
      // Update NFT status
      await updateNFTStatus(data.orderId, data.tokenId);
      break;
  }

  return new Response('OK', { status: 200 });
}

// Helper functions (implement these based on your needs)
function verifyWebhookSignature(signature: string | null): boolean {
  // Implement signature verification
  return true;
}

async function markOrderComplete(orderId: string) {
  // Update order in your database
}

async function markOrderFailed(orderId: string, error: string) {
  // Handle failed order
}

async function updateNFTStatus(orderId: string, tokenId: string) {
  // Update NFT delivery status
}