import { create } from 'zustand';
import { type Booking } from './useBookingPageStore';


interface BookingHistoryStore {
    bookings: Booking[];
    setBookings: (bookings: Booking[]) => void;
}

export const useBookingHistoryStore = create<BookingHistoryStore>((set) => ({
    bookings: [],
    setBookings: (bookings) => set({ bookings }),
}));

