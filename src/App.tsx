import { Route, Routes, useNavigate } from "react-router";
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";
import SearchDropdown from "./components/SearchDropdown";
import RecentSearches from "./components/RecentSearches";
import Hotels from "./routes/hotels/Hotels";
import { useSearchStore } from "./store/useSearchStore";

// import bg from "./assets/vacation.jpg";
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
function App() {
  const { queryTerm, setQueryTerm } = useSearchStore();
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const navigate = useNavigate();
  useEffect(() => {
    console.log("checkIn", checkIn);
  }, [checkIn]);
  return (
    <div>
      <nav className="bg-accent">
        <div className="bg-accent text-primary p-8 flex justify-between">
          <div className="text-xl font-bold font-mono flex items-center">
            H.A.V.E.N
          </div>
          <div>
            <Button className="text-secondary">Sign In</Button>
          </div>
        </div>
      </nav>
      <div>
        <div
          style={{
            background: `url(https://content.skyscnr.com/m/5283dbe4ac4c9189/original/alexander-kaunas-xEaAoizNFV8-unsplash_CROP.jpg?resize=2880px:1148px&quality=80)`,
            // backgroundPosition: "50% 60%",
            backgroundPosition: "top left",
            // backgroundSize: "cover",
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat",
            position: "relative",
            width: "100%",
            height: "75vh",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
          className="flex flex-col justify-center items-center z-auto bg-no-repeat relative"
        >
          {/* hotel search form with location, checkin date and checkout date */}
          <div className="w-[60%] flex flex-col gap-4">
            <div className="text-6xl font-extrabold font-sans text-primary">
              Find hotels with AI
            </div>
            <div className="bg-accent rounded-md">
              <div className="flex flex-col justify-center items-center p-4">
                <div className="flex flex-row justify-center items-center m-2 gap-2">
                  <SearchDropdown />
                  <input
                    type="date"
                    placeholder="Check-in Date"
                    className="px-4 py-2 rounded-md"
                    value={formatDate(checkIn)}
                    onChange={(e) => setCheckIn(new Date(e.target.value))}
                  />
                  <input
                    type="date"
                    placeholder="Check-out Date"
                    className="px-4 py-2 rounded-md"
                    value={formatDate(checkOut)}
                    onChange={(e) => setCheckOut(new Date(e.target.value))}
                  />
                </div>
                <button 
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/hotels?q=${encodeURIComponent(queryTerm.query)}&type=${queryTerm.type}`);
                  }}
                >
                  Search
                </button>
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
    </Routes>
  );
}
