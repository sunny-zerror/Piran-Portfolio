import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, location, email, message, about } = await req.json();

    // Use Gmail service if standard gmail passwords are provided
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: process.env.NEXT_PUBLIC_CLIENT_EMAIL || process.env.NEXT_PUBLIC_EMAIL_USER,
      subject: `New Contact Form Submission: ${about}`,
      text: `
You have received a new message from the Piran Portfolio contact form.

Name: ${name}
Location / Company: ${location}
Email: ${email}
About: ${about}
Message: ${message || 'No message provided.'}
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Email send error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
