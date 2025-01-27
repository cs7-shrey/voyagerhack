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