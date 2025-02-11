import { create } from 'zustand';

export interface Booking {
  booking_id: number;
  check_in: string;
  check_out: string;
  booked_at: string;
  hotel: {
    name: string;
    location: string;
    hotel_star: number;
    images: string[];
    user_rating: number;
  };
  room_type: {
    room_type_name: string;
    max_adults: number;
  };
  rate_plan: {
    base_fare: number;
    total_discount: number;
    taxes: number;
  };
}

type BookingPage = Booking;

interface BookingPageStore {
  bookingPageState: BookingPage | null;
  setBookingPageState: (bookingPageState: BookingPage) => void;
}

export const useBookingPageStore = create<BookingPageStore>((set) => ({
    bookingPageState: null,
    setBookingPageState: (bookingPageState) => set({ bookingPageState }),
}));