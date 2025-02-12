import { CopilotKit } from "@copilotkit/react-core";
import { useCopilotChat } from "@copilotkit/react-core";
import { useCopilotAction } from "@copilotkit/react-core"; 
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { useCopilotContext } from "@copilotkit/react-core";
import { useEffect, useState } from "react";
import "@copilotkit/react-ui/styles.css";

import { CopilotPopup } from "@copilotkit/react-ui";
 
export function YourApp() {
    return (
        <>
            <CopilotPopup
                instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
                labels={{
                    title: "Popup Assistant",
                    initial: "Need any help?",
                }}
            />
        </>
    );
}
interface location {
    locationName: string;
    locationAddress: string;
    googleMapsLink: string;
}
function CustomChatInterface() {
    const {
        visibleMessages,
        appendMessage,
        stopGeneration,
        isLoading,
    } = useCopilotChat();
    const [locations, setLocations] = useState<location[]>([]);

    // Define Copilot action
    useCopilotAction({
        name: "addLocationFound",
        description: "Add a new location to the list",
        parameters: [
            {
                name: "locationName",
                type: "string",
                description: "The name of the location to add",
                required: true,
            },
            {
                name: "locationAddress",
                type: "string",
                description: "The address of the location to add",
                required: true,
            },
            {
                name: "googleMapsLink",
                type: "string",
                description: "The Google Maps link of the location to add",
                required: true,
            }
        ],
        handler: async ({ locationName, locationAddress, googleMapsLink }) => {
            setLocations([...locations, { locationName, locationAddress, googleMapsLink }]);
        },
    });
    const { setChatInstructions } = useCopilotContext();
 
    useEffect(() => {
        setChatInstructions("WHATEVER DATA YOU RECEIVE, DISPLAY IT IN THE UI LIST USING addLocationFound ACTION");
    }, [setChatInstructions]);

    const [inputValue, setInputValue] = useState("");
    useEffect(() => {
        console.log(visibleMessages);
    }, [visibleMessages]);

    const sendMessage = async (content: string) => {
        if (content.trim()) {
            await appendMessage(new TextMessage({ content, role: Role.User }));
            setInputValue("");
        }
        // visibleMessages[0].
    };
 
    return (
        <div className="flex">
            <div className="w-1/2 h-screen bg-gray-100">
                <ul className="flex flex-col p-4">
                    {locations.map((location, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg mb-4">
                            name: {location.locationName}
                            address: {location.locationAddress}
                            <a href={location.googleMapsLink} target="_blank">Google Maps</a>
                        </div>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col w-1/2 h-screen max-w-3xl mx-auto p-4">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {visibleMessages.map((message, index) => {
                        if (!message.isTextMessage()) {
                            return null;
                        }
                        return  <div
                            key={index}
                            className={`p-4 rounded-lg ${
                                (message as TextMessage).role === Role.Assistant
                                    ? "bg-blue-100 ml-auto max-w-[80%]"
                                    : "bg-gray-100 mr-auto max-w-[80%]"
                            }`}
                        >
                            <p>{(message as TextMessage).content}</p>
                        </div>
                    })}
                    {isLoading && (
                        <div className="bg-gray-100 p-4 rounded-lg mr-auto max-w-[80%]">
                            <p>Thinking...</p>
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                sendMessage(inputValue);
                            }
                        }}
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={() => sendMessage(inputValue)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                    {isLoading && (
                        <button
                            onClick={stopGeneration}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Stop
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <CopilotKit runtimeUrl={import.meta.env.VITE_COPILOT_RUNTIME_URL}>
            <CustomChatInterface />
        </CopilotKit>
    );
}
