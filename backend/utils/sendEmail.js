<<<<<<< HEAD
const sendEmail = async (to, subject, html) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: "riverengineering96@gmail.com",
          name: "Thakur Cane Enterprises",
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }
  } catch (error) {
    console.error("❌ EMAIL ERROR 👉", error.message);
    throw error;
  }
};

export default sendEmail;
=======
const sendEmail = async (to, subject, html) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: "riverengineering96@gmail.com",
          name: "Thakur Cane Enterprises",
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }
  } catch (error) {
    console.error("❌ EMAIL ERROR 👉", error.message);
    throw error;
  }
};

export default sendEmail;


>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
