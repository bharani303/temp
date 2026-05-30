import { Briefcase, Users, Sparkles } from "lucide-react";

const Career = () => {
  return (
    <div className="w-[90%] max-w-7xl m-auto mt-16 mb-20">

      {/* HERO SECTION */}

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#5C3D2E] mb-4">
          Join the Homie Team
        </h1>

        <p className="text-gray-600 max-w-2xl m-auto text-lg">
          We are building the future of flexible living. If you love
          design, technology and creating better homes, Homie is the
          place for you.
        </p>
      </div>


      {/* CULTURE SECTION */}

      <div className="grid md:grid-cols-3 gap-8 mb-20">

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center">

          <div className="bg-[#F1E6DE] w-14 h-14 flex items-center justify-center rounded-xl m-auto mb-4">
            <Users className="text-[#8B5E3C]" />
          </div>

          <h3 className="text-lg font-semibold text-[#5C3D2E] mb-2">
            Collaborative Culture
          </h3>

          <p className="text-gray-600">
            Work with creative and passionate people who believe
            in building meaningful products.
          </p>

        </div>


        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center">

          <div className="bg-[#F1E6DE] w-14 h-14 flex items-center justify-center rounded-xl m-auto mb-4">
            <Sparkles className="text-[#8B5E3C]" />
          </div>

          <h3 className="text-lg font-semibold text-[#5C3D2E] mb-2">
            Creative Environment
          </h3>

          <p className="text-gray-600">
            We encourage new ideas and innovative thinking
            to improve everyday living.
          </p>

        </div>


        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center">

          <div className="bg-[#F1E6DE] w-14 h-14 flex items-center justify-center rounded-xl m-auto mb-4">
            <Briefcase className="text-[#8B5E3C]" />
          </div>

          <h3 className="text-lg font-semibold text-[#5C3D2E] mb-2">
            Career Growth
          </h3>

          <p className="text-gray-600">
            Learn, grow and build impactful products with
            real-world experience.
          </p>

        </div>

      </div>


      {/* OPEN POSITIONS */}

      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold text-[#5C3D2E]">
          Open Positions
        </h2>
      </div>


      <div className="space-y-6">

        <div className="flex justify-between items-center bg-[#F8F5F2] p-6 rounded-xl">

          <div>
            <h3 className="font-semibold text-[#5C3D2E]">
              Frontend Developer
            </h3>
            <p className="text-gray-600 text-sm">
              React • Tailwind • UI Development
            </p>
          </div>

          <button className="bg-[#8B5E3C] hover:bg-[#6E462C] text-white px-5 py-2 rounded-lg">
            Apply
          </button>

        </div>


        <div className="flex justify-between items-center bg-[#F8F5F2] p-6 rounded-xl">

          <div>
            <h3 className="font-semibold text-[#5C3D2E]">
              Product Designer
            </h3>
            <p className="text-gray-600 text-sm">
              UI/UX • Figma • Design Systems
            </p>
          </div>

          <button className="bg-[#8B5E3C] hover:bg-[#6E462C] text-white px-5 py-2 rounded-lg">
            Apply
          </button>

        </div>


        <div className="flex justify-between items-center bg-[#F8F5F2] p-6 rounded-xl">

          <div>
            <h3 className="font-semibold text-[#5C3D2E]">
              Operations Manager
            </h3>
            <p className="text-gray-600 text-sm">
              Logistics • Customer Experience
            </p>
          </div>

          <button className="bg-[#8B5E3C] hover:bg-[#6E462C] text-white px-5 py-2 rounded-lg">
            Apply
          </button>

        </div>

      </div>


      {/* CTA */}

      <div className="text-center mt-16">

        <p className="text-gray-600 mb-4">
          Don't see a role that fits you?
        </p>

        <button className="bg-[#8B5E3C] hover:bg-[#6E462C] text-white px-8 py-3 rounded-lg font-medium">
          Send Resume
        </button>

      </div>

    </div>
  );
};

export default Career;