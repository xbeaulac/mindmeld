"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from "./message";
import { MessageInput } from "./message-input";

type Message = {
  message_id: number;
  content: string;
  created_at: string;
  author_name: string;
  likes: number;
  has_liked: boolean;
};

export function MessageList({
  messages,
  sessionId,
}: {
  messages: Message[];
  sessionId: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <Message
                key={message.message_id}
                {...message}
                sessionId={sessionId}
              />
            ))}
          </div>
          <MessageInput sessionId={sessionId} />
        </div>
      </CardContent>
    </Card>
  );
}
