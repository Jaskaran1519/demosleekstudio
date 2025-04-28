// app/api/contact/route.ts
import { NextResponse } from 'next/server';

// --- IMPORTANT ---
// Install nodemailer: npm install nodemailer
// Install types: npm install --save-dev @types/nodemailer
import nodemailer from 'nodemailer';

type ResponseData = {
    message: string;
    success: boolean;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, message } = body;

        // Basic validation
        if (!name || !message) {
            return NextResponse.json(
                { success: false, message: 'Name and Message are required.' },
                { status: 400 }
            );
        }

        // --- Nodemailer Configuration ---
        // IMPORTANT: Use environment variables for credentials!
        // Example: process.env.EMAIL_SERVER_USER, process.env.EMAIL_SERVER_PASSWORD, etc.
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST, // e.g., 'smtp.example.com'
            port: parseInt(process.env.EMAIL_SERVER_PORT || '587'), // e.g., 587 or 465
            secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_SERVER_USER, // Your email address
                pass: process.env.EMAIL_SERVER_PASSWORD, // Your email password or app password
            },
        });

        const mailOptions = {
            from: `"Sleek Studio Contact" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`, // Sender address (can be same as user)
            to: process.env.EMAIL_TO, // List of receivers (your business email)
            replyTo: name && message ? `"${name}" <${message}>` : undefined, // Set Reply-To for easy response - BE CAREFUL WITH VALIDATION IF YOU DO THIS
            subject: `New Contact Form Submission from ${name}`, // Subject line
            text: `You received a new message from your website contact form.\n\n` +
                `Name: ${name}\n` +
                `Phone: ${phone || 'Not provided'}\n` +
                `Message:\n${message}`, // Plain text body
            html: `<p>You received a new message from your website contact form.</p>` +
                `<ul>` +
                `<li><strong>Name:</strong> ${name}</li>` +
                `<li><strong>Phone:</strong> ${phone || 'Not provided'}</li>` +
                `</ul>` +
                `<p><strong>Message:</strong></p>` +
                `<p>${message.replace(/\n/g, '<br>')}</p>`, // HTML body
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json(
            { success: true, message: 'Message sent successfully!' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send message. Server error.' },
            { status: 500 }
        );
    }
}