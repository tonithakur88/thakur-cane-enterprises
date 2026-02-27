import SibApiV3Sdk from "@getbrevo/brevo";

export const sendEmail = async (to, subject, html) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;  // 🔥 API KEY (NOT SMTP KEY)

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    await tranEmailApi.sendTransacEmail({
      sender: {
        email: "riverengineering96@gmail.com",
        name: "Thakur Cane Enterprises",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    });

    console.log("Email sent successfully via Brevo API");

  } catch (error) {
    console.error("EMAIL ERROR 👉", error.response?.body || error.message);
    throw error;
  }
};



