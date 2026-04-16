import { stripe } from "../config/stripe.js";
import Product from "../model/Product.js";
import Cart from "../model/Cart.js";

export const createCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      throw new Error("Stripe not initialized");
    }

    const { cartItems } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!cartItems?.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is Empty",
      });
    }

    const productIds = cartItems.map((i) => i.productId);
    const productsFromDB = await Product.find({
      _id: { $in: productIds },
    });

    const lineItems = [];

    for (const cartItem of cartItems) {
      const product = productsFromDB.find(
        (p) => p._id.toString() === cartItem.productId,
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${cartItem.productId}`,
        });
      }

      const price = product.newPrice || product.price;

      // Create product data without description
      const productData = {
        name: product.name,
        metadata: {
          productId: product._id.toString(),
        },
      };

      // Only add image if available (optional, can be removed if causing issues)
      if (product.image?.length) {
        productData.images = [product.image[0]];
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount: Math.round(price * 100),
        },
        quantity: cartItem.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      metadata: {
        userId: req.user._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    console.log("Session created successfully:", session.id);

    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("Webhook event type:", event.type);
  } catch (error) {
    console.error("Webhook signature error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      console.log("Session metadata:", session.metadata);

      const userId = session.metadata?.userId;

      if (!userId) {
        console.log("No userId found in metadata");
        return res.status(200).json({ received: true });
      }

      // Clear the user's cart after successful payment
      const result = await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } },
        { new: true },
      );

      if (result) {
        console.log(`Cart cleared for user: ${userId}`);
      } else {
        console.log(`No cart found for user: ${userId}, creating empty cart`);
        await Cart.create({ user: userId, items: [] });
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  }

  res.status(200).json({ received: true });
};
