import React from 'react';

const ContactPage: React.FC = () => {
    // --- Form state and handlers removed ---

    const businessPhoneNumber = '+917014342043'; // Replace with your actual phone number (include country code)
    const whatsappNumber = '917014342043'; // Replace with your WhatsApp number (usually without '+', check WhatsApp docs)
    const defaultWhatsappMessage = encodeURIComponent("Hello Sleek Studio, I'm contacting you from your website."); // Optional pre-filled message

    return (
            <div className="max-w-6xl mx-auto my-16 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl overflow-hidden p-8 md:p-12">

                    {/* Header Section */}
                    <section className="text-center mb-12 pb-6 border-b border-gray-200">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                            Get In Touch with Us
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            We're ready to assist you! Choose your preferred way to connect with us below, or visit our studio.
                        </p>
                    </section>

                    {/* Content Wrapper - Grid Layout */}
                    {/* Adjusted to potentially give more emphasis or rebalance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                        {/* Contact Options Section (Replaces Form Section) */}
                        <section>
                             <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[3px] after:bg-indigo-600 after:rounded-sm">
                                Connect With Us
                            </h2>
                            <div className="space-y-6">
                                {/* Call Us Option */}
                                <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow duration-200">
                                    {/* Optional Icon */}
                                    {/* <FaPhoneAlt className="text-2xl text-indigo-600 mt-1" /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Call Us</h3>
                                        <p className="text-gray-600 text-sm mb-2">Speak directly with our team.</p>
                                        <a
                                            href={`tel:${businessPhoneNumber}`}
                                            className="inline-block px-5 py-2 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                                        >
                                            {businessPhoneNumber} {/* Display the number */}
                                        </a>
                                    </div>
                                </div>

                                {/* WhatsApp Option */}
                                <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow duration-200">
                                    {/* Optional Icon */}
                                    {/* <FaWhatsapp className="text-3xl text-green-600 mt-1" /> */}
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor">
                                         <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.395 1.904 6.161l-1.178 4.299 4.387-1.161zm7.085-6.96c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                    </svg>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Chat on WhatsApp</h3>
                                        <p className="text-gray-600 text-sm mb-2">Send us a message quickly via WhatsApp.</p>
                                        <a
                                            href={`https://wa.me/${whatsappNumber}?text=${defaultWhatsappMessage}`}
                                            target="_blank" // Open in new tab/app
                                            rel="noopener noreferrer" // Security best practice
                                            className="inline-block px-5 py-2 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
                                        >
                                            Message Us
                                        </a>
                                    </div>
                                </div>

                                {/* Email Option (Moved here for consistency) */}
                                 <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Email Us</h3>
                                        <p className="text-gray-600 text-sm mb-2">Send us an email for detailed inquiries.</p>
                                        <a
                                            href="mailto:contact@sleekstudio.com" // Replace with your email
                                            className="text-indigo-600 hover:text-indigo-800 hover:underline transition duration-150 ease-in-out font-medium break-all"
                                        >
                                            contact@sleekstudio.com {/* Replace with your email */}
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </section>

                        {/* Map and Address Section */}
                        <section>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[3px] after:bg-indigo-600 after:rounded-sm">
                                Find Us
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Visit our studio or get directions using the map below.
                                {/* Optional: Add address text if desired */}
                                {/* <br /><strong>Address:</strong> 123 Sleek Street, Style City, ST 45678 */}
                            </p>
                            <div className="w-full h-80 md:h-96 rounded-lg overflow-hidden border border-gray-200 mb-8 relative bg-gray-100 shadow-sm">
                                <div className="w-full h-full">
                                    {/* --- PASTE YOUR GOOGLE MAPS IFRAME CODE HERE --- */}
                                    {/* Make sure width="100%" height="100%" style={{ border: 0 }} */}
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d876525.8609052679!2d74.633511578125!3d30.888643100000017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a82557b784b7f%3A0xe34202b9310d8ee2!2sSleek%20studio!5e0!3m2!1sen!2sin!4v1745751541573!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade">
                                    </iframe>
                                    {/* --- END OF GOOGLE MAPS EMBED CODE AREA --- */}
                                </div>
                            </div>

                            {/* Optional: Add hours or other static info */}
                            {/* <div className="pt-6 border-t border-gray-200 text-gray-700 leading-loose">
                                <p><strong className="font-semibold text-gray-800">Hours:</strong> Mon-Fri, 9am - 5pm</p>
                            </div> */}
                        </section>
                    </div>
                </div>
            </div>
    );
};

export default ContactPage;