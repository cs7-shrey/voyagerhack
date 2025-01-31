import { useRef, useState, useCallback } from 'react';

const LLM = () => {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    const handleConnection = useCallback(() => {
        if (!isConnected) {
            try {
                wsRef.current = new WebSocket(`${import.meta.env.VITE_SOCKET_BASE_URL}/ws/llm/search`);
                
                wsRef.current.onopen = () => {
                    setIsConnected(true);
                    console.log('WebSocket Connected');
                };

                wsRef.current.onmessage = (event) => {
                    console.log('Received:', event.data);
                };

                wsRef.current.onerror = (error) => {
                    console.error('WebSocket Error:', error);
                    setIsConnected(false);
                };

                wsRef.current.onclose = () => {
                    console.log('WebSocket Disconnected');
                    setIsConnected(false);
                };

            } catch (error) {
                console.error('Connection Error:', error);
                setIsConnected(false);
            }
        } else {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
                setIsConnected(false);
            }
        }
    }, [isConnected]);

    return (
        <button
            className={`px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-105 
            ${isConnected 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleConnection}
        >
            {isConnected ? 'Disconnect' : 'Connect'}
        </button>
    );
};

export default LLM;