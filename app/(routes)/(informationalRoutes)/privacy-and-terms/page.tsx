import React from 'react'
import { Container } from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <Container>
      <div className="py-12 md:py-20 max-w-4xl mx-auto">

        {/* ─── Exchange Policy ─── */}
        <section className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 tracking-tight">
            Exchange Policy
          </h1>
          <p className="text-center text-gray-500 mb-10 text-sm tracking-widest uppercase">
            Sleek Studio
          </p>

          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 md:p-10 space-y-8">

            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                At Sleek Studio, customer satisfaction is our priority. While we do not offer returns or refunds, we ensure a smooth and flexible exchange experience so you always get the perfect fit and style.
              </p>
            </div>

            <Separator />

            {/* Exchange Eligibility */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Exchange Eligibility</h2>
              <p className="text-gray-600 leading-relaxed">
                You may request an exchange under the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>The exchange request is made within <span className="font-medium text-gray-900">7 days</span> of delivery.</li>
                <li>The item is eligible for exchange only in terms of <span className="font-medium text-gray-900">size or color</span> of the same product.</li>
                <li>The requested size or color must be in stock.</li>
              </ul>
            </div>

            <Separator />

            {/* Item Condition Requirements */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Item Condition Requirements</h2>
              <p className="text-gray-600 leading-relaxed">
                For an item to qualify for exchange, it must meet the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>The product must be unused and unworn.</li>
                <li>All tags, labels, and original packaging must be intact.</li>
                <li>The item must be free from stains, perfume scents, makeup marks, or damage.</li>
                <li>Footwear and accessories (if applicable) must be returned in their original boxes.</li>
              </ul>
            </div>

            <Separator />

            {/* Non-Exchangeable Items */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Non-Exchangeable Items</h2>
              <p className="text-gray-600 leading-relaxed">
                Certain items do not qualify for exchange under any circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Items showing signs of wear or use.</li>
                <li>Items without original tags or packaging.</li>
                <li>Requests made after the 7-day exchange window.</li>
                <li>Products purchased during clearance or final sale (if applicable).</li>
              </ul>
            </div>

            <Separator />

            {/* How to Request an Exchange */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">How to Request an Exchange</h2>
              <p className="text-gray-600 leading-relaxed">
                To request an exchange, please follow the steps below:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                <li>Contact us at our support email or WhatsApp within 7 days of receiving your order.</li>
                <li>Provide your order number, product details, and the reason for exchange.</li>
                <li>Our team will confirm availability of the requested size or color.</li>
                <li>You will receive instructions to ship the item back to us.</li>
              </ol>
            </div>

            <Separator />

            {/* Shipping & Processing */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Shipping &amp; Processing</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>The customer is responsible for shipping charges to return the item.</li>
                <li>Once the product is received and inspected, the replacement item will be shipped.</li>
                <li>Processing time for exchanges may vary based on product availability.</li>
              </ul>
            </div>

            <Separator />

            {/* No Return & Refund Policy */}
            <div className="space-y-3 bg-gray-50 -mx-6 md:-mx-10 px-6 md:px-10 py-6 rounded-b-xl">
              <h2 className="text-lg font-semibold text-gray-900">No Return &amp; Refund Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                Sleek Studio does not offer returns or refunds on any purchases. Only size or color exchanges are permitted as per our policy.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Privacy Policy & Terms ─── */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 tracking-tight">
            Privacy Policy &amp; Terms of Use
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm tracking-widest uppercase">
            Legal Information
          </p>

          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 md:p-10 space-y-8">

            <div className="space-y-3">
              <p className="text-gray-600 leading-relaxed">
                The usage of The Sleek Studio website and all the materials on it are subject to the terms and conditions (&quot;Terms and Conditions&quot;) of this Legal Webpage.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Privacy</h3>
              <p className="text-gray-600 leading-relaxed">
                Sleek Studio is committed to safeguarding your privacy. As outlined in our Privacy Statement and Notice of Privacy Practices, we keep the information of our customers in the strictest of confidence.
              </p>
              <p className="text-gray-600 leading-relaxed">
                If you are not familiar with these documents, we encourage you to read them. This is an ideal way for you to learn the details of how we at Sleek Studio protect the information of our customers and the specific circumstances in which we can use and disclose the information of our customers.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">General</h3>
              <p className="text-gray-600 leading-relaxed">
                This Sleek Studio website is owned and operated by us and we solely have the right at any time to change or discontinue any aspect or feature of this website including, without limitation, the content, hours of availability, and resources needed for access to or use of the website. Sleek Studio holds no obligation to update this site in a specific timeframe and, therefore, any information may be out of date.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Any graphics, animations, video, sound, text, trademarks, or service marks, and/or other information presented at this site are the property of Sleek Studio. Use of this information requires written permission from Sleek Studio.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Monitoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Sleek Studio reserves the right, but not the obligation, to monitor this website to determine compliance with the terms of this Legal Webpage and any rules established by Sleek Studio to satisfy any law or regulation.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Business</h3>
              <p className="text-gray-600 leading-relaxed">
                Any business associates of Sleek Studio identified in this site are independent of Sleek Studio. Such business associates are not joint venture partners or any other kind of partners of Sleek Studio. No employee or representative of any business associate is under the control of Sleek Studio. The information and descriptions contained on this site are intended as general information and are not necessarily complete descriptions of all terms, exclusions, and conditions applicable to the products and services offered by Sleek Studio.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Disclaimer of Warranty and Limitation of Liability</h3>
              <p className="text-gray-600 leading-relaxed">
                You expressly agree that the use of this site is at your sole risk. Neither Sleek Studio, its affiliates nor any of its or their respective employees, agents, third-party content providers, licensors, or business partners warrant that this site will be uninterrupted or error-free; nor do they make any warranty as to the results that may obtain from the use of this site, or as to the accuracy or liability of any information, service or merchandise provided through this site.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This site is provided on an as-is basis without warranties of any kind, either express or implied, including but not limited to warranties of title, or implied warranties of merchantability or fitness for a particular purpose, other than those warranties that are implied by and incapable of exclusion, restriction or modification under applicable law. Additionally, there are no warranties as to the results obtained from the use of this site.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This disclaimer of liability applies to any damages or injury caused by any failure of performance, error, omission, inaccuracy, interruption, deletion, defect, delay in operation or transmission, computer virus, communication line failure, theft or destruction, or unauthorized access to, alteration of, or use of this site whether for breach of contract, tortious behavior (including strict liability), negligence or under any other cause of action. You specifically acknowledge that Sleek Studio is not liable for the defamatory or offensive or illegal conduct of other users or third parties and that the risk of injury from the foregoing rests entirely with you.
              </p>
            </div>
          </div>
        </section>

      </div>
    </Container>
  )
}