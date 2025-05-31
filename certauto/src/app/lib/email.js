import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import emailjs from "@emailjs/browser";

// Set your EmailJS credentials here
const SERVICE_ID = "service_jnczqbk";
const TEMPLATE_ID = "template_yruw07c";
const PUBLIC_KEY = "aT4EjzdlZ0AtGEjIR";

export async function sendEmailsToAll(certificateImage) {
  // Fetch emails from Firestore
  let targetEmails = [];
  try {
    const snapshot = await getDocs(collection(db, "emails"));
    targetEmails = snapshot.docs.map(doc => doc.data().email).filter(Boolean);
    console.log("Target emails from Firestore:", targetEmails);
  } catch (fetchError) {
    throw new Error("Failed to fetch emails from Firestore.");
  }

  if (targetEmails.length === 0) {
    throw new Error("No target emails found in Firestore.");
  }

  // Prepare certificate image if provided
  let base64Data = certificateImage;
  if (certificateImage && certificateImage.startsWith('data:image/')) {
    const matches = certificateImage.match(/^data:image\/\w+;base64,(.+)$/);
    if (matches && matches.length > 1) {
      base64Data = matches[1];
    }
  }

  const responses = [];
  for (const email of targetEmails) {
    // Prepare template parameters for EmailJS
    const templateParams = {
      to_email: email,
      // Add other template variables as needed by your EmailJS template
      message: certificateImage
        ? "Congratulations! Here is your certificate."
        : "This is a test email to verify the email service is working.",
      certificate_image: certificateImage || "",
      // You can add more fields as needed by your template
    };

    try {
      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );
      responses.push(response);
    } catch (err) {
      responses.push({ error: err });
    }
    // Wait 500ms between sends to avoid rate limits
    await new Promise(res => setTimeout(res, 500));
  }

  return {
    success: true,
    message: `All ${responses.length} emails sent successfully${certificateImage ? " with certificates attached" : ""}`,
    responses,
  };
}
