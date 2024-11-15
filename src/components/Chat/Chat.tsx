'use client'

import * as React from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
    id: number
    content: string
    role: 'user' | 'assistant'
}

export default function ChatWindow() {
    const [messages, setMessages] = React.useState<Message[]>([
        { id: 1, content: "Hello! How can I assist you today?", role: 'assistant' },
    ])
    const [input, setInput] = React.useState('')
    const messagesEndRef = React.useRef<HTMLDivElement>(null)

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() === '') return

        const newMessage: Message = {
            id: messages.length + 1,
            content: input,
            role: 'user',
        }

        setMessages([...messages, newMessage])
        setInput('')

        // Simulate assistant response
        setTimeout(() => {
            const assistantResponse: Message = {
                id: messages.length + 2,
                content: "I'm an AI assistant. How can I help you with your question?",
                role: 'assistant',
            }
            setMessages(prevMessages => [...prevMessages, assistantResponse])
        }, 1000)
    }

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex flex-col w-full h-full mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white">
            <ScrollArea className="flex-1 p-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'
                            }`}
                    >
                        <div
                            className={`inline-block p-3 rounded-lg ${message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                    <Textarea
                        value={input}
                        onChange={(e: any) => setInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 resize-none"
                        rows={1}
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </div>
            </form>
        </div>
    )
}