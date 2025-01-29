import { Outlet, Route, Routes } from "react-router";
import RecentSearches from "./components/RecentSearches";
import Hotels from "./routes/hotels/Hotels";
import SearchBar from "./components/SearchBar";
import HotelDescription from "@/routes/HotelDescription/HotelDescription";
import bg from "/hotel.jpg"
// import bg from "./assets/vacation.jpg";
import Logo from "./components/ui/Logo";
import { Toaster } from 'react-hot-toast'
import Voice from "./routes/Voice";
import Login from "./routes/Login";
import Shining from "./components/chat/Shining";
// import Visualizer from "./routes/Visualizer";

function App() {
  // const imgUrl = bg;
  // const anotherImg = 'https://content.skyscnr.com/m/5283dbe4ac4c9189/original/alexander-kaunas-xEaAoizNFV8-unsplash_CROP.jpg?resize=2880px:1148px&quality=80'
  return (
    <div>
      <nav className="bg-accent">
        <div className="bg-accent text-primary p-8 flex justify-between" style={{ boxShadow: "0px 50px 100px black" }}>
          <Logo />
          {/* <div>
            <Button className="text-secondary">Sign In</Button>
          </div> */}
          {/* <img src={LogoIdea} style={{height:"50px",boxShadow:"1px 1px 5px black"}}/> */}
        </div>
      </nav>
      <div
        style={{
          background: `url(${bg})`,
          // backgroundPosition: "50% 60%",
          backgroundPosition: "top left",
          // backgroundSize: "cover",
          backgroundSize: "100%",
          backgroundRepeat: "no-repeat",
          position: "relative",
          width: "100vw",
          height: "75vh",
          margin: "0 auto",
          boxSizing: "border-box",
          // filter: "brightness(70%)",
        }}
        className="flex flex-col justify-center items-center z-20 bg-no-repeat relative"
      >
        {/* <div className="absolute inset-0 bg-black/20">
          </div> */}
        {/* hotel search form with location, checkin date and checkout date */}
        <div className="w-[60%] flex flex-col gap-4 items-start min-w-fit bg-accent rounded-lg px-10 py-10">
          <div className="text-6xl font-extrabold font-sans text-primary"
            style={{ textShadow: "0px 0px 1px black" }}
          >
            Find hotels with AI
          </div>
          <div>
            {/* <Voice /> */}
          </div>
          <div className="rounded-md">
            <div className="flex flex-col justify-centeritems-center">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
      <div>
        <RecentSearches />
      </div>
    </div>
  );
}

// export default App;

export default function AppRouter() {
  return (
    // TODO: Add error page
    <Routes>
      <Route path="/" element={<>
        <Outlet />
        <Toaster />
      </>}>
        <Route path="/" element={<App />} />
        <Route path="/hello" element={<h1>hello</h1>} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hotel/:id" element={<HotelDescription />} />
        <Route path="/dummy" element={
          <div className="w-full flex border-2 h-screen justify-end bg-black items-center">
            <div className="h-screen w-[30%] text-black">
              <Shining />
            </div>
          </div>
        } />
      </Route>
    </Routes>
  );
}
