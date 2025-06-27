import React, { useState, useEffect, useRef } from 'react';
import { useStore } from './context/store';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatDisplay from './components/ChatDisplay';
import HoverBorderGradient from './components/ui/hover-border-gradient';
import Header from './components/Header';

function App() {
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const { startStreaming, updateStreamingResponse, finishStreaming } = useStore();
  const wsRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/ws');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'ack':
            console.log('Message acknowledged:', data.message);
            break;
          case 'chunk':
            updateStreamingResponse(data.content);
            break;
          case 'complete':
            finishStreaming();
            break;
          case 'error':
            console.error('WebSocket error:', data.content);
            finishStreaming();
            break;
          default:
            console.log('Unknown message type:', data);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Try to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [updateStreamingResponse, finishStreaming]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Not connected to server. Please wait...');
      return;
    }

    if (!input.trim()) return;

    // Start streaming
    startStreaming(input);
    
    // Send message via WebSocket
    wsRef.current.send(JSON.stringify({ message: input }));
    
    setInput('');
  };

  return (
    <div className='bg-slate-950 h-screen flex flex-col'>
      <div className=' '><Header/></div>
      <div className='flex-grow overflow-auto p-4 pb-20'>
        <ChatDisplay />
      </div>
      <form
        onSubmit={handleSubmit}
        className='fixed bottom-0 left-0 w-full flex justify-center  pb-8 bg-slate-950'
      >
        <div className='w-full max-w-xl flex items-center space-x-4 shadow-md'>
          <Input
            placeholder={isConnected ? "Enter your query..." : "Connecting..."}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='w-full max-w-xl border-2 border-white rounded-md bg-slate-950 text-white py-3 px-4'
            disabled={!isConnected}
          />
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black text-white dark:text-white flex items-center space-x-2"
            disabled={!isConnected}
          >
            {isConnected ? "Ask!" : "Connecting..."}
          </HoverBorderGradient>
        </div>
      </form>
    </div>
  );
}

export default App;
