import { connectDB } from "@/lib/mongoose";
import orderModel from "@/model/orderModel";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { buffer } from "micro";

const endpointSecret =
  "whsec_a2c811bd4fd0107dded4ccbc795ff2f499f5bf1c961b275c500f68dd6be7fce4";

export default async function checkOut(req, res) {
  await connectDB();
  const sign = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sign,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send("Webhook error : ", err?.message);
    return;
  }

  // Handle the event
  switch (event.type) {
    // payment_intent.succeeded
    case "checkout.session.completed":
      const paymentIntent = event.data.object;
      const orderId = paymentIntent?.metadata?.orderId;
      const paid = paymentIntent.paymet.status === "paid";
      if (orderId && paid) {
        await orderModel.findById(orderId, {
          paid: true,
        });
      }
      console.log(paid);
      console.log(paymentIntent);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send("ok");
}

export const config = {
  api: { bodyParser: false },
};
