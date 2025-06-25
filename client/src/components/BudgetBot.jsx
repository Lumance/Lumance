import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export default function BudgetBot() {
    const [messages, setMessages] = useState([
        { role: "bot", content: "💬 BudgetBot is ready! How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = { role: "user", content: input };
        setMessages([...messages, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();
            const botMessage = { role: "bot", content: data.response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-center mb-4"
            >
                💰 BudgetBot
            </motion.h1>

            <Card className="h-[500px] overflow-hidden border-2">
                <CardContent className="h-full p-2">
                    <ScrollArea className="h-full space-y-4 pr-4">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-xl px-4 py-2 w-fit max-w-[85%] text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-200"
                                    }`}
                            >
                                {msg.content}
                            </motion.div>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
                className="flex gap-2 mt-4"
            >
                <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                </Button>
            </form>
        </div>
    );
}