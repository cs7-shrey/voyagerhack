import enum

class HotelStar(enum.Enum):
    One = "1"
    Two = "2"
    Three = "3"
    Four = "4"
    Five = "5"
    
class UserRating(enum.Enum):
    Zero = "0"
    Three = "3"
    Four = "4"
    FourPointFive = "4.5"
    
class PropertyType(enum.Enum):
    Hotel = "Hotel"
    Apartment = "Apartment"
    Resort = "Resort"
    GuestHouse = "Guest House"
    Hostel = "Hostel"
    Homestay = "Homestay"
    Villa = "Villa"
    Camp = "Camp"
    
class HotelAmenityCode(enum.Enum):
    AirConditioning = "AC",
    AirportTransfers = "AIRTRANS",
    Bar = "BAR",
    Elevator = "ELVTR",
    Gym = "GYM",
    HouseKeeping = "HKPNG",
    Internet = "INTRNT",
    Laundry = "LNDRY",
    Parking = "PRKG",
    Restaurant = "RSTRNT"

class RoomAmenityCode(enum.Enum):
    AirConditioning = "AC",
    AirPurifier = "AIRPRF",
    Heater = "HTR",
    HouseKeeping = "HKPNG",
    InterConnectedRooms = "CNCTD",
    Laundry = "LNDRY",
    MineralWater = "MNRLWTR",
    RoomService = "RMSRVC",
    SmokingRoom = "SMKGRM",
    StudyRoom = "STDYRM",
    Internet = "INTRNT"

class StatusCode(enum.Enum):
    Success = "200"
    AdditionalInfo = "300"
    Error = "400"