"use client";

import { Course } from "@/app/actions/functions";
import { ActionState, createStudySession } from "@/app/actions/study-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button disabled={pending} type="submit" className="w-full mt-4">
      {pending ? "Creating..." : "Create Session"}
    </Button>
  );
}

export default function CreateSessionForm({
  courses,
  userId,
}: {
  courses: Course[];
  userId: string;
}) {
  const initialState: ActionState = {};
  const [state, formAction, pending] = useActionState(
    createStudySession,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="course_id" className="text-sm font-medium mb-2">
          Course *
        </Label>
        <Select
          name="course_id"
          defaultValue={state?.data?.course_id?.toString()}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem
                key={course.course_id}
                value={course.course_id.toString()}
              >
                {course.subject_code} {course.course_number} - {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.errors?.course_id?.[0] && (
          <p className="text-red-500 text-sm mt-1">
            {state.errors.course_id[0]}
          </p>
        )}
      </div>

      <input type="hidden" id="creator_id" name="creator_id" value={userId} />

      <div>
        <Label htmlFor="start_time" className="text-sm font-medium mb-2">
          Start Time *
        </Label>
        <Input
          id="start_time"
          name="start_time"
          type="datetime-local"
          defaultValue={state?.data?.start_time}
        />
        {state?.errors?.start_time?.[0] && (
          <p className="text-red-500 text-sm mt-1">
            {state.errors.start_time[0]}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="end_time" className="text-sm font-medium mb-2">
          End Time *
        </Label>
        <Input
          id="end_time"
          name="end_time"
          type="datetime-local"
          defaultValue={state?.data?.end_time}
        />
        {state?.errors?.end_time?.[0] && (
          <p className="text-red-500 text-sm mt-1">
            {state.errors.end_time[0]}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="url" className="text-sm font-medium mb-2">
          Session URL
        </Label>
        <Input id="url" name="url" type="url" defaultValue={state?.data?.url} />
        {state?.errors?.url?.[0] && (
          <p className="text-red-500 text-sm mt-1">{state.errors.url[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="notes" className="text-sm font-medium mb-2">
          Notes
        </Label>
        <Textarea id="notes" name="notes" defaultValue={state?.data?.notes} />
        {state?.errors?.notes?.[0] && (
          <p className="text-red-500 text-sm mt-1">{state.errors.notes[0]}</p>
        )}
      </div>

      <SubmitButton pending={pending} />
    </form>
  );
}
