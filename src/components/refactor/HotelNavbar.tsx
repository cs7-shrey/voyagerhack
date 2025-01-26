// const HotelNavbar = () => { 
//     return (
//         <nav className="amenity-nav relative z-50">
//             <div className="nav-links">
//                 <div>Room Types</div>
//                 <div> Amenities</div>
//                 <div>Reviews</div>
//                 <div>Location</div>
//                 <div>Similar Hotels</div>
//             </div>
//         </nav>
//     )
// }
// export default HotelNavbar;

const HotelNavbar = () => { 
    return (
        <nav className="w-full sticky top-24 h-16 mt-6 bg-primary z-[45] hidden md:block">
            <div className="h-full w-3/5 ml-[10%] flex gap-0.5 bg-white lg:w-3/5 md:w-3/4">
                {["Room Types", "Amenities", "Reviews", "Location", "Similar Hotels"].map((item) => (
                    <div 
                        key={item}
                        className="flex-1 flex items-center justify-center 
                                 text-gray-500 font-semibold text-base 
                                 border-t-[5px] border-b-[5px] border-white 
                                 cursor-pointer
                                 hover:border-b-accent hover:text-accent hover:bg-white
                                 transition-all duration-200"
                    >
                        {item}
                    </div>
                ))}
            </div>
        </nav>
    )
}

export default HotelNavbar;

// .amenity-nav{
//     width:100%;
//     position:sticky;
//     top:100px;
//     height:65px;
//     /* box-shadow:5px 0px 5px rgb(168, 168, 168); */
//     margin-top:25px;
//     /* background: linear-gradient(to right, white,white, white,lightgrey); */
//     /* background: black */
//     background-color: rgb(226, 224, 224);
//     z-index: 45;
// }
// .amenity-nav .nav-links{
//     height:100%;
//     width:60%;
//     /* border:1px solid black; */
//     margin-left:10%;
//     display:flex;
//     gap:0.5%;
//     background-color: white;
// }
// .amenity-nav .nav-links div{
//     flex:1;
//     border-top:5px solid white;
//     border-bottom:5px solid white;
//     color:rgb(144, 142, 142);
//     font-weight:600;
//     font-size:1rem;
//     display:flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 8px;
//     /* background:linear-gradient(to bottom right,white,white, rgb(244, 244, 244),lightgrey) */
// }
// .amenity-nav .nav-links div:hover{
//     border-bottom:5px solid var(--accent);
//     background:white;
//     cursor: pointer;
//     color:var(--accent);
// }

// @media (max-width:900px){
//     .amenity-nav .nav-links{
//         width:75%;
//     }
// }
// @media (max-width:725px){
//     .amenity-nav{
//         display:none;
//     }
// }
