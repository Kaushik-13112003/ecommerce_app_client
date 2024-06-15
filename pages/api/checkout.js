import { connectDB } from "@/lib/mongoose";
import orderModel from "@/model/orderModel";
import productModel from "@/model/productModel";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// console.log(stripe);

export default async function checkOut(req, res) {
  if (req?.method !== "POST") {
    return;
  }

  await connectDB();
  try {
    let {
      userId,
      products,
      city,
      postalCode,
      country,
      state,
      name,
      email,
      address,
    } = req.body;
    // console.log(products, city, postalCode, country, state, name, email);

    let line_items = [];
    // let joinProductIds = products?.split(",");

    if (products.singleProduct) {
      let singleProduct = products?.singleProduct[0];
      // console.log(singleProduct);

      let findProduct = await productModel.findOne({
        _id: singleProduct?.singleProductId,
      });

      if (!findProduct) {
        return;
      }

      if (singleProduct?.quantity && singleProduct?.total) {
        line_items.push({
          price_data: {
            currency: "inr",
            product_data: { name: findProduct?.name },
            unit_amount: findProduct?.price * 100,
          },
          quantity: singleProduct?.quantity,
        });
      }
    }

    if (!products.singleProduct) {
      let joinProductIds = products;
      let findUniqId = [...new Set(joinProductIds)];
      // console.log(findUniqId);

      let findProducts = await productModel.find({ _id: findUniqId });

      for (let id of findUniqId) {
        let productInfo = findProducts?.find((p) => p?._id.toString() === id);
        let quantity = joinProductIds?.filter((pid) => pid === id)?.length || 0;

        if (quantity > 0 && productInfo) {
          line_items.push({
            price_data: {
              currency: "inr",
              product_data: {
                name: productInfo?.name,
              },
              unit_amount: productInfo?.price * 100, // Stripe expects amount in cents
            },
            quantity: quantity,
          });
        }
      }
    }

    let newOrder = await orderModel.create({
      city,
      postalCode,
      country,
      address,
      state,
      name,
      email,
      line_items,
      paid: false,
      userId,
      status: "Pending",
    });

    //single product
    // let payment;

    let payment;
    const successUrl = products?.singleProduct
      ? `https://ecommercefront-81ht988ez-kaushiks-projects-611a0910.vercel.app/purchase?success=true`
      : `https://ecommercefront-81ht988ez-kaushiks-projects-611a0910.vercel.app/cartpayment?success=true`;
    const cancelUrl = products?.singleProduct
      ? `https://ecommercefront-81ht988ez-kaushiks-projects-611a0910.vercel.app/purchase?success=false`
      : `https://ecommercefront-81ht988ez-kaushiks-projects-611a0910.vercel.app/cartpayment?success=false`;

    if (products?.singleProduct) {
      payment = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        customer_email: email,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          order_Id: newOrder?._id.toString(),
        },
      });
    } else {
      payment = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        customer_email: email,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          order_Id: newOrder?._id.toString(),
        },
      });
    }

    // res.json(line_items);
    res.json({ url: payment?.url });
  } catch (err) {
    console.log(err);
  }
}
