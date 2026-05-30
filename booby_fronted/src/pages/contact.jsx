import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="w-[90%] max-w-6xl m-auto mt-16 mb-20">

      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#5C3D2E] mb-3">
          Contact Homie
        </h1>
        <p className="text-gray-600">
          Have questions about rentals, delivery or furniture plans?  
          Our team is here to help you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">

        {/* Contact Form */}
        <div className="bg-[#F8F5F2] p-8 rounded-2xl shadow-md">

          <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-6">
            Send us a message
          </h2>

          <form className="space-y-5">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            ></textarea>

            <button
              type="submit"
              className="bg-[#8B5E3C] hover:bg-[#6E462C] text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Send Message
            </button>

          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">

          <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">

            <div className="bg-[#F1E6DE] p-4 rounded-lg">
              <Mail className="text-[#8B5E3C]" size={24} />
            </div>

            <div>
              <h3 className="font-semibold text-[#5C3D2E]">Email</h3>
              <p className="text-gray-600">support@homie.com</p>
            </div>

          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">

            <div className="bg-[#F1E6DE] p-4 rounded-lg">
              <Phone className="text-[#8B5E3C]" size={24} />
            </div>

            <div>
              <h3 className="font-semibold text-[#5C3D2E]">Phone</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>

          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">

            <div className="bg-[#F1E6DE] p-4 rounded-lg">
              <MapPin className="text-[#8B5E3C]" size={24} />
            </div>

            <div>
              <h3 className="font-semibold text-[#5C3D2E]">Office</h3>
              <p className="text-gray-600">
                New Delhi, India
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;