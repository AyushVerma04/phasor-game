// Simple Socket.IO Client Test
import React, { useEffect } from 'react';
import io from 'socket.io-client';

const SimpleSocketTest = () => {
    useEffect(() => {
        const socket = io('http://localhost:3000', {
            transports: ['websocket'], // Test with WebSocket only
        });

        socket.on('connect', () => {
            console.log('Connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <div>Socket Test</div>;
};

export default SimpleSocketTest;
