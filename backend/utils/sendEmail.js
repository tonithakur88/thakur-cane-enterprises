import * as SibApiV3Sdk from "@getbrevo/brevo";

const sendEmail = async (to, subject, html) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = {
      email: "riverengineering96@gmail.com",
      name: "Thakur Cane Enterprises",
    };

    const receivers = [
      {
        email: to,
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject,
      htmlContent: html,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ EMAIL ERROR 👉", error);
    throw error;
  }
};

export default sendEmail;



