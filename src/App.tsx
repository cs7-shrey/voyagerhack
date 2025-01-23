import { Route, Routes } from "react-router";
import { Button } from "./components/ui/button";
import RecentSearches from "./components/RecentSearches";
import Hotels from "./routes/hotels/Hotels";
import SearchBar from "./components/SearchBar";

import HotelDescription from "./pages/HotelDescription"
import bg from "/hotel.jpg"
// import bg from "./assets/vacation.jpg";
import Logo from "./components/ui/Logo";
import Voice from "./routes/Voice";
import Login from "./routes/Login";
// import Visualizer from "./routes/Visualizer";

function App() {
  // const imgUrl = bg;
  // const anotherImg = 'https://content.skyscnr.com/m/5283dbe4ac4c9189/original/alexander-kaunas-xEaAoizNFV8-unsplash_CROP.jpg?resize=2880px:1148px&quality=80'
  return (
    <div>
      <nav className="bg-accent">
        <div className="bg-accent text-primary p-8 flex justify-between" style={{backgroundColor:"#001843",zIndex:"900",boxShadow:"0px 50px 100px black"}}>
          {/* <Logo /> */}
          {/* <div>
            <Button className="text-secondary">Sign In</Button>
          </div> */}
        </div>
      </nav>
      <div className="relative z-10">
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
          <div className="absolute inset-0 bg-black/20">
          </div>
          {/* hotel search form with location, checkin date and checkout date */}
          <div className="w-[60%] flex flex-col gap-4 items-start min-w-fit">
          <div className="text-6xl font-extrabold font-sans text-primary"
            style={{textShadow:"0px 0px 1px black"}}
            >
              Find hotels with <span style={{textShadow:"0px 0px 20px white"}}>AI</span>
            </div>
            <div>
              {/* <Voice /> */}
            </div>
            <div className="rounded-md">
              <div className="flex flex-col justify-center items-center">
                <SearchBar />
              </div>
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
      <Route path="/" element={<App />} />
      <Route path="/hello" element={<h1>hello</h1>} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/voice" element={<Voice />} />
      <Route path="/hotel-desc" element={<HotelDescription/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/dummy" element={
        <div className="sm:flex lg:grid lg:grid-cols-12 md:grid-cols-5">
          <div className="md:col-span-4 lg:col-span-5 lg:col-start-4 flex justify-center p-4">
            <SearchBar />
          </div>
        </div>
        } />
    </Routes>
  );
}
