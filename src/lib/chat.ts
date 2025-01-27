export enum ChatMode {
    Text = "text",
    Voice = "voice"
}
export async function textChat(mainWs: WebSocket, userMessage: string): Promise<string | void> {
    // connect to the web socket and send the hotel data
    if (!mainWs.OPEN) {
        return
    }
    let llmMessage = '';
    await mainWs.send(ChatMode.Text)
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
    return llmMessage;
}

export async function voiceChat() {
    // TBD
}