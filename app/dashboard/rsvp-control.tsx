"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { RSVPStatus } from "../actions/functions";
import { rsvpAction } from "../actions/rsvp";

export const RSVPControl = ({
  defaultStatus,
  sessionId,
}: {
  defaultStatus: RSVPStatus | null;
  sessionId: number;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [optimistic, setOptimistic] = useState<RSVPStatus | null>(null);

  return (
    <form ref={formRef} action={rsvpAction}>
      <input type="hidden" name="sessionId" value={sessionId} />
      <RadioGroup
        name="status"
        defaultValue={defaultStatus ?? ""}
        onValueChange={(val) => {
          setOptimistic(val as RSVPStatus);
          formRef.current?.requestSubmit();
        }}
        className="flex gap-1 rounded-lg"
      >
        <div className="grid grid-cols-3 w-full">
          <Label
            htmlFor={`rsvp-yes-${sessionId}`}
            className={cn(
              "flex items-center justify-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
              (optimistic ?? defaultStatus) === "Yes"
                ? "bg-green-600 text-white"
                : "hover:bg-gray-100"
            )}
          >
            <RadioGroupItem
              value="Yes"
              id={`rsvp-yes-${sessionId}`}
              className="hidden"
            />
            Going
          </Label>
          <Label
            htmlFor={`rsvp-maybe-${sessionId}`}
            className={cn(
              "flex items-center justify-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
              (optimistic ?? defaultStatus) === "Maybe"
                ? "bg-yellow-600 text-white"
                : "hover:bg-gray-100"
            )}
          >
            <RadioGroupItem
              value="Maybe"
              id={`rsvp-maybe-${sessionId}`}
              className="hidden"
            />
            Maybe
          </Label>
          <Label
            htmlFor={`rsvp-no-${sessionId}`}
            className={cn(
              "flex items-center justify-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
              (optimistic ?? defaultStatus) === "No"
                ? "bg-gray-600 text-white"
                : "hover:bg-gray-100"
            )}
          >
            <RadioGroupItem
              value="No"
              id={`rsvp-no-${sessionId}`}
              className="hidden"
            />
            No
          </Label>
        </div>
      </RadioGroup>
    </form>
  );
};
