import { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { ChevronRight, Shield, FileText, Scale, Truck, CreditCard, XCircle, AlertCircle, Globe, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and Conditions for ${SITE_CONFIG.name}. Read our policies on orders, payments, shipping, cancellations, and more.`,
};

const sections = [
  {
    icon: FileText,
    title: "1. Introduction & Acceptance",
    content: `Welcome to ${SITE_CONFIG.name} ("we," "our," or "us"). By accessing or using our website at ${SITE_CONFIG.url}, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms, please do not use our services.\n\nThese terms apply to all visitors, users, and customers of ${SITE_CONFIG.name}. We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the website constitutes acceptance of any changes.`,
  },
  {
    icon: Globe,
    title: "2. Use of Website",
    content: `You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of others. You must not:\n\n• Use the website in any way that causes or may cause damage to the website or impairment of its availability.\n• Use the website to transmit any harmful, threatening, abusive, or otherwise objectionable material.\n• Use automated tools to scrape, mine, or extract data from the website without our written consent.\n• Attempt to gain unauthorized access to any part of the website or its systems.\n\nWe reserve the right to restrict or terminate access to anyone who violates these terms.`,
  },
  {
    icon: Shield,
    title: "3. Orders & Pricing",
    content: `All orders placed through ${SITE_CONFIG.name} are subject to product availability and confirmation of the order price.\n\n• Prices displayed on the website are in Indian Rupees (${SITE_CONFIG.currency}) and include applicable GST unless stated otherwise.\n• We reserve the right to modify prices at any time without prior notice. However, changes will not affect orders that have already been confirmed.\n• An order is confirmed only after successful placement and payment verification (for prepaid orders) or acceptance (for COD orders).\n• We reserve the right to cancel any order if the product is unavailable, there is a pricing error, or we suspect fraudulent activity.\n• Product images are for illustrative purposes. Minor variations in color, fabric texture, or design may occur due to photography, screen settings, and the handmade nature of certain products.`,
  },
  {
    icon: CreditCard,
    title: "4. Payment Terms",
    content: `We accept the following payment methods:\n\n• Cash on Delivery (COD): Available for select pin codes. Payment is collected at the time of delivery.\n• Online Payment via Razorpay: Includes UPI, Credit/Debit Cards, Net Banking, and Wallets. All online transactions are processed securely through Razorpay's payment gateway.\n\nAll payment information is encrypted and processed securely. ${SITE_CONFIG.name} does not store your card details or banking credentials. For any payment-related issues, please contact us immediately.`,
  },
  {
    icon: Truck,
    title: "5. Shipping & Delivery",
    content: `We offer pan-India delivery. Delivery timelines and charges vary based on your location:\n\n• Standard delivery typically takes 3–7 business days from the date of order confirmation.\n• Delivery charges are calculated based on your delivery pincode and are displayed at checkout before order placement.\n• Some remote locations may experience longer delivery times.\n• We are not responsible for delays caused by natural disasters, strikes, courier service issues, or other events beyond our control.\n• If delivery is not available for your pincode, you will be notified at checkout, and the order cannot be placed.\n\nOnce your order is shipped, you will receive tracking information to monitor your delivery status.`,
  },
  {
    icon: XCircle,
    title: "6. Cancellation & Refund Policy",
    content: `• Orders can be cancelled before they are dispatched (i.e., while the status is "Confirmed" or "Pending Payment").\n• Once an order has been packed or shipped, it cannot be cancelled.\n• To cancel an order, use the "Track Order" page on our website and select the cancellation option.\n• For prepaid orders, refunds will be processed to the original payment method within 5–7 business days after cancellation confirmation.\n• COD orders that are cancelled do not require any refund processing.\n• We reserve the right to cancel orders due to stock unavailability, pricing errors, or suspected fraud. In such cases, any prepaid amount will be fully refunded.\n\nPlease note: We currently do not offer returns or exchanges. All sales are final once the product is delivered. If you receive a damaged or defective product, please contact us within 24 hours of delivery with photos for resolution.`,
  },
  {
    icon: AlertCircle,
    title: "7. Intellectual Property",
    content: `All content on ${SITE_CONFIG.name}, including but not limited to logos, images, product descriptions, designs, text, graphics, and software, is the property of ${SITE_CONFIG.name} and is protected by Indian intellectual property laws.\n\nYou may not reproduce, distribute, modify, or republish any content from this website without our prior written consent. Unauthorized use of any materials may violate copyright, trademark, and other applicable laws.`,
  },
  {
    icon: Scale,
    title: "8. Limitation of Liability",
    content: `To the fullest extent permitted by law, ${SITE_CONFIG.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:\n\n• Your use or inability to use the website.\n• Any products purchased through the website.\n• Any unauthorized access to or alteration of your data.\n• Any delay or failure in delivery.\n\nOur total liability in any claim arising from these terms or your use of the website shall not exceed the amount paid by you for the specific order in question.`,
  },
  {
    icon: Globe,
    title: "9. Governing Law",
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of ${SITE_CONFIG.name} shall be subject to the exclusive jurisdiction of the courts in Sri Ganganagar, Rajasthan, India.\n\nIf any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
  {
    icon: Mail,
    title: "10. Contact Information",
    content: `If you have any questions, concerns, or complaints regarding these Terms and Conditions, please reach out to us:\n\n• Email: ${SITE_CONFIG.contact.email}\n• Phone: ${SITE_CONFIG.contact.phone}\n• WhatsApp: ${SITE_CONFIG.contact.whatsapp}\n• Address: ${SITE_CONFIG.contact.address}\n\nWe aim to respond to all inquiries within 24–48 business hours.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header Banner */}
      <div className="bg-olive border-b border-[#e8e3d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-beige/50 mb-3">
            <Link href="/" className="hover:text-beige transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-beige/80">Terms & Conditions</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-beige/90 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-beige/60 text-sm mt-2 max-w-lg">
            Please read these terms carefully before using our website or placing an order.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Last updated notice */}
        <div className="bg-olive-lighter/50 border border-olive-light/50 rounded-2xl p-4 mb-10 flex items-center gap-3">
          <Shield className="w-5 h-5 text-olive shrink-0" />
          <p className="text-sm text-olive">
            <span className="font-semibold">Last Updated:</span> September 2026. These terms are effective immediately upon your use of the website.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="bg-white rounded-3xl border border-[#e8e4dc] p-6 sm:p-8 shadow-xs hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-olive/10 text-olive flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-display font-bold text-lg text-[#0a0a0a]">
                    {section.title}
                  </h2>
                </div>
                <div className="text-sm text-[#625f56] leading-relaxed whitespace-pre-line pl-[52px]">
                  {section.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#8a8070] mb-4">
            Have questions about our terms? We&apos;re here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`mailto:${SITE_CONFIG.contact.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-olive text-white text-xs font-bold uppercase tracking-wider hover:bg-olive-dark transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Email Us
            </Link>
            <Link
              href="/faqs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-olive text-olive text-xs font-bold uppercase tracking-wider hover:bg-olive hover:text-white transition-colors"
            >
              View FAQs
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
