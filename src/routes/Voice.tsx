import { useState, useRef, useEffect } from "react";
// import LLM from "./LLM";
import { useCallback } from "react";
// import { LiveAudioVisualizer } from 'react-audio-visualize';
import AudioMotionAnalyzer from 'audiomotion-analyzer';
import { AudioService } from "@/lib/audioService";
import { useSocketStore } from "@/store/useSocketStore";
import { Mic } from "lucide-react";
import { useLLMFilters } from "@/lib/voiceSearch";
import { generateCurrentFiltersAsString } from "@/lib/utils";
import { useHotelStore } from "@/store/useHotelStore";

const Voice = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    // const [sending, setSending] = useState(false);
    // const audioContextRef = useRef<AudioContext>();
    // const mediaStreamRef = useRef<MediaStream>();
    // const workletNodeRef = useRef<AudioWorkletNode>();
    const filterProcessing = useLLMFilters()
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode>();
    const audioServiceRef = useRef<AudioService>();
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {
        // canSpeak,
        // setCanSpeak,
        connectAudioSocket,
        connectLlmSocket,
        disconnectAudioSocket,
        setWaitingForMessage,
        // disconnectLlmSocket
    } = useSocketStore();

    const cleanup = useCallback(() => {
        // close the web socket connection
        disconnectAudioSocket();
        // disconnectLlmSocket();      // REMOVE THIS
        if (audioServiceRef.current) {
            audioServiceRef.current.cleanup();
            audioServiceRef.current = undefined
        }
    }, [disconnectAudioSocket]);
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);
    useEffect(() => {
        if (isStreaming && canvasRef.current) {
            const audioMotion = new AudioMotionAnalyzer(canvasRef.current, {
                source: sourceNodeRef.current,
                canvas: canvasRef.current,
                mode: 8,            // key player
                reflexAlpha: 1,
                reflexRatio: 0.5,
                showPeaks: false,
                roundBars: true,
                lineWidth: 1,
                outlineBars: true,
                showScaleX: false,
                minDecibels: -100,
                gradient: "prism",
                showBgColor: false,
                overlay: true,
                bgAlpha: 0,
                colorMode: "bar-level",
                useCanvas: true,
                connectSpeakers: false
            })
            audioMotion.registerGradient('white', {
                bgColor: "transparent",
                colorStops: [
                    { color: "black" }
                ]
            })
            audioMotion.gradient = "white"
        }
    }, [isStreaming])
    const toggleStreaming = async () => {
        const { llmSocket } = useSocketStore.getState();
        if (isStreaming) {
            if (llmSocket?.readyState === WebSocket.OPEN) setWaitingForMessage(true);
            cleanup();
            setIsStreaming(false);
        } else {
            // Start streaming
            try {
                const llmSocket = await connectLlmSocket();
                const audioSocket = await connectAudioSocket();
                if (audioSocket && llmSocket) {
                    const { infoMessage } = useHotelStore.getState();
                    llmSocket.send(JSON.stringify({"previous_filters": generateCurrentFiltersAsString(), "previous_message": infoMessage}));
                    llmSocket.onmessage = (message) => {
                        try {
                            const jsonResponse = JSON.parse(message.data);
                            if (jsonResponse.status) {
                                const filters = jsonResponse.filters;
                                filterProcessing(filters, jsonResponse.status, jsonResponse.data);
                            }
                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                        }
                    }
                    llmSocket.onclose = () => {
                        cleanup();
                        setIsStreaming(false);
                        setWaitingForMessage(false);
                        console.log("WebSocket disconnected!");
                    }
                    audioSocket.onclose = () => {
                        setIsStreaming(false)
                    }
                    audioSocket.onerror = (error) => {
                        console.error("An error in audio web socket", error);
                    }
                    llmSocket.onerror = (error) => {
                        setWaitingForMessage(false);
                        console.error("An error in llm web socket", error);
                    }
                }                
                
                const audioService = new AudioService()
                await audioService.initialize()
                audioServiceRef.current = audioService
                sourceNodeRef.current = audioService.getSourceNode()

                audioServiceRef.current?.onAudioData((buffer) => {
                    if (audioSocket?.readyState === WebSocket.OPEN) {
                        audioSocket.send(buffer)
                    }
                })
                setIsStreaming(true);
            } catch (error) {
                console.error("Error starting audio stream:", error);
                cleanup();
                setIsStreaming(false);
            }
        }
    };

    return (
        <div className="flex justify-center bg-primary w-fit h-fit py-2 rounded-md">
            <div className="self-center rounded-md">
                <button onClick={toggleStreaming}>
                    <div className="h-12 w-16 rounded-full flex flex-col justify-start items-center" id="container">
                        <div className="h-10 w-20 flex justify-center items-end">
                            {!isStreaming ? 
                                <Mic size={24}/> :
                                <canvas ref={canvasRef} className="w-[80%] h-[80%] rounded-full px-2" /> 
                            }
                        </div>
                        <div className="text-black/55 text-sm text-wrap p-1">
                            {isStreaming ? "Listening..." : "Speak"}
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Voice;
