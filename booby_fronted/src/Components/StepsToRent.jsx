import { Search, ShieldCheck, Truck, RefreshCw } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Browse & Select",
    description: "Pick from 1000+ premium furniture pieces.",
    icon: <Search size={22} className="text-blue-600" />,
    bg: "bg-blue-50",
  },
  {
    id: 2,
    title: "KYC & Security",
    description: "Quick KYC with a small refundable deposit.",
    icon: <ShieldCheck size={22} className="text-purple-600" />,
    bg: "bg-purple-50",
  },
  {
    id: 3,
    title: "Free Delivery",
    description: "Delivery & assembly within 48 hours.",
    icon: <Truck size={22} className="text-orange-600" />,
    bg: "bg-orange-50",
  },
  {
    id: 4,
    title: "Enjoy & Swap",
    description: "Swap furniture anytime after 6 months.",
    icon: <RefreshCw size={22} className="text-green-600" />,
    bg: "bg-green-50",
  },
];

const HowItWorksSection = () => {
  return (
<section className="py-10 md:py-14 px-4 md:px-10 bg-[#8b5e3b] dark:bg-gradient-to-b from-[#5C3A21] to-[#3e2717]">

  {/* Heading */}

  <div className="text-center mb-10">

    <h2 className="text-xl md:text-3xl font-bold text-white">
      How Homie Works
    </h2>

    <p className="text-xs md:text-sm text-white/80 mt-2">
      Renting furniture is simple in just four steps
    </p>

  </div>

  {/* Steps */}

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">

    {steps.map((step) => (

      <div
        key={step.id}
        className="relative bg-white dark:bg-[#1c1c1c] rounded-xl p-4 md:p-5 text-center shadow-sm group transition hover:shadow-md hover:-translate-y-1"
      >

        {/* Step Number */}

        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#bf6f32] text-white text-xs font-semibold rounded-full flex items-center justify-center shadow">
          {step.id}
        </div>

        {/* Icon */}

        <div
          className={`w-12 h-12 mx-auto flex items-center justify-center rounded-lg mt-3 ${step.bg}`}
        >
          {step.icon}
        </div>

        {/* Title */}

        <h3 className="mt-3 text-sm md:text-base font-semibold text-gray-800 dark:text-white">
          {step.title}
        </h3>

        {/* Description */}

        <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">
          {step.description}
        </p>

      </div>

    ))}

  </div>

</section>
  );
};

export default HowItWorksSection;