import React, { useState } from 'react';
import { useStore } from './context/store';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatDisplay from './components/ChatDisplay';
import HoverBorderGradient from './components/ui/hover-border-gradient';
import Header from './components/Header';

function App() {
  const [input, setInput] = useState('');
  const { addMessage } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    addMessage(data);
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
            placeholder="Enter your query..."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='w-full max-w-xl border-2 border-white rounded-md bg-slate-950 text-white py-3 px-4'
          />
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black text-white dark:text-white flex items-center space-x-2"
          >
            Ask!
          </HoverBorderGradient>
        </div>
      </form>
    </div>
  );
}

export default App;
