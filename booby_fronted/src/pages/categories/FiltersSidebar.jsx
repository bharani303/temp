import { SlidersHorizontal, IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const FiltersSidebar = ({
priceFilter=[],
setPriceFilter,
ratingFilter,
setRatingFilter,
sortBy,
setSortBy
}) => {

  const [openFilter,setOpenFilter] = useState(false);

  // BODY SCROLL LOCK
  useEffect(() => {
    if (openFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openFilter]);

  const priceRanges = [
    [0,100],
    [100,299],
    [300,349],
    [350,649]
  ];

  const handlePrice = (range)=>{
    const exists = priceFilter.some(
      r => r[0]===range[0] && r[1]===range[1]
    );

    if(exists){
      setPriceFilter(
        priceFilter.filter(
          r => !(r[0]===range[0] && r[1]===range[1])
        )
      );
    }else{
      setPriceFilter([...priceFilter,range]);
    }
  };

  const applyFilters = ()=>{
    setOpenFilter(false);
  };

  return (
<>
{/* ================= MOBILE FILTER BAR ================= */}

<div className="
lg:hidden
flex
gap-2
mb-4
overflow-x-auto
whitespace-nowrap
scrollbar-hide
pb-1
">

<button
onClick={()=>setOpenFilter(true)}
className="
flex items-center gap-2
px-4 py-2
rounded-full
border
text-sm
bg-white dark:bg-[#1c1c1c]
border-gray-300
shadow
"
>
<SlidersHorizontal size={14}/>
Filters
</button>


<button
onClick={()=>setOpenFilter(true)}
className="
flex items-center gap-2
px-4 py-2
rounded-full
border
text-sm
bg-white dark:bg-[#1c1c1c]
border-gray-300
shadow
"
>
<IndianRupee size={14}/>
Budget
</button>


<select
value={sortBy}
onChange={(e)=>setSortBy(e.target.value)}
className="
px-1 py-2
rounded-full
border
text-sm
bg-white dark:bg-[#1c1c1c]
border-gray-300
shadow
outline-none
"
>

<option value="">
Sort By
</option>

<option value="lowToHigh">
Price: Low → High
</option>

<option value="highToLow">
Price: High → Low
</option>

</select>

</div>


{/* ================= MOBILE FILTER MODAL (PORTAL) ================= */}

{openFilter && createPortal(

<div
className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-end"
onClick={()=>setOpenFilter(false)}
>

<div
className="w-full bg-white dark:bg-[#1c1c1c] 
text-gray-800 dark:text-gray-200
border border-gray-200 dark:border-[#2a2a2a] 
rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slideUp"
onClick={(e)=>e.stopPropagation()}
>

{/* HEADER */}
<div className="flex justify-between items-center mb-5">
<h2 className="text-lg font-semibold">Filters</h2>
<button onClick={()=>setOpenFilter(false)}>
Close
</button>
</div>

{/* ===== Rating ===== */}
<div className="mb-6">
<h3 className="font-medium mb-3">Ratings</h3>

{[4,3,2].map(rating=>{

const checked = ratingFilter===rating;

return(
<label
key={rating}
className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2 cursor-pointer"
>
<input
type="radio"
checked={checked}
onChange={()=>setRatingFilter(rating)}
className="accent-[#bf6f32]"
/>
{rating} ★ & above
</label>
)

})}
<button
onClick={()=>setRatingFilter(null)}
className="text-xs text-gray-500 underline"
>
Clear rating
</button>
</div>

{/* ===== Budget ===== */}
<div className="mb-6">
<h3 className="font-medium mb-3">Monthly Budget</h3>

{priceRanges.map(range=>{

const checked = priceFilter.some(
r => r[0]===range[0] && r[1]===range[1]
);

return(
<label
key={range[0]}
className="flex items-center gap-2 mb-2 cursor-pointer"
>
<input
type="checkbox"
checked={checked}
onChange={()=>handlePrice(range)}
className="accent-[#bf6f32]"
/>
₹{range[0]} - ₹{range[1]}
</label>
)

})}

</div>
<div>
<h3 className="font-medium mb-3">
Sort By
</h3>

<select
value={sortBy}
onChange={(e)=>setSortBy(e.target.value)}
className="
w-full
p-2
rounded-lg
border
bg-white dark:bg-[#2a2a2a]
"
>
<option value="">Default</option>

<option value="lowToHigh">
Price: Low to High
</option>

<option value="highToLow">
Price: High to Low
</option>

</select>

</div>

{/* APPLY BUTTON */}
<button
onClick={applyFilters}
className="w-full bg-[#bf6f32] text-white py-3 rounded-lg font-semibold"
>
Apply Filters
</button>

</div>

</div>,

document.body
)}


{/* ================= DESKTOP SIDEBAR ================= */}

<div className="
hidden lg:block
w-full
max-w-full
overflow-hidden
bg-white dark:bg-[#1c1c1c]
text-gray-800 dark:text-gray-200
border border-gray-300 dark:border-[#2a2a2a]
p-4
rounded-xl
shadow-sm
space-y-6
">

<h2 className="text-xl font-semibold">Filters</h2>

{/* Rating */}
<div>
<h3 className="font-medium mb-3">Ratings</h3>

{[4,3,2].map(rating=>{

const checked = ratingFilter===rating;

return(
<label key={rating} className="flex items-center gap-2 mb-2 cursor-pointer">
<input
type="radio"
checked={checked}
onChange={()=>setRatingFilter(rating)}
className="accent-[#bf6f32]"
/>
{rating} ★ & above
</label>
)
})}

<button
onClick={()=>setRatingFilter(null)}
className="text-xs text-gray-500 underline"
>
Clear rating
</button>

</div>

{/* Budget */}
<div>
<h3 className="font-medium mb-3">Monthly Budget</h3>

{priceRanges.map(range=>{

const checked = priceFilter.some(
r => r[0]===range[0] && r[1]===range[1]
);

return(
<label key={range[0]} className="flex items-center gap-2 mb-2 cursor-pointer">
<input
type="checkbox"
checked={checked}
onChange={()=>handlePrice(range)}
className="accent-[#bf6f32]"
/>
₹{range[0]} - ₹{range[1]}
</label>
)

})}

</div>
{/* Sort By */}

<div>

<h3 className="font-medium mb-3">
Sort By
</h3>

<select
value={sortBy}
onChange={(e)=>setSortBy(e.target.value)}
className="
w-full
p-2
rounded-lg
border
bg-white dark:bg-[#2a2a2a]
text-gray-800 dark:text-gray-200
border-gray-300 dark:border-[#2a2a2a]
outline-none
"
>

<option value="">
Default
</option>

<option value="lowToHigh">
Price: Low → High
</option>

<option value="highToLow">
Price: High → Low
</option>

</select>

</div>

</div>

</>
  );
};

export default FiltersSidebar;