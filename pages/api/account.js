import { connectDB } from "@/lib/mongoose";
import productModel from "@/model/productModel";

export default async function fetchCartData(req, res) {
  await connectDB();
  try {
    return res.json(await productModel.find({ _id: req.body?.ids }));
  } catch (err) {
    console.log(err);
  }
}
