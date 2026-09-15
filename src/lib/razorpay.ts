import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId) {
  throw new Error("RAZORPAY_KEY_ID environment variable is not set");
}

if (!keySecret) {
  throw new Error("RAZORPAY_KEY_SECRET environment variable is not set");
}

/**
 * Server-side Razorpay instance.
 * NEVER expose keySecret to the client.
 */
export const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

/** Public key ID safe to share with the frontend */
export const RAZORPAY_KEY_ID = keyId;
