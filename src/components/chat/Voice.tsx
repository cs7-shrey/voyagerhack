// import React from 'react'
import { useHotelPageChatStore } from '@/store/useHotelPageChatStore'
import { Mic } from 'lucide-react'
import { AudioService } from '@/lib/audioService'
import { useCallback, useEffect, useRef } from 'react'
import { voiceChat } from '@/lib/chat'
import { VoiceWebSocketService } from '@/lib/voice/VoiceWebSocket'
import { Service } from '@/lib/voice/VoiceWebSocket'

const Voice = () => {
    // web socket connections
    const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL;
    const { canSpeak, textSocket, setCanSpeak, setWaitingForMessage } = useHotelPageChatStore()
    const audioServiceRef = useRef<AudioService>()
    const voiceSocketRef = useRef<VoiceWebSocketService>();
    // streaming audio to websocket via audioService
    // message updates
    const cleanup = useCallback(() => {
        console.log('cleaning up audio socket service')
        setCanSpeak(false)
        if (audioServiceRef.current) {
            audioServiceRef.current.cleanup()
            audioServiceRef.current = undefined
        }
        if (voiceSocketRef.current) {
            voiceSocketRef.current.disconnect();
            voiceSocketRef.current = undefined;
        }
    }, [setCanSpeak])
    useEffect(() => {
        return () => {
            cleanup();
        }
    }, [cleanup])
    const toggleStreaming = async (retry: number) => {
        if(canSpeak) { 
            setWaitingForMessage(true)
            cleanup();
            return
        }

        const audioService = new AudioService();
        audioServiceRef.current = audioService
        await audioService.initialize();

        if (textSocket) {
            voiceChat(textSocket)
        }
        else {
            setCanSpeak(false)
            if (retry > 4) return
            toggleStreaming(retry + 1);              // TODO: can trigger unlimited retries. fix
            return
        }
        const socketService = new VoiceWebSocketService();
        console.log('A')
        const success = await socketService.connect(`${SOCKET_BASE_URL}/ws/audio/en`, Service.Chat)
        if (!success) {
            return
        }
        console.log('B')
        voiceSocketRef.current = socketService

        if (socketService.socket) {
            socketService.socket.onmessage = (message) => {
                console.log(message)
            }
            socketService.socket.onclose = () => {
                cleanup();
            }
        }
        if (!socketService.socket) {
            cleanup();
            return;
        }
        setCanSpeak(true)
        audioServiceRef.current.onAudioData((buffer: Int16Array) => {
            if (socketService.socket) {
                socketService.socket.send(buffer)
            }
        })
    }
    return (
        <button 
            className={`text-secondary/80 rounded-full size-10 ${canSpeak ? 'animate-pulse-slow' : ''}`} 
            onClick={() => toggleStreaming(1)}
        >
            <Mic size={20} className='my-auto mx-auto' color={`${canSpeak ? 'red' : 'black'}`} />
        </button>
    )
}

export default Voice
