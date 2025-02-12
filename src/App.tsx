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
import Login from "./components/auth/Login";
import Shining from "./components/chat/Shining";
import { HashLoader } from "react-spinners";
import { useSocketStore } from "./store/useSocketStore";
import SignUp from "./components/auth/SignUp";
import { useAuthStore } from "./store/useAuthStore";
import { Protected } from "./routes/Protected";
import AuthChecker from "./context/AuthChecker";
import Logout from "./components/auth/Logout";
import Booking from "./routes/Booking";
import BookingHistory from "./routes/Profile/BookingHistory";
import ExploreBooking from "./routes/Profile/ExploreBooking";
// import Visualizer from "./routes/Visualizer";

function App() {
    console.log(import.meta.env.VITE_HTTP_BASE_URL)
    // const imgUrl = bg;
    // const anotherImg = 'https://content.skyscnr.com/m/5283dbe4ac4c9189/original/alexander-kaunas-xEaAoizNFV8-unsplash_CROP.jpg?resize=2880px:1148px&quality=80'
    const { waitingForMessage } = useSocketStore();
    const { authUserEmail } = useAuthStore();
    return (
        <div>
            <nav className="bg-accent">
                <div className="bg-accent text-primary p-8 flex justify-between" style={{ boxShadow: "0px 50px 100px black" }}>
                    <Logo />
                    {/* <div>
            <Button className="text-secondary">Sign In</Button>
          </div> */}
                    {/* <img src={LogoIdea} style={{height:"50px",boxShadow:"1px 1px 5px black"}}/> */}
                    <Logout />
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
                    // width: "100vw",
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
                <div className="w-[60%] flex flex-col gap-4 items-start min-w-fit bg-accent rounded-lg px-0 md:px-10 py-10">
                    <div className="text-6xl font-extrabold font-sans text-primary"
                        style={{ textShadow: "0px 0px 1px black" }}
                    >
            Find hotels with AI
                    </div>
                    <div className="rounded-md">
                        <div className="flex flex-col justify-center items-center">
                            <SearchBar />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <RecentSearches />
            </div>
            {waitingForMessage && <div className="fixed inset-0 top-0 left-0 z-50 flex justify-center items-center bg-secondary/50">
                <HashLoader />
            </div>}
            {!authUserEmail && <div className="fixed inset-0 top-0 left-0 z-50 flex justify-center items-center bg-secondary/70">
                <div className="w-[32rem] min-h-[19rem]">
                    <Outlet />
                </div>
            </div>}
        </div>
    );
}

// export default App;

export default function AppRouter() {
    return (
    // TODO: Add error page
        <Routes>
            <Route path="/" element={<AuthChecker />} >
                <Route path="/" element={<>
                    <Outlet />
                    <Toaster />
                </>}>
                    <Route path="/" element={<App />} >
                        <Route path="/" element={<Protected />}>
                            <Route path="/" element={null} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Route>
                    <Route path="/" element={<Protected />}>
                        <Route path="/hello" element={<h1>hello</h1>} />
                        <Route path="/hotels" element={<Hotels />} />
                        <Route path="/voice" element={<Voice />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/hotel/:id" element={<HotelDescription />} />
                        <Route path="/hotel/booking" element={<Booking />} />
                        <Route path="/profile/bookings" element={<BookingHistory />} />
                        <Route path="/profile/booking/explore/:id" element={<ExploreBooking />} />
                    </Route>
                    <Route path="/dummy" element={
                        <div className="w-full flex border-2 h-screen justify-end bg-black items-center">
                            <div className="h-screen w-full bg-white">
                                <Shining />
                            </div>
                        </div>
                    } />
                </Route>
            </Route>
        </Routes>
    );
}
