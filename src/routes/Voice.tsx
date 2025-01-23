import { useState, useRef, useEffect } from "react";
// import LLM from "./LLM";
import { useCallback } from "react";
// import { LiveAudioVisualizer } from 'react-audio-visualize';
import AudioMotionAnalyzer from 'audiomotion-analyzer';
import { useSocketStore } from "@/store/useSocketStore";
import { useNavigate } from "react-router";
import { useHotelStore } from "@/store/useHotelStore";
import { Mic } from "lucide-react";

const Voice = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [lang, setLang] = useState<'en' | 'hi'>('en');        // TODO: make this enum
    // const [sending, setSending] = useState(false);
    const socketRef = useRef<WebSocket>(undefined);
    const audioContextRef = useRef<AudioContext>();
    const mediaStreamRef = useRef<MediaStream>();
    const workletNodeRef = useRef<AudioWorkletNode>();
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode>();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const navigate = useNavigate()
    const {
        // canSpeak,
        // setCanSpeak,
        connectAudioSocket,
        connectLlmSocket,
        disconnectAudioSocket,
        // disconnectLlmSocket
    } = useSocketStore();
    const { setHotels, setFromVoice } = useHotelStore.getState();


    const cleanup = useCallback(() => {
        // close the web socket connection
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = undefined;
        }
        disconnectAudioSocket();
        // disconnectLlmSocket();      // REMOVE THIS
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
    }, [disconnectAudioSocket]);
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);
    useEffect(() => {
        if (isStreaming && canvasRef.current) {
            console.log('got here')
            const audioMotion = new AudioMotionAnalyzer(canvasRef.current, {
                source: sourceNodeRef.current,
                canvas: canvasRef.current,
                mode: 7,            // key player
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
        if (isStreaming) {
            cleanup();
            setIsStreaming(false);
        } else {
            // Start streaming
            try {
                const llmSocket = await connectLlmSocket();
                const audioSocket = await connectAudioSocket(lang);
                console.log(llmSocket?.readyState)
                if (audioSocket && llmSocket) {
                    audioSocket.onmessage = (message) => {
                        console.log(message)
                    }
                    llmSocket.onmessage = (message) => {
                        try {
                            const jsonResponse = JSON.parse(message.data);
                            console.log(jsonResponse.status)
                            if (jsonResponse.status) {
                                console.log(jsonResponse)
                                const filters = jsonResponse.filters;
                                const queryTerm = filters.place.name;
                                const type = filters.place.type;
                                const searchFilters = {
                                    checkIn: filters.check_in,
                                    checkOut: filters.check_out,
                                    minBudget: filters.min_budget,
                                    maxBudget: filters.max_budget,
                                    userRating: filters.user_rating,
                                    hotelStar: filters.hotel_star,
                                    propertyType: filters.property_type,
                                    hotelAmenities: filters.hotel_amenity_codes,
                                    roomAmenities: filters.room_amenity_codes
                                }
                                const filterString = JSON.stringify(searchFilters);
                                console.log(filterString);
                                setHotels(jsonResponse.data);
                                setFromVoice(true);
                                navigate(`/hotels?q=${queryTerm}&type=${type}&filters=${filterString}`);
                            }
                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                        }
                    }
                    llmSocket.onclose = () => {
                        cleanup();
                        setIsStreaming(false);
                        console.log("WebSocket disconnected!");
                    }
                    audioSocket.onerror = (error) => {
                        console.log("An error in audio web socket", error);
                    }
                    llmSocket.onerror = (error) => {
                        console.log("An error in llm web socket", error);
                    }
                }
                // Capture audio
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
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
                // audioWorkletNode.connect(audioCtx.destination);
                
                audioWorkletNode.port.onmessage = (event) => {
                    const buffer = event.data; // Int16Array
                    if (audioSocket?.OPEN) {
                        // console.log("Sending audio buffer:", buffer);
                        console.log(audioSocket.readyState == WebSocket.OPEN)
                        audioSocket.send(buffer);
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
        <div className="flex justify-center bg-primary w-fit py-4 rounded-md">
            {/* <button onClick={toggleStreaming}>
                {isStreaming ? "Stop Streaming" : "Start Streaming"}
            </button>
            <button
                className="bg-white text-black rounded-md p-2"
                onClick={() => (lang === "en" ? setLang("hi") : setLang("en"))}>
                {lang}
            </button> */}
            
            <div className="self-center rounded-md">
                <button onClick={toggleStreaming}>
                    <div className="h-24 w-40 rounded-full flex flex-col justify-center items-center gap-2" id="container">
                        <div className="h-10 w-20 flex justify-center items-center">
                            {!isStreaming ? 
                                <Mic size={30}/> :
                                <canvas ref={canvasRef} className="w-full h-full rounded-full p-2" /> 
                            }
                        </div>
                        <div className="text-black/55">
                            {isStreaming ? "Listening..." : "Voice Search"}
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Voice;
