import { connectDB } from "@/lib/mongoose";
import reviewModel from "@/model/reviewModel";

export default async function handleReviews(req, res) {
  let { method } = req;

  await connectDB();
  if (method === "POST") {
    let { rating, message, productId, name, image } = req.body;

    let newReview = await reviewModel.create({
      rating,
      message,
      name,
      image,
      productId,
    });

    return res.status(200).json(newReview);
  }

  if (method === "GET") {
    let { id } = req?.query;

    if (!id) return;

    let findReviews = await reviewModel
      .find({ productId: id })
      .sort({ createdAt: -1 });

    return res.json(findReviews);
  }
}
