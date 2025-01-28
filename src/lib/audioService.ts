interface AudioConfig {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
}

export class AudioService {
    private audioContext?: AudioContext;
    private mediaStream?: MediaStream;
    workletNode?: AudioWorkletNode
    private sourceNode?: MediaStreamAudioSourceNode

    async initialize(config: AudioConfig = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    }) {
        console.log('initializing audio service')
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: config
        });
        this.audioContext = new AudioContext();
        this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream)
        
        await this.audioContext.audioWorklet.addModule(
            "/audio-processors/linear-pcm-processor.js"
        )
        this.workletNode = new AudioWorkletNode(
            this.audioContext,
            "linear-pcm-processor"
        )
        this.sourceNode.connect(this.workletNode)
    }
    onAudioData(callback: (buffer: Int16Array) => void) {
        // console.log(this.workletNode)
        if (this.workletNode) {
            this.workletNode.port.onmessage = (event) => {
                console.log('sending bytes')
                callback(event.data)
            }
        }
    }
    getSourceNode() {
        return this.sourceNode;
    }
    cleanup() {
        console.log('cleaning up audio service')
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
            this.mediaStream = undefined;
        }
        if (this.workletNode) {
            this.workletNode.disconnect();
            // console.log('disconnected worklet node')
            this.workletNode = undefined;
        }
        if (this.sourceNode) {
            this.sourceNode.disconnect();
            this.workletNode = undefined;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = undefined;
        }
        this.onAudioData(() => {})
    }

}