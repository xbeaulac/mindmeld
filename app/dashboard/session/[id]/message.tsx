"use client";

import { deleteMessage, likeMessageAction } from "@/app/actions/message";
import { useSession } from "@/app/providers/session-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Heart, MoreVertical, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic } from "react";

type MessageProps = {
  message_id: number;
  content: string;
  created_at: string;
  author_name: string;
  student_id: number;
  likes: number;
  has_liked: boolean;
  sessionId: number;
};

export function Message(message: MessageProps) {
  const { userId } = useSession();
  const router = useRouter();
  const [optimisticMessage, addOptimistic] = useOptimistic(
    message,
    (state, newLikeStatus: boolean) => ({
      ...state,
      likes: newLikeStatus ? state.likes + 1 : state.likes - 1,
      has_liked: newLikeStatus,
    })
  );

  const isAuthor = optimisticMessage.student_id === userId;

  const handleDelete = async () => {
    const result = await deleteMessage(
      optimisticMessage.message_id,
      optimisticMessage.sessionId
    );
    if (result.success) {
      router.refresh();
    }
  };

  const handleLike = async (formData: FormData) => {
    const newLikeStatus = !optimisticMessage.has_liked;
    addOptimistic(newLikeStatus);
    await likeMessageAction(formData);
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">{optimisticMessage.author_name}</span>
        <span className="text-sm text-muted-foreground">
          {format(new Date(optimisticMessage.created_at), "MMM d, h:mm a")}
        </span>
        {isAuthor && (
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <p className="text-sm flex-grow">{optimisticMessage.content}</p>
      <form action={handleLike}>
        <input
          type="hidden"
          name="message_id"
          value={optimisticMessage.message_id}
        />
        <input
          type="hidden"
          name="session_id"
          value={optimisticMessage.sessionId}
        />
        <Button
          type="submit"
          variant="ghost"
          size={"sm"}
          className="h-6 has-[>svg]:px-1.5 group flex items-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              optimisticMessage.has_liked
                ? "fill-red-500 text-red-500"
                : "text-gray-500 group-hover:text-red-500"
            )}
          />
          <span
            className={cn(
              "text-sm transition-colors",
              optimisticMessage.has_liked
                ? "text-red-500"
                : "text-gray-500 group-hover:text-red-500"
            )}
          >
            {optimisticMessage.likes}
          </span>
        </Button>
      </form>
    </div>
  );
}
