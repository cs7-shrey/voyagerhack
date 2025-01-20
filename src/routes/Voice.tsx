import { useState, useRef, useEffect } from "react";
import LLM from "./LLM";

const AudioStreamer = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const socketRef = useRef<WebSocket>(undefined);
    const audioContextRef = useRef<AudioContext>();
    const mediaStreamRef = useRef<MediaStream>();
    const workletNodeRef = useRef<AudioWorkletNode>();
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode>();
    
    const [lang, setLang] = useState('en');

    const cleanup = () => {
        // close the web socket connection
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = undefined;
        }
        // stop all tracks in the media stream
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = undefined;
        }
        // disconnect audio nodes
        // workletNode -> the one processing the audio (sampling, quantization, flushing)
        if (workletNodeRef.current) {
            workletNodeRef.current.disconnect();
            workletNodeRef.current = undefined;
        }
        // sourceNode -> the one getting the audio and giving to workletNode
        if (sourceNodeRef.current) {
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = undefined;
        }
        // close the AudioContext
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = undefined;
        }

    };
    useEffect(() =>  {
        return () => {
            cleanup();
        }
    }, [])
    const toggleStreaming = async () => {
        if (isStreaming) {
            cleanup();
            setIsStreaming(false);
        } else {
            // Start streaming
            try {
                const socket = new WebSocket(`ws://localhost:8000/hotel/ws/audio/${lang}`); // TODO: put this in .env
                socketRef.current = socket;

                socket.onopen = () => {
                    console.log("WebSocket connected!");
                };

                socket.onclose = () => {
                    cleanup();
                    setIsStreaming(false)
                    console.log("WebSocket disconnected!");
                };

                socket.onmessage = (message) => {
                    console.log(message)
                }

                socket.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };

                // Capture audio
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                mediaStreamRef.current = mediaStream;
                
                // audio context
                const audioCtx = new AudioContext();
                audioContextRef.current = audioCtx;

                // source node
                const source = audioCtx.createMediaStreamSource(mediaStream);
                sourceNodeRef.current = source;


                // worklet node -> will process audio and send it to main thread
                await audioCtx.audioWorklet.addModule(
                    "/audio-processors/linear-pcm-processor.js"
                );
                const audioWorkletNode = new AudioWorkletNode(
                    audioCtx,
                    "linear-pcm-processor"
                );
                workletNodeRef.current = audioWorkletNode;

                // connections
                source.connect(audioWorkletNode);
                audioWorkletNode.connect(audioCtx.destination);

                audioWorkletNode.port.onmessage = (event) => {
                    const buffer = event.data; // Int16Array
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(buffer);
                    }
                };
                setIsStreaming(true);
            } catch (error) {
                console.error("Error starting audio stream:", error);
                cleanup();
                setIsStreaming(false);
            }
        }
    };

    return (
        <div>
            <button onClick={toggleStreaming}>
                {isStreaming ? "Stop Streaming" : "Start Streaming"}
            </button>
            <div>

            </div>
            <button onClick={() => lang === 'en' ? setLang('hi') : setLang('en')}>
                {lang}
            </button>
            <div>
                <LLM />
            </div>
        </div>
    );
};

export default AudioStreamer;
