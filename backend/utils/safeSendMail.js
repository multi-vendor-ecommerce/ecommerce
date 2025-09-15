export async function safeSendMail(sendMailFn, mailData) {
  try {
    await sendMailFn(mailData);
  } catch (err) {
    console.error("Email send failed:", err);
  }
}