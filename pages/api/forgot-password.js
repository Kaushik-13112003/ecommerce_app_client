import nodemailer from "nodemailer";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
import { ContactPageSharp } from "@mui/icons-material";
import { connect } from "mongoose";
import userInfoModel from "@/model/userInfoModel";
import { connectDB } from "@/lib/mongoose";

export default async function forgotPassword(req, res) {
  let { method } = req;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    logger: true,
    secureConnection: false,
    auth: {
      user: "developerbuddy1311@gmail.com",
      pass: "djuczkfoyyvvsnul",
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  await connectDB();
  if (method === "POST") {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ msg: "Complete the fields" });
    }

    const isExist = await userInfoModel.findOne({ email: email });

    if (!isExist || isExist.role !== role) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Generate token
    const token = jwt.sign({ _id: isExist?._id }, process.env.TOKEN, {
      expiresIn: "120s",
    });

    const setUserToken = await userInfoModel.findByIdAndUpdate(
      { _id: isExist?._id },
      { verifyToken: token },
      { new: true }
    );

    if (setUserToken) {
      // Construct reset password URL
      const resetPasswordLink = `https://ecommercefront-81ht988ez-kaushiks-projects-611a0910.vercel.app/reset-password/${setUserToken._id}/${setUserToken.verifyToken}`;

      const mailOptions = {
        from: "developerbuddy1311@gmail.com",
        to: email,
        subject: "Reset Your Password on buyNow.com",
        html: `
         <p>Dear ${setUserToken.name},</p>
         <p>We received a request to reset your password for your buyNow.com account. If you did not request a password reset, please ignore this email. Your password will not change.</p>
         <p>To reset your password, please click the link below:</p>
         <a href="${resetPasswordLink}"> Click here to reset password </a>
         <p>For your security, this link will expire after one-time access. If you need a new link, you can request another password reset on the buyNow.com website.</p>
         <p>If you have any issues or did not request this change, please contact our support team at support@buyNow.com.</p>
         <p>Best regards,</p>
         <p>The buyNow.com Team</p>
         <hr>
         <p>buyNow.com<br>Your go-to platform for the best deals online.</p>
         `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          return res
            .status(401)
            .json({ msg: "Email not sent. Please try again." });
        } else {
          return res.status(200).json({ msg: "Email sent successfully." });
        }
      });
    }

    return res.json("ok");
  }

  if (method === "PUT") {
    let { password, id, token } = req.body;

    try {
      const validUser = await userInfoModel.findOne({
        _id: id,
        verifyToken: token,
      });

      if (!validUser) {
        return res.json({ expire: "Token expired or invalid." });
      }

      const verifyToken = jwt.verify(token, process.env.TOKEN);

      if (verifyToken && validUser) {
        const newPassword = await bcrypt.hash(password, 10);
        const updatePassword = await userInfoModel.findByIdAndUpdate(
          { _id: id },
          { password: newPassword }
        );

        if (updatePassword) {
          const updateToken = await userInfoModel.findByIdAndUpdate(
            { _id: id },
            { verifyToken: null }
          );

          return res.json("Password updated successfully.");
        }
      }
    } catch (err) {
      console.log(err);
    }

    return res.json("ok");
  }
}
