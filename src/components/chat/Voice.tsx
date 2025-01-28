// import React from 'react'
import { useHotelPageChatStore } from '@/store/useHotelPageChatStore'
import { Mic } from 'lucide-react'
import { AudioService } from '@/lib/audioService'
import { useEffect, useCallback, useRef } from 'react'
import { voiceChat } from '@/lib/chat'
import { text } from 'stream/consumers'

const Voice = () => {
    // web socket connections
    const { connectAudioSocket, canSpeak, disconnectAudioSocket, textSocket, setCanSpeak } = useHotelPageChatStore()
    const audioServiceRef = useRef<AudioService>()
    // streaming audio to websocket via audioService
    console.log(canSpeak)
    // message updates
    const cleanup = useCallback(() => {
        console.log('cleaning up audio socket service')
        if (audioServiceRef.current) {
            audioServiceRef.current.cleanup()
            audioServiceRef.current = undefined
        }
        disconnectAudioSocket();
    }, [disconnectAudioSocket])
    useEffect(() => {
        return () => {
            console.log('durghatna')
            cleanup();
        }
    }, [cleanup])
    const toggleStreaming = async () => {
        if(canSpeak) {
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
            toggleStreaming();
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

    return (
        <button 
            className={`text-secondary/80 rounded-full size-10 ${canSpeak ? 'animate-pulse-slow' : ''}`} 
            onClick={() => toggleStreaming()}
        >
            <Mic size={20} className='my-auto mx-auto' color={`${canSpeak ? 'red' : 'black'}`} />
        </button>
    )
}

export default Voice
