"use client";

import { MessageActionState, postMessage } from "@/app/actions/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useRef } from "react";

type MessageInputProps = {
  sessionId: number;
};

const initialState: MessageActionState = {};

export function MessageInput({ sessionId }: MessageInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState(postMessage, initialState);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        formData.append("session_id", sessionId.toString());
        await action(formData);
        if (!state?.errors) {
          formRef.current?.reset();
        }
      }}
      className="space-y-2"
    >
      <Textarea
        placeholder="Write a message..."
        name="content"
        className="min-h-[100px]"
        required
      />
      {state?.errors?.content && (
        <p className="text-sm text-red-500">{state.errors.content[0]}</p>
      )}
      <Button type="submit">Send Message</Button>
    </form>
  );
}
