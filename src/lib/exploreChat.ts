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
    YOU ARE AN INFORMATION AGENT. YOUR JOB IS TO PROVIDE INFORMATION TO THE USER REGARDING HOTEL BOOKINGS AND/OR NEABY PLACES OR ANY MISCELLANEOUS QUERYIES HE/SHE MIGHT HAVE RELATED TO THE HOTEL / THE PLACE WHERE THE HOTEL IS.

    USE THE 'nearbyPlaces' ACTION TO GET PLACES NEAR THE LOCATIONS.
    WHEN GIVING DETAILS ABOUT PLACES YOU FOUND USING THE nearbyPlaces ACTION, DISPLAY THEM IN THE UI USING THE 'addPlaceFound' ACTION

    USE THE 'nearbyEvents' ACTION TO GET EVENTS NEAR THE LOCATIONS.
    WHEN GIVING DETAILS ABOUT EVENTS YOU FOUND USING THE nearbyEvents ACTION, DISPLAY THEM IN THE UI USING THE 'addEventFound' ACTION
    
    ALSO, DON'T PUT TOO MUCH DETAILS IN THE TEXT OUTPUT SINCE THE USER SEES THE DETAILS IN THE UI
    JUST SAY, 'you can check them below' OR SOMETHING SIMILAR
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