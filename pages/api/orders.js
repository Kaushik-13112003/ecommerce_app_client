import { connectDB } from "@/lib/mongoose";
import orderModel from "@/model/orderModel";

export default async function fetchCartData(req, res) {
  await connectDB();
  try {
    return res.json(
      await orderModel.find({ userId: req?.body?.id }).sort({ createdAt: -1 })
    );
  } catch (err) {
    console.log(err);
  }
}
