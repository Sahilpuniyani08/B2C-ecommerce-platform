"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How do I place an order?",
    answer: `Placing an order on ${SITE_CONFIG.name} is simple! Browse our collection on the Shop page, select the product you love, choose your preferred size and color, and click "Add to Cart." Once you're ready, go to your cart, review your items, and proceed to checkout. Fill in your delivery details, check delivery availability for your pincode, choose your payment method (Cash on Delivery or Online Payment), and confirm your order. You'll receive your order number instantly!`,
  },
  {
    question: "What payment methods do you accept?",
    answer: `We accept two convenient payment options:\n\n• Cash on Delivery (COD): Pay in cash when your order arrives at your doorstep. COD availability depends on your delivery pincode.\n\n• Online Payment via Razorpay: Pay securely using UPI, Credit/Debit Cards, Net Banking, or digital wallets. All transactions are encrypted and processed through Razorpay's secure payment gateway. We never store your card or banking details.`,
  },
  {
    question: "How can I track my order?",
    answer: `You can track your order anytime using the "Track Order" page on our website. Simply enter your Order Number (e.g., ORD-XXXXX) and the mobile number you used while placing the order. You'll see the complete status of your order — from confirmation to delivery — along with estimated delivery dates. If your order has been shipped, you can also monitor it through the courier tracking link.`,
  },
  {
    question: "What is the delivery time and how are charges calculated?",
    answer: `Delivery typically takes 3–7 business days depending on your location. Delivery charges are calculated based on your pincode and are displayed during checkout before you place the order.\n\nBefore placing an order, you can check if delivery is available for your pincode and see the exact delivery charge by entering your pincode on the checkout page. Some remote areas may have higher delivery charges or longer delivery times. If delivery is not available for your area, the website will let you know, and you can reach out to us on WhatsApp for alternative arrangements.`,
  },
  {
    question: "Can I cancel my order?",
    answer: `Yes, you can cancel your order as long as it hasn't been dispatched yet. Orders in "Confirmed" or "Pending Payment" status can be cancelled directly from the "Track Order" page.\n\nOnce an order has been packed or shipped, it cannot be cancelled. For prepaid orders, refunds are processed to your original payment method within 5–7 business days after cancellation is confirmed. COD orders that are cancelled don't require any refund processing.\n\nPlease note: We currently do not offer returns or exchanges once a product is delivered. If you receive a damaged or defective item, contact us within 24 hours of delivery with photos for a quick resolution.`,
  },
  {
    question: "How do I contact customer support?",
    answer: `We're always here to help! You can reach us through:\n\n• WhatsApp: Click the green WhatsApp button on the bottom-right of any page, or message us directly at ${SITE_CONFIG.contact.whatsapp}\n• Email: ${SITE_CONFIG.contact.email}\n• Phone: ${SITE_CONFIG.contact.phone}\n\nOur support team responds within 24 hours on business days. For urgent order-related issues (wrong product, damaged item, missing delivery), WhatsApp is the fastest way to get help!`,
  },
];

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-olive/30 shadow-md"
          : "border-[#e8e4dc] shadow-xs hover:border-olive/20 hover:shadow-sm"
      }`}
    >
      <button
        id={`faq-trigger-${index}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer"
      >
        <div className="flex items-center gap-4 min-w-0">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors duration-300 ${
              isOpen
                ? "bg-olive text-white"
                : "bg-[#f5f0e8] text-olive"
            }`}
          >
            {index + 1}
          </span>
          <h3
            className={`font-display font-bold text-sm sm:text-base transition-colors duration-300 ${
              isOpen ? "text-olive" : "text-[#0a0a0a]"
            }`}
          >
            {item.question}
          </h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-olive transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-trigger-${index}`}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? "600px" : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[68px] sm:pl-[76px]">
          <div className="text-sm text-[#625f56] leading-relaxed whitespace-pre-line">
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const whatsappNumber = SITE_CONFIG.contact.whatsapp.replace(/\+/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi, I have a question about ${SITE_CONFIG.name}!`
  )}`;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header Banner */}
      <div className="bg-olive border-b border-[#e8e3d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-beige/50 mb-3">
            <Link href="/" className="hover:text-beige transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-beige/80">FAQs</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-beige/90 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-beige/60 text-sm mt-2 max-w-lg">
            Find answers to the most common questions about shopping, payments,
            delivery, and more.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Info badge */}
        <div className="bg-olive-lighter/50 border border-olive-light/50 rounded-2xl p-4 mb-10 flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-olive shrink-0" />
          <p className="text-sm text-olive">
            Can&apos;t find what you&apos;re looking for? Reach out to us on
            WhatsApp for instant help!
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <AccordionItem
              key={idx}
              item={item}
              index={idx}
              isOpen={openIndex === idx}
              onToggle={() =>
                setOpenIndex(openIndex === idx ? null : idx)
              }
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 bg-olive rounded-3xl p-8 sm:p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-7 h-7 text-beige" />
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-beige mb-2">
            Still have questions?
          </h2>
          <p className="text-beige/60 text-sm mb-6 max-w-md mx-auto">
            Our support team is just a message away. Chat with us on WhatsApp
            for quick and friendly assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1da851] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </a>
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-beige/30 text-beige text-xs font-bold uppercase tracking-wider hover:bg-beige/10 transition-colors"
            >
              Terms & Conditions
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
