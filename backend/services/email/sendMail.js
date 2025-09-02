import { transporter } from "./transporter.js";

export const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"NoahPlanet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};