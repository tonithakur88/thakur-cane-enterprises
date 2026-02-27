import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.BREVO_API_KEY, // SMTP KEY
      },
    });

    await transporter.sendMail({
      from: `"Thakur Cane Enterprises" <riverengineering96@gmail.com>`,  // 🔥 IMPORTANT CHANGE
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");

  } catch (error) {
    console.error("EMAIL ERROR 👉", error);
    throw error;
  }
};

