"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare } from "lucide-react";
import { ChatMessage } from "@/types";
import { Color } from "chess.js";
import { formatDistanceToNow } from "date-fns";

interface ChatProps {
  gameId: string;
  playerColor: Color | null;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export function Chat({ playerColor, messages, onSendMessage }: ChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && playerColor) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <Card className="flex flex-col h-96">
      <CardHeader className="flex flex-row items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        <CardTitle className="text-xl">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === playerColor ? "justify-end" : ""
                }`}
              >
                {msg.sender !== playerColor && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-muted-foreground text-background text-xs">
                      {msg.sender === "w" ? "W" : "B"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`flex flex-col max-w-[320px] leading-1.5 p-3 border-gray-200 rounded-xl ${
                    msg.sender === playerColor
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted rounded-bl-none"
                  }`}
                >
                  <p className="text-sm font-normal">{msg.text}</p>
                   {msg.timestamp && (
                     <span className={`text-xs mt-1 ${msg.sender === playerColor ? 'text-primary-foreground/70' : 'text-muted-foreground'} self-end`}>
                        {formatDistanceToNow(msg.timestamp.toDate(), { addSuffix: true })}
                    </span>
                   )}
                </div>
                 {msg.sender === playerColor && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                       {msg.sender === "w" ? "W" : "B"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 p-4 border-t">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!playerColor}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || !playerColor}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
