"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { RSVPStatus } from "../actions/functions";

export const RSVPControl = ({
  defaultStatus,
  sessionId,
}: {
  defaultStatus: RSVPStatus;
  sessionId: number;
}) => {
  const handleRSVP = async (formData: FormData) => {
    const status = formData.get("status");
    console.log(sessionId, status);
  };
  const formRef = useRef<HTMLFormElement>(null);
  console.log(defaultStatus);
  return (
    <form ref={formRef} action={handleRSVP}>
      <RadioGroup
        name="status"
        value={defaultStatus}
        onValueChange={() => {
          formRef.current?.requestSubmit();
        }}
        className="flex gap-1 rounded-lg"
      >
        <div className="grid grid-cols-3 w-full">
          <Label
            htmlFor="rsvp-yes"
            className={cn(
              "flex items-center justify-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
              defaultStatus === "Yes"
                ? "bg-green-600 text-white"
                : "hover:bg-gray-100"
            )}
          >
            <RadioGroupItem value="Yes" id="rsvp-yes" className="hidden" />
            Going
          </Label>
          <Label
            htmlFor="rsvp-maybe"
            className={cn(
              "flex items-center justify-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
              defaultStatus === "Maybe"
                ? "bg-yellow-600 text-white"
                : "hover:bg-gray-100"
            )}
          >
            <RadioGroupItem value="Maybe" id="rsvp-maybe" className="hidden" />
            Maybe
          </Label>
          <Label
            htmlFor="rsvp-no"
            className={cn(
              "flex items-center justify-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
              defaultStatus === "No"
                ? "bg-gray-600 text-white"
                : "hover:bg-gray-100"
            )}
          >
            <RadioGroupItem value="No" id="rsvp-no" className="hidden" />
            No
          </Label>
        </div>
      </RadioGroup>
    </form>
  );
};
