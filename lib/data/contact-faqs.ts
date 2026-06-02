export type ContactFaq = {
  question: string;
  answer: string;
};

export const CONTACT_FAQS: ContactFaq[] = [
  {
    question: "How do I place an order on Kachu Kart?",
    answer:
      "Open any product page and click the WhatsApp order button. Share your required quantity, delivery location, and preferred timeline. Our team confirms stock and pricing quickly.",
  },
  {
    question: "Do you support wholesale and bulk orders?",
    answer:
      "Yes. Kachu Kart is built for wholesale buying and manufacturer sourcing. MOQ is shown on each product and custom quantities can be discussed through support.",
  },
  {
    question: "How long does delivery usually take?",
    answer:
      "Delivery time depends on product type and destination. Most orders are confirmed with an estimated delivery window during order verification.",
  },
  {
    question: "Can I request products not listed in the catalog?",
    answer:
      "Yes. Send your product requirements to our support team and we will help source options from trusted factories in our network.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Available payment options are shared at checkout confirmation. For larger orders, payment terms can be discussed directly with our sales team.",
  },
  {
    question: "How do returns or issue reports work?",
    answer:
      "If there is a quality or delivery issue, contact support with order details and photos. We review each case promptly and guide the resolution process.",
  },
];
