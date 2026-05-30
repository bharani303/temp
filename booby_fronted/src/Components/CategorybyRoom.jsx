import { ArrowUpRight, Sofa, BedDouble, Briefcase, Utensils } from "lucide-react";

const rooms = [
  {
    id: 1,
    title: "Living Room",
    icon: <Sofa size={16} />,
    image: "/src/Assets/categorybyroom/pexels-pixabay-276528.jpg",
    items: ["Sectional Sofas", "TV Units", "Coffee Tables", "Recliners"],
  },
  {
    id: 2,
    title: "Bedroom",
    icon: <BedDouble size={16} />,
    image: "/src/Assets/categorybyroom/pexels-introspectivedsgn-9582660.jpg",
    items: ["King Size Beds", "Queen Size Beds", "Wardrobes", "Side Tables"],
  },
  {
    id: 3,
    title: "Home Office",
    icon: <Briefcase size={16} />,
    image: "/src/Assets/categorybyroom/pexels-mateusz-haberny-806274365-19238352.jpg",
    items: ["Study Tables", "Office Chairs", "Bookshelves", "Workstations"],
  },
  {
    id: 4,
    title: "Dining & More",
    icon: <Utensils size={16} />,
    image: "/src/Assets/categorybyroom/pexels-curtis-adams-1694007-3773583.jpg",
    items: ["4 Seater Sets", "6 Seater Sets", "Bar Units", "Sideboards"],
  },
];

const RoomCategorySection = () => {
  return (
    <section className="py-4 px-6 md:px-16 bg-[#F6F1EC] dark:bg-[#111]">
      
      {/* Heading */}
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold text-[#9c6f4f] mb-3">
          Browse Furniture Combos
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
          Find the perfect pieces for every corner of your home with our curated room collections.
        </p>
      </div>

      {/* Card Container */}
      <div
        className="
          flex gap-4 overflow-x-auto pb-4
          snap-x snap-mandatory
          md:grid md:grid-cols-2 lg:grid-cols-4
          md:gap-8 md:overflow-visible md:snap-none
        "
      >
        {rooms.map((room) => (
          <div
            key={room.id}
            className="
              min-w-[220px]
              md:w-[320px]
              bg-white rounded-xl shadow-sm
              overflow-hidden group cursor-pointer
              hover:shadow-md transition duration-300
              snap-start
            "
          >
            {/* Image */}
            <div className="relative h-32 md:h-44 overflow-hidden">
              <img
                src={room.image}
                alt={room.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2 left-2 bg-white dark:bg-[#1c1c1c] p-2 rounded-lg shadow">
                {room.icon}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm md:text-lg font-semibold text-[#4B2E2B] ">
                  {room.title}
                </h3>
                <ArrowUpRight size={14} className="text-gray-500" />
              </div>

              <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-[11px] md:text-sm mb-4">
                {room.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>

              <div className="flex justify-center">
                <button
                  className="
                    flex items-center gap-1 px-4 py-1.5
                    bg-[#8B5E3C] text-white text-[11px] md:text-sm font-semibold
                    rounded-full shadow-sm
                    hover:bg-[#6F472F] transition
                  "
                >
                  Explore
                  <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default RoomCategorySection;