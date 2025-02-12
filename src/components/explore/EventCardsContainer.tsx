import { useExplorePageStore } from "@/store/useExplorePageStore";
import EventCard from "../ui/EventCard";

// const events = [
//     {
//         'name': 'FinTech Festival India',
//         'description': 'The upcoming FinTech Festival India 2025 will take place from May 7-9, 2025, at Yashobhoomi (IICC) in Dwarka, New Delhi. This event aims to inspire, educate, and connect global fintech leaders, offering a platform for the fintech community to collaborate and innovate. The event will feature a series of keynotes, panel discussions, and workshops, as well as an exhibition showcasing the latest fintech products and services.',
//         'infoURL': 'https://www.google.com',
//         'imageURL': 'https://www.eventalways.com/media/eventgallery/large/gallery-image-1694585197.jpg'
//     }, 
//     {
//         'name': 'Event 2',
//         'description': 'This is a description for Event 2',
//         'infoURL': 'https://www.google.com',
//         'imageURL': 'https://plus.unsplash.com/premium_photo-1661286678499-211423a9ff5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFydHklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHwwfHw%3D&auto=format&fit=crop&h=2000'
//     },
//     {
//         'name': 'Event 3',
//         'description': 'This is a description for Event 3',
//         'infoURL': 'https://www.google.com',
//         'imageURL': 'https://plus.unsplash.com/premium_photo-1661286678499-211423a9ff5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFydHklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHwwfHw%3D&auto=format&fit=crop&h=2000'
//     },
//     {
//         'name': 'Event 4',
//         'description': 'This is a description for Event 4',
//         'infoURL': 'https://www.google.com',
//         'imageURL': 'https://plus.unsplash.com/premium_photo-1661286678499-211423a9ff5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFydHklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHwwfHw%3D&auto=format&fit=crop&h=2000'
//     },
// ]

const EventCardsContainer = () => {
    const { events } = useExplorePageStore();
    return (
        <div className='flex gap-4 overflow-x-auto scrollbar-thin'>
            {events.map((event, index) => (
                <div key={index} className='rounded-md my-2 h-[450px] [box-shadow:0px_0px_50px_rgb(220,220,220)] bg-white min-h-min'>
                    <EventCard 
                        name={event.name}
                        description={event.description}
                        infoURL={event.infoURL}
                        imageURL={event.imageURL}
                    />
                </div>
            ))}
        </div>
    )
}
export default EventCardsContainer;