import React from 'react'
import { Container } from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"

export const page = () => {
  return (
    <Container>
      <div className="py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy & Terms of Use</h1>
        
        <div className=" rounded-lg shadow-sm p-8 space-y-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              The usage of The Sleek Studio website and all the materials on it are subject to the terms and conditions ("Terms and Conditions") of this Legal Webpage.
            </p>

          
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Privacy</h2>
            <p className="text-gray-700">
              Sleek Studio is committed to safeguarding your privacy. As outlined in our Privacy Statement and Notice of Privacy Practices, we keep the information of our customers in the strictest of confidence.
            </p>
            
            <p className="text-gray-700">
              If you are not familiar with these documents, we encourage you to read them. This is an ideal way for you to learn the details of how we at Sleek Studio protect the information of our customers and the specific circumstances in which we can use and disclose the information of our customers.
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">General</h2>
            <p className="text-gray-700">
              This Sleek Studio website is owned and operated by us and we solely have the right at any time to change or discontinue any aspect or feature of this website including, without limitation, the content, hours of availability, and resources needed for access to or use of the website. Sleek Studio holds no obligation to update this site in a specific timeframe and, therefore, any information may be out of date.
            </p>
            
            <p className="text-gray-700">
              Any graphics, animations, video, sound, text, trademarks, or service marks, and/or other information presented at this site are the property of Sleek Studio. Use of this information requires written permission from Sleek Studio.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Monitoring</h2>
            <p className="text-gray-700">
              Sleek Studio reserves the right, but not the obligation, to monitor this website to determine compliance with the terms of this Legal Webpage and any rules established by Sleek Studio to satisfy any law or regulation.
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Business</h2>
            <p className="text-gray-700">
              Any business associates of Sleek Studio identified in this site are independent of Sleek Studio. Such business associates are not joint venture partners or any other kind of partners of Sleek Studio. No employee or representative of any business associate is under the control of Sleek Studio. The information and descriptions contained on this site are intended as general information and are not necessarily complete descriptions of all terms, exclusions, and conditions applicable to the products and services offered by Sleek Studio.
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Disclaimer of Warranty and Limitation of Liability</h2>
            <p className="text-gray-700">
              You expressly agree that the use of this site is at your sole risk. Neither Sleek Studio, its affiliates nor any of its or their respective employees, agents, third-party content providers, licensors, or business partners warrant that this site will be uninterrupted or error-free; nor do they make any warranty as to the results that may obtain from the use of this site, or as to the accuracy or liability of any information, service or merchandise provided through this site.
            </p>
            
            <p className="text-gray-700">
              This site is provided on an as-is basis without warranties of any kind, either express or implied, including but not limited to warranties of title, or implied warranties of merchantability or fitness for a particular purpose, other than those warranties that are implied by and incapable of exclusion, restriction or modification under applicable law. Additionally, there are no warranties as to the results obtained from the use of this site.
            </p>
            
            <p className="text-gray-700">
              This disclaimer of liability applies to any damages or injury caused by any failure of performance, error, omission, inaccuracy, interruption, deletion, defect, delay in operation or transmission, computer virus, communication line failure, theft or destruction, or unauthorized access to, alteration of, or use of this site whether for breach of contract, tortious behavior (including strict liability), negligence or under any other cause of action. You specifically acknowledge that Sleek Studio is not liable for the defamatory or offensive or illegal conduct of other users or third parties and that the risk of injury from the foregoing rests entirely with you.
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default page