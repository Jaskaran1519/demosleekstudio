"use client"

import type React from "react"

import { useState } from "react"
import { Phone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { businessPhoneNumber, whatsappNumber } from "@/config/config"
import Image from "next/image"

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Your message has been sent successfully! We'll get back to you soon.",
        })
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          message: "",
        })
      } else {
        throw new Error(result.message || "Something went wrong")
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : "Failed to send message. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 min-h-screen bg-gray-50" style={{
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'2\'/%3E%3Ccircle cx=\'23\' cy=\'3\' r=\'2\'/%3E%3Ccircle cx=\'43\' cy=\'3\' r=\'2\'/%3E%3Ccircle cx=\'63\' cy=\'3\' r=\'2\'/%3E%3Ccircle cx=\'83\' cy=\'3\' r=\'2\'/%3E%3Ccircle cx=\'13\' cy=\'23\' r=\'2\'/%3E%3Ccircle cx=\'33\' cy=\'23\' r=\'2\'/%3E%3Ccircle cx=\'53\' cy=\'23\' r=\'2\'/%3E%3Ccircle cx=\'73\' cy=\'23\' r=\'2\'/%3E%3Ccircle cx=\'3\' cy=\'23\' r=\'2\'/%3E%3Ccircle cx=\'23\' cy=\'43\' r=\'2\'/%3E%3Ccircle cx=\'43\' cy=\'43\' r=\'2\'/%3E%3Ccircle cx=\'63\' cy=\'43\' r=\'2\'/%3E%3Ccircle cx=\'83\' cy=\'43\' r=\'2\'/%3E%3Ccircle cx=\'13\' cy=\'63\' r=\'2\'/%3E%3Ccircle cx=\'33\' cy=\'63\' r=\'2\'/%3E%3Ccircle cx=\'53\' cy=\'63\' r=\'2\'/%3E%3Ccircle cx=\'73\' cy=\'63\' r=\'2\'/%3E%3Ccircle cx=\'3\' cy=\'63\' r=\'2\'/%3E%3Ccircle cx=\'23\' cy=\'83\' r=\'2\'/%3E%3Ccircle cx=\'43\' cy=\'83\' r=\'2\'/%3E%3Ccircle cx=\'63\' cy=\'83\' r=\'2\'/%3E%3Ccircle cx=\'83\' cy=\'83\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E")',
      backgroundSize: '40px 40px'
    }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Contact Form */}
          <div className="bg-white/90 backdrop-blur-sm p-8 lg:p-12 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-8">
              <p className="text-[#476f66] font-medium mb-2">Get in Touch</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Let's Chat, Reach Out to Us</h2>
              <p className="text-gray-600">
                Have questions or feedback? We're here to help. Send us a message, and we'll respond within 24 hours
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#476f66] focus:border-transparent"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#476f66] focus:border-transparent"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#476f66] focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#476f66] focus:border-transparent resize-none"
                  placeholder="Leave us message"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#476f66] hover:bg-[#3a5c54] text-white py-4 px-6 rounded-lg transition duration-300 font-medium text-lg"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>

              {submitStatus && (
                <div
                  className={`mt-4 p-4 rounded-lg ${submitStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>

          {/* Right Side - Image and Contact Info */}
          <div className="hidden lg:block space-y-12">
            {/* Hero Image */}
            <div className="relative">
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="absolute inset-0">
                  <Image
                    src="/contact.webp"
                    alt="Contact Us"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-10">
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#476f66] transition block mb-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image src="/whatsapp.svg" width={30} height={30} alt="WhatsApp" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">WhatsApp</h3>
                    {whatsappNumber}
                  </div>
                </div>
              </Link>
              <Link 
                href="tel:+912528324923" 
                className="text-gray-600 hover:text-[#476f66] transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-[#476f66]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Phone</h3>
                    {businessPhoneNumber}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
