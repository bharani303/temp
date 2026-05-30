import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative w-full min-w-0">
      
   <input
type="text"
placeholder="Search sofas, beds..."
className="
w-full
min-w-0
py-2
pl-10
pr-3
rounded-full
bg-gray-100
dark:bg-[#2a2a2a]
text-gray-700
dark:text-white
placeholder-gray-500
outline-none
overflow-hidden
truncate
"
/>

      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
      />
    </div>
  );
};

export default SearchBar;

