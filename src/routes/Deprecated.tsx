import { useState, useRef } from "react";

const AudioStreamer = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const socketRef = useRef<WebSocket>();
    const audioContextRef = useRef<AudioContext>();
    const mediaStreamRef = useRef<MediaStream>();
    const processorRef = useRef<ScriptProcessorNode>();
    function convertFloat32ToInt16(buffer: Float32Array) {
        let l = buffer.length;
        const buf = new Int16Array(l);

        while (l--) {
            buf[l] = buffer[l] * 32767;
        }
        return buf.buffer
    }
    const cleanup = () => {
        // Stop streaming
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = undefined;
        }

        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = undefined;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = undefined;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = undefined;
        }
    }
    const toggleStreaming = async () => {
        if (isStreaming) {
            cleanup();
            setIsStreaming(false);
        } else {
            // Start streaming
            try {
                const socket = new WebSocket("ws://127.0.0.1:8000/ws/audio");
                socketRef.current = socket;

                socket.onopen = () => {
                    console.log("WebSocket connected!");
                };

                socket.onclose = () => {
                    cleanup();
                    setIsStreaming(false);
                    console.log("WebSocket disconnected!");
                };

                socket.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };

                // Capture audio
                const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 44100 } });
                mediaStreamRef.current = stream;

                const audioContext = new AudioContext();
                audioContextRef.current = audioContext;

                const source = audioContext.createMediaStreamSource(stream);
                const processor = audioContext.createScriptProcessor(4096, 1, 1);
                // const processor = audioContext.audioWorklet();
                processorRef.current = processor;

                source.connect(processor);
                processor.connect(audioContext.destination);


                processor.onaudioprocess = (event) => {
                    const audioData = event.inputBuffer.getChannelData(0);
                    // const audioBlob = new Blob([float32Array], { type: "audio/wav" });
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(convertFloat32ToInt16(audioData));
                    }
                };

                setIsStreaming(true);
            } catch (error) {
                console.error("Error starting audio stream:", error);
            }
        }
    };

    return (
        <div>
            <button onClick={toggleStreaming}>
                {isStreaming ? "Stop Streaming" : "Start Streaming"}
            </button>
        </div>
    );
};

export default AudioStreamer;
