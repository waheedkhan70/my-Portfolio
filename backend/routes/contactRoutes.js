import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// POST: Send contact email
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide name, email, and message' });
  }

  try {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Define the email options
    const mailOptions = {
      from: email, // Sender address (client)
      to: process.env.EMAIL_USER, // Receiver address (Admin)
      subject: `Portfolio Contact from ${name}`,
      text: `You have received a new message from your portfolio:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">New Portfolio Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`[Email Sent] From: ${email} to ${process.env.EMAIL_USER}`);
    
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('[Email Error]', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

export default router;
