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
    
    // console.log("Creating session for user:", req.user._id);
    
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
      
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image?.length
              ? [`${process.env.CLIENT_URL}${product.image[0]}`]
              : [],
          },
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

    // console.log("Session created with metadata:", session.metadata); 
    
    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.log("Create session error:", error);
    res.status(500).json({ success: false, message: error.message });
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

    // console.log("EVENT TYPE:", event.type);
  } catch (error) {
    // console.log("SIGNATURE ERROR:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      
      // console.log("Session metadata:", session.metadata);
      
      const userId = session.metadata?.userId;
      
      // console.log("User ID from metadata:", userId);

      if (!userId) {
        // console.log("No userId found - this shouldn't happen in production");
        return res.status(200).json({ received: true });
      }

      const result = await Cart.findOneAndUpdate(
        { user: userId },
        { items: [] },
        { new: true }
      );
      
      if (result) {
        // console.log(`Cart cleared for user: ${userId}`);
      } else {
        // console.log(`No cart found for user: ${userId}`);
        await Cart.create({ user: userId, items: [] });
        // console.log(`Created empty cart for user: ${userId}`);
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  }

  res.status(200).json({ received: true });
};