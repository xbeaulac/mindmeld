"use client";

import { likeMessageAction } from "@/app/actions/message";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import { useOptimistic } from "react";

type MessageProps = {
  message_id: number;
  content: string;
  created_at: string;
  author_name: string;
  likes: number;
  has_liked: boolean;
  sessionId: number;
};

export function Message(message: MessageProps) {
  const [optimistic, addOptimistic] = useOptimistic(
    message,
    (state: MessageProps) => ({
      ...state,
      likes: state.likes + (state.has_liked ? -1 : 1),
      has_liked: !state.has_liked,
    })
  );

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">{optimistic.author_name}</span>
        <span className="text-sm text-muted-foreground">
          {format(new Date(optimistic.created_at), "MMM d, h:mm a")}
        </span>
      </div>
      <p className="text-sm flex-grow">{optimistic.content}</p>
      <form
        action={async (formData: FormData) => {
          addOptimistic(optimistic);
          await likeMessageAction(formData);
        }}
      >
        <input type="hidden" name="message_id" value={optimistic.message_id} />
        <input type="hidden" name="session_id" value={optimistic.sessionId} />
        <Button
          type="submit"
          variant="ghost"
          size={"sm"}
          className="h-6 has-[>svg]:px-1.5 group flex items-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              optimistic.has_liked
                ? "fill-red-500 text-red-500"
                : "text-gray-500 group-hover:text-red-500"
            )}
          />
          <span
            className={cn(
              "text-sm transition-colors",
              optimistic.has_liked
                ? "text-red-500"
                : "text-gray-500 group-hover:text-red-500"
            )}
          >
            {optimistic.likes}
          </span>
        </Button>
      </form>
    </div>
  );
}
