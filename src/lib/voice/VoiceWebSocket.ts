interface QueryParams {
    [index: string]: string;
}
export enum Service {
    Search = "search",
    Chat = "chat"
}
export class VoiceWebSocketService {
    socket?: WebSocket
    connect(URL: string, service: Service) {
        const connectionURL = this.formatURL(URL, {"service": service})
        this.socket = new WebSocket(connectionURL)
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
