import nodemailer from 'nodemailer';
import { sheets, auth } from '@googleapis/sheets';

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

    // Google Sheets integration
    try {
      if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL && process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY && process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID) {
        const client = new auth.GoogleAuth({
          credentials: {
            client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
            private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheetsAPI = sheets({ version: 'v4', auth: client });

        await sheetsAPI.spreadsheets.values.append({
          spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
          range: 'Sheet1!A:F',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              new Date().toLocaleString(),
              name,
              location,
              email,
              about,
              message || ''
            ]],
          },
        });
      } else {
        console.warn('Google Sheets environment variables are missing.');
      }
    } catch (sheetError) {
      console.error('Google Sheets append error:', sheetError);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
