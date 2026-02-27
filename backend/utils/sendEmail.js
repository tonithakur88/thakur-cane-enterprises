import * as Brevo from "@getbrevo/brevo";

const sendEmail = async (to, subject, html) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    await apiInstance.sendTransacEmail({
      sender: {
        email: "riverengineering96@gmail.com",
        name: "Thakur Cane Enterprises",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    });

    console.log("✅ Email sent successfully via Brevo API");
  } catch (error) {
    console.error("❌ EMAIL ERROR 👉", error);
    throw error;
  }
};

export default sendEmail;
