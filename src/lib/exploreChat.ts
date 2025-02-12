import { useExplorePageStore } from "@/store/useExplorePageStore";
import { useCopilotAction } from "@copilotkit/react-core"; 
import placeholderImg from '/placeholderImg.jpg'

export enum Sender {
    USER = 'USER',
    AGENT = 'AGENT'
}


// a function that sets the state of places
// a functoin that sets the state of events
// put them both in a useChatContext hook and export it
// use the hook

export const INSTRUCTION = `
    YOU ARE SAGE, AN INFORMATION AGENT. HERE ARE YOUR INSTRUCTIONS
    Role: Provide hotel and local area information

    Functions:
    - Answer hotel-related queries (bookings, amenities, services)
    - Find nearby attractions using 'nearbyPlaces' action → display with 'addPlaceFound'
    - Find local events using 'nearbyEvents' action → display with 'addEventFound'

    Guidelines:
    - Keep responses brief since details appear in UI
    - Direct users to check interface for full information
    - Use conversational tone
`

export const useUITools = () => {
    const { addPlace, addEvent } = useExplorePageStore();
    useCopilotAction({
        name: 'addPlaceFound',
        description: 'ADDS THE FOUND PLACE (IF ANY) TO DISPLAY IN UI',
        parameters: [
            {
                name: 'name',
                type: 'string',
                description: 'THE NAME OF THE PLACE TO ADD',
                required: true
            },
            {
                name: 'address',
                type: 'string',
                description: 'THE ADDRESS OF THE PLACE TO ADD',
                required: true
            }, 
            {
                name: 'imageURL',
                type: 'string',
                description: 'THE IMAGE URL OF THE PLACE TO DISPLAY',
                required: false,
            }, 
            {
                name: 'googleMapsLink',
                type: 'string',
                description: 'THE GOOGLE MAPS LINK OF THE LOCATION TO ADD',
                required: true
            }
        ],
        handler: ({ name, address, imageURL, googleMapsLink}) => {
            addPlace({
                name,
                address, 
                'imageURL': imageURL ?? placeholderImg,
                googleMapsLink
            })
            console.log('place added')
        }
    })
    useCopilotAction({
        name: 'addEventFound',
        description: 'ADDS THE FOUND EVENT (IF ANY) TO DISPLAY IN UI',
        parameters: [
            {
                name: 'name',
                type: 'string',
                description: 'THE NAME OF THE EVENT TO ADD',
                required: true
            },
            {
                name: 'description',
                type: 'string',
                description: 'THE DESCRIPTION OF THE EVENT TO ADD',
                required: true
            }, 
            {
                name: 'infoURL',
                type: 'string',
                description: 'THE INFO URL OF THE EVENT TO DISPLAY',
                required: true
            }, 
            {
                name: 'imageURL',
                type: 'string',
                description: 'THE IMAGE URL OF THE EVENT TO DISPLAY',
                required: false
            }
        ],
        handler: ({ name, description, infoURL, imageURL }) => {
            addEvent({
                name,
                description,
                infoURL,
                'imageURL': imageURL ?? placeholderImg
            })
            console.log('event added')
        }
    })
}