import React, { useRef, useEffect } from 'react';
import { useStore } from '@/context/store';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ChatDisplay = () => {
    const { messages } = useStore();
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom of the chat when messages update
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="space-y-4 p-4">
            {messages.map((msg, index) => (
                <div key={index} className="flex flex-col space-y-2">
                    <div className="flex flex-row p-3 space-x-4 rounded-lg shadow-md text-white justify-end">
                        <div className="bg-slate-900 p-3 rounded-md">
                            <p className="break-words">{msg.message}</p>
                        </div>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="text-gray-300">
                        <p className="whitespace-pre-wrap break-words border border-gray-600  rounded-lg p-3 shadow-lg">
                            {msg.response}
                        </p>
                    </div>
                </div>
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

export default ChatDisplay;
