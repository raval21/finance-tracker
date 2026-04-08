// const axios = require("axios");

// const sendEmail = async (email, otp) => {
//   try {
//     await axios.post(
//       "https://api.brevo.com/v3/smtp/email",
//       {
//         sender: {
//           email: process.env.EMAIL_FROM,
//           name: "Finance Tracker",
//         },
//         to: [{ email }],
//         subject: "Your OTP Code",
//         htmlContent: `
//           <h2>Your OTP Code</h2>
//           <p>Your OTP is: <b>${otp}</b></p>
//         `,
//       },
//       {
//         headers: {
//           "api-key": process.env.BREVO_API_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Email sent successfully");
//   } catch (err) {
//     console.log("Brevo error:", err.response?.data || err.message);
//     throw err;
//   }
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Finance Tracker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>Your OTP is: <b>${otp}</b></p>
      `,
    });

    console.log("Email sent successfully ✅");

  } catch (err) {
    console.log("Email error:", err.message);
    throw err;
  }
};

module.exports = sendEmail;
