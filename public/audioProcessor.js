class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs) {
        const input = inputs[0];
        const audioData = input[0];
        
        if (audioData) {
            this.port.postMessage({ audioData: new Float32Array(audioData) });
        }
        
        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);