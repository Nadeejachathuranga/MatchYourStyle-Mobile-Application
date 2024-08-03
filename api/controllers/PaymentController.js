import Stripe from "stripe";

const SECRET_KEY =
  "sk_test_51O3x9tGEIOifpCgC0367qfpCcP1wNSCppPT6iekci4NACDG4rsNakoqFKGDvGAXAGPW8i9QQd8zUHfysRwJHkMNs00KJGgCsn6";

const PUBLISHABLE_KEY =
  "pk_test_51O3x9tGEIOifpCgCb7gZFsyZcxDLpC7QMSSbR2xACG8A86KxZ6gLGikbU6DE7wwSI7TXJM9t8p32iNRRwnSwcqDs00bVgJdvQT";

export const createPaymentIntent = async (req, res) => {
  const stripe = Stripe(SECRET_KEY, { apiVersion: "2023-10-16" });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, //lowest denomination of particular currency
      currency: "usd",
      payment_method_types: ["card"],
      receipt_email: "sdulshan10@gmail.com",
    });

    const clientSecret = paymentIntent.client_secret;

    console.log("Client Secret: " + clientSecret);

    res.json({
      clientSecret: clientSecret,
    });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

export const createPaymentSheet = async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.

  let { totalPrice } = req.body;
  totalPrice = parseFloat(totalPrice).toFixed(2) * 100;

  const stripe = Stripe(SECRET_KEY, { apiVersion: "2023-10-16" });

  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2023-10-16" }
  );
  const paymentIntent = await stripe.paymentIntents
    .create({
      amount: totalPrice,
      currency: "usd",
      customer: customer.id,
      payment_method_types: ["card"],
    })
    .catch((e) => {
      console.log(e.message);
    });
  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: PUBLISHABLE_KEY,
  });
};
