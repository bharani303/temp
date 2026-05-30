import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does the security deposit work?",
    answer:
      "We take a minimal security deposit which is completely refundable once the products are returned in good condition. Usually, it's equivalent to 1-2 months of rent.",
  },
  {
    question: "What if I damage the furniture?",
    answer:
      "Minor wear and tear is covered. For major damages, repair charges may be deducted from the security deposit after evaluation.",
  },
  {
    question: "Can I swap my furniture mid-subscription?",
    answer:
      "Yes, you can swap furniture after the minimum lock-in period. Swap options are flexible and easy to schedule.",
  },
  {
    question: "Is delivery & assembly free ?",
    answer:
      "Yes, delivery & assembly are completely free for all orders.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel anytime after the lock-in period through your dashboard or by contacting support.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 px-4 md:py-5 md:px-16 bg-[#F8F5F2] dark:bg-[#111] transition-colors duration-300">

      {/* Heading */}
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold text-[#4B2E2B] dark:text-white mb-3 md:mb-4">
          Got Questions?
        </h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Everything you need to know about renting with Homie.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="bg-white dark:bg-[#1c1c1c] rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-[#2a2a2a] transition duration-300"
            >

              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 md:p-6 text-left"
              >
                <span className="text-sm md:text-lg font-semibold text-[#4B2E2B] dark:text-white pr-3">
                  {faq.question}
                </span>

                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#8B5E3C]/10 dark:bg-[#8B5E3C]/20">
                  {isOpen ? (
                    <Minus size={16} className="text-[#8B5E3C]" />
                  ) : (
                    <Plus size={16} className="text-[#8B5E3C]" />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                className={`px-4 md:px-6 overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-60 pb-4 md:pb-6" : "max-h-0"
                }`}
              >
                <p className="text-xs md:text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="mt-10 max-w-4xl mx-auto">
        <div className="bg-[#8B5E3C] dark:bg-gradient-to-b from-[#5C3A21] to-[#3e2717] rounded-2xl md:rounded-[30px] py-6 md:py-8 px-4 md:px-16 text-center text-white shadow-lg">

          <h3 className="text-xl md:text-4xl font-bold mb-4 md:mb-6">
            Still have more questions?
          </h3>

          <p className="text-sm md:text-base text-white/80 mb-6 md:mb-10">
            Our support team is available 24/7 to help you out.
          </p>

          <button className="bg-white text-[#8B5E3C] px-6 md:px-10 py-2 md:py-4 text-sm md:text-base rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition duration-300">
            Chat with Us
          </button>

        </div>
      </div>

    </section>
  );
};

export default FAQSection;