import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="bg-white dark:bg-[#111] text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300">

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
          },
        }}
      />

      <AppRoutes />

    </div>
  );
}
export default App;




























// import AppRoutes from "./routes/AppRoutes";
// import { Toaster } from "react-hot-toast";

// function App() {
//   return (
//     <>
//       <Toaster
//         position="top-center"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             fontSize: "14px",
//           },
//         }}
//       />

//       <AppRoutes />
//     </>
//   );
// }

// export default App;