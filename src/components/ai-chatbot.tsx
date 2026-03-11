"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Bot, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ssd_chat_session") || crypto.randomUUID();
    }
    return crypto.randomUUID();
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const session = useQuery(api.aiConversations?.getSession as any, { sessionId });
  const sendMessage = useAction(api.aiConversations?.chatbot as any);
  const clearConversation = useMutation(api.aiConversations?.clearConversation as any);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionId) {
      localStorage.setItem("ssd_chat_session", sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");

    try {
      await sendMessage({
        sessionId,
        message: userMessage,
        language: "en",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleClear = async () => {
    try {
      await clearConversation({ sessionId });
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      if (typeof window !== "undefined") {
        localStorage.setItem("ssd_chat_session", newSessionId);
      }
    } catch (error) {
      console.error("Failed to clear conversation:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] shadow-2xl z-50 flex flex-col">
          <CardHeader className="border-b py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-lg">SSD Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Ask me anything about Samta Sainik Dal
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  title="Clear conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {!session || session.messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">
                      Namaste! I&apos;m your SSD assistant.
                      <br />
                      Ask me anything about Samta Sainik Dal&apos;s history,
                      ideology, events, or how to join.
                    </p>
                  </div>
                ) : (
                  session.messages.map((msg: any, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start gap-2",
                        msg.role === "user" ? "flex-row-reverse" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {msg.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "rounded-lg p-3 max-w-[80%]",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            msg.role === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AI-powered assistant. May not always be accurate.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
