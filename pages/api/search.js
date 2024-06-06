import { connectDB } from "@/lib/mongoose";
import productModel from "@/model/productModel";

export default async function searchHandler(req, res) {
  let { method } = req;

  if (method === "GET") {
    await connectDB();

    let { search } = req?.query;

    if (search) {
      let findProducts = await productModel.find({
        $or: [
          { name: { $regex: search, $options: "i" } },

          { des: { $regex: search, $options: "i" } },

        //   { price: { $eq: parseFloat(search) } },
        ],
      });

      return res.json(findProducts);
    }
  }
}
