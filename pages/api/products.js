import { connectDB } from "@/lib/mongoose";
import productModel from "@/model/productModel";

export default async function productHandler(req, res) {
  let { method } = req;

  if (method === "GET") {
    await connectDB();

    let { id } = req?.query;

    if (id) {
      let singleProduct = await productModel.findById({ _id: id });
      return res.json(singleProduct);
    }
  }

  if (method === "POST") {
    let { id } = req.body;

    let singleProduct = await productModel.findById({ _id: id });

    let similiarProducts = await productModel.find({
      category: singleProduct?.category,
    });

    return res.json(similiarProducts);
  }
}
