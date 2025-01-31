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
        // Capture audio. mediaStream -> a stream of media content carrying raw data from microphone
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: config
        });
        // audio context -> controlls the audio thread
        this.audioContext = new AudioContext();
        // source node -> works in the audio thread to receive audio from media stream -> does some internal magic to send audio to worklet script/node
        this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream)
        
        // this addModule loads a script in a separate worklet thread which registers a processor (see /audio-processors)
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
        if (this.workletNode) {
            this.workletNode.port.onmessage = (event) => {
                callback(event.data)
            }
        }
    }
    getSourceNode() {
        return this.sourceNode;
    }
    cleanup() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
            this.mediaStream = undefined;
        }
        if (this.workletNode) {
            this.workletNode.disconnect();
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