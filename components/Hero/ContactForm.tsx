"use client"

import type React from "react"

import { useState } from "react"
import { Phone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { businessPhoneNumber, whatsappNumber } from "@/config/config"

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
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Contact Form */}
          <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-sm">
            <div className="mb-8">
              <p className="text-orange-500 font-medium mb-2">Get in Touch</p>
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
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Leave us message"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg transition duration-300 font-medium text-lg"
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
              <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
                  {/* Circular background pattern */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-96 h-96 rounded-full border-4 border-blue-300 opacity-30"></div>
                    <div className="absolute w-80 h-80 rounded-full border-4 border-blue-400 opacity-40"></div>
                    <div className="absolute w-64 h-64 rounded-full border-4 border-blue-500 opacity-50"></div>
                  </div>
                </div>
                {/* Person illustration */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center">
                    <Phone className="w-20 h-20 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-10">
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition block mb-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.498 14.382v-.002c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.963-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.136-.135.297-.345.446-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.516-.173-.008-.371-.01-.571-.01-.2 0-.524.074-.797.359-.276.3-1.05 1.02-1.05 2.475 0 1.455 1.04 2.876 1.185 3.075.15.195 2.1 3.195 5.1 4.485.715.3 1.27.48 1.71.615.715.227 1.37.195 1.885.118.57-.09 1.765-.72 2.01-1.425.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.216-3.75.975 1.005-3.645-.239-.375a9.878 9.878 0 01-1.5-5.26c.015-5.445 4.455-9.885 9.943-9.885 2.64 0 5.145 1.035 7.035 2.91 1.89 1.86 2.925 4.35 2.91 6.99-.015 5.444-4.455 9.885-9.943 9.885M20.52 3.45C18.24 1.2 15.24 0 12.045 0 5.46 0 .105 5.37.105 11.985c-.015 2.13.555 4.14 1.53 5.85L0 24l6.3-1.65c1.74.93 3.705 1.444 5.76 1.444h.006c6.58 0 11.94-5.365 11.94-11.96 0-3.18-1.26-6.21-3.485-8.38" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">WhatsApp</h3>

                    {whatsappNumber}
                  </div>
                </div>
              </Link>
              <Link href="tel:+912528324923" className="text-gray-600 hover:text-blue-600 transition">

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
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
