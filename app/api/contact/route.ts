import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  message: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, message } = body as ContactFormData;

    // Basic validation
    if (!firstName || !lastName || !message) {
      return NextResponse.json(
        { success: false, message: 'First name, last name, and message are required.' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Sleek Studio <onboarding@resend.dev>', // Update with your verified sender email
      to: process.env.CONTACT_FORM_RECIPIENT || 'your-email@example.com',
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: `New contact form submission:\n\n` +
        `Name: ${firstName} ${lastName}\n` +
        `Phone: ${phone || 'Not provided'}\n` +
        `Message:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p>You've received a new message from the contact form on your website.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-line; background: white; padding: 10px; border-radius: 5px; margin-top: 5px;">
              ${message}
            </div>
          </div>
          
          <p style="color: #666; font-size: 0.9em;">
            This email was sent from the contact form on your website.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'An error occurred while sending your message.' 
      },
      { status: 500 }
    );
  }
}