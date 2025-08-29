import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
 
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});
console.log(process.env.USER_EMAIL)
console.log(process.env.USER_PASSWORD)



async function sendMail() {
  try {
    const info = await transporter.sendMail({
      from:process.env.USER_EMAIL,
      to: process.env.USER_EMAIL,
      subject: "Test Email",
      text: "Hello world!",
      html: "<b>Hello world!</b>",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

sendMail();
