// import React from 'react'
import { useHotelPageChatStore } from '@/store/useHotelPageChatStore'
import { Mic } from 'lucide-react'
import { AudioService } from '@/lib/audioService'
import { useEffect, useCallback, useRef } from 'react'
import { voiceChat } from '@/lib/chat'

const Voice = () => {
    // web socket connections
    const { connectAudioSocket, canSpeak, disconnectAudioSocket, textSocket, setCanSpeak, setWaitingForMessage } = useHotelPageChatStore()
    const audioServiceRef = useRef<AudioService>()
    // streaming audio to websocket via audioService
    // message updates
    const cleanup = useCallback(() => {
        console.log('cleaning up audio socket service')
        if (audioServiceRef.current) {
            audioServiceRef.current.cleanup()
            audioServiceRef.current = undefined
        }
        const { audioSocket } = useHotelPageChatStore.getState()
        console.log(audioSocket?.readyState)
        disconnectAudioSocket();
    }, [disconnectAudioSocket])
    useEffect(() => {
        return () => {
            cleanup();
        }
    }, [cleanup])
    const toggleStreaming = async (retry: int) => {
        if(canSpeak) {
            setWaitingForMessage(true)
            cleanup();
            return
        }
        console.log('starting audio service')
        const audioService = new AudioService();
        audioServiceRef.current = audioService
        await audioService.initialize();
        console.log(audioServiceRef.current.workletNode)
        if (textSocket) {
            voiceChat(textSocket)
        }
        else {
            setCanSpeak(false)
            if (retry > 4) return
            toggleStreaming(retry + 1);              // TODO: can trigger unlimited retries. fix
            return
        }
        const ws = await connectAudioSocket('en');
        if (ws) {
            ws.onmessage = (message) => {
                console.log(message)
            }
            ws.onclose = () => {
                cleanup();
            }
        }
        if (!ws) {
            cleanup();
            return;
        }
        audioServiceRef.current.onAudioData((buffer: Int16Array) => {
            ws.send(buffer)
        })
    }
    console.log(canSpeak)
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
