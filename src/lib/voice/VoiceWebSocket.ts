interface QueryParams {
    [index: string]: string;
}
export enum Service {
    Search = "search",
    Chat = "chat"
}
export class VoiceWebSocketService {
    socket?: WebSocket
    async connect(URL: string, service: Service): Promise<boolean> {
        const connectionURL = this.formatURL(URL, {"service": service})
        this.socket = new WebSocket(connectionURL)
        try {
            const response = await new Promise((resolve, reject) => {
                console.log('C')
                if (this.socket) {
                    this.socket.onopen = () => {
                        resolve(true)
                    }
                    this.socket.onerror = () => {
                        reject(false)
                    }
                }
            })
            return response as boolean
        } catch (error) {
            console.error(error)
            return false
        }
    }
    formatURL(URL: string, queryParams: QueryParams) {
        const urlParams = new URLSearchParams(queryParams)
        return `${URL}?${urlParams.toString()}`
    }
    stream(data: Int16Array) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return
        this.socket.send(data)
    }
    disconnect() {
        if (!this.socket || this.socket.readyState == WebSocket.CLOSED || this.socket.readyState == WebSocket.CLOSING) return;
        this.socket.close();
    }
}

