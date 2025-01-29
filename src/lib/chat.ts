import { useHotelPageChatStore } from "@/store/useHotelPageChatStore";

export enum ChatMode {
    Text = "text",
    Voice = "voice"
}
export async function textChat(mainWs: WebSocket, userMessage: string): Promise<string | void> {
    // connect to the web socket and send the hotel data
    if (mainWs.readyState !== WebSocket.OPEN) {
        return
    }
    const { setWaitingForMessage } = useHotelPageChatStore.getState(); 
    let llmMessage = '';
    try {
        await mainWs.send(ChatMode.Text)
        setWaitingForMessage(true)
        await new Promise((resolve, reject) => {
            mainWs.onmessage = (serverMessage) => {
                console.log(serverMessage) // TODO: remove this later
                llmMessage = serverMessage.data
                resolve(true)
            }
            mainWs.send(userMessage)
            mainWs.onerror = () => {
                console.log("an error occured while sending text message")
                resolve(false)
            }
            mainWs.onclose = () => {
                console.log("text chat ws closed")
                reject(false)
            }        
        })
    } catch (error) {
        console.log("Error sending text message to llm", error)
    }
    finally {
        setWaitingForMessage(false)
    }
    return llmMessage;
}

export async function voiceChat(mainWs: WebSocket): Promise<string | void> {
    // TBD
    if (mainWs.readyState !== WebSocket.OPEN) {
        return
    }
    const { setWaitingForMessage } = useHotelPageChatStore.getState(); 
    let llmMessage = '';
    try {
        await mainWs.send(ChatMode.Voice)
        setWaitingForMessage(true)
        await new Promise((resolve, reject) => {
            const { messages: prevMessages, setMessages } = useHotelPageChatStore.getState();
            mainWs.onmessage = (serverMessage) => {
                console.log(serverMessage) // TODO: remove this later
                llmMessage = serverMessage.data
                setMessages([...prevMessages, {
                    sender: "bot",
                    text: llmMessage,
                    mode: "text"
                }])
                resolve(true)
            }
            mainWs.onerror = () => {
                console.log("an error occured while sending text message")
                resolve(false)
            }
            mainWs.onclose = () => {
                console.log("text chat ws closed")
                reject(false)
            }        
        })
        
    } catch (error) {
        console.log("Error sending voice message to llm", error)
    }
    finally {
        setWaitingForMessage(false)
    }
    return llmMessage;
}

export class VoiceChat {
}