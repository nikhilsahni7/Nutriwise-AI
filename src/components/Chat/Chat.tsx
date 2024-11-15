// components/ChatWindow.tsx
"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, ChatResponse } from "@/types/schema";

export default function ChatWindow() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 1,
      content:
        "Hi! I'm your NutriWise AI assistant. I can help you with personalized nutrition advice based on your profile. What would you like to know?",
      role: "assistant",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add loading message
    const loadingMessage: Message = {
      id: messages.length + 2,
      content: "...",
      role: "assistant",
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data: ChatResponse = await response.json();

      if (!response.ok) throw new Error(data.error);

      // Remove loading message and add real response
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));

      const assistantMessage: Message = {
        id: messages.length + 2,
        content: data.response,
        role: "assistant",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-[600px] mx-auto border border-gray-200 rounded-lg overflow-hidden ">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                message.role === "user"
                  ? "bg-blue-600"
                  : " text-black border-foreground border dark:text-white"
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse">...</div>
                </div>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about nutrition, diet plans, or healthy recipes..."
            className="flex-1 resize-none"
            rows={1}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
