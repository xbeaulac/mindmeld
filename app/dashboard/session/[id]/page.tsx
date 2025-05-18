import { getSessionDetails, RSVPStatus } from "@/app/actions/functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, ChevronLeft, Clock, MapPin, Users } from "lucide-react";
import { RowDataPacket } from "mysql2";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RSVPControl } from "../../rsvp-control";
import { AttendeeList } from "./attendee-list";
import { MessageList } from "./message-list";

type RawSessionDetails = RowDataPacket & {
  session_id: number;
  course_id: number;
  creator_id: number;
  start_time: string;
  end_time: string;
  url: string | null;
  notes: string | null;
  subject_code: string;
  course_number: number;
  title: string;
  creator_name: string;
  rsvp_status: RSVPStatus | null;
  current_attendees: number;
  messages: RowDataPacket[];
  attendees: RowDataPacket[];
};

type Message = {
  message_id: number;
  content: string;
  created_at: string;
  author_name: string;
  likes: number;
  has_liked: boolean;
};

type Attendee = {
  name: string;
  rsvp_status: RSVPStatus;
  rating: number | null;
};

type SessionDetails = {
  session_id: number;
  course_id: number;
  creator_id: number;
  start_time: Date;
  end_time: Date;
  url: string | null;
  notes: string | null;
  subject_code: string;
  course_number: number;
  title: string;
  creator_name: string;
  rsvp_status: RSVPStatus | null;
  current_attendees: number;
  messages: Message[];
  attendees: Attendee[];
};

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const rawSessionDetails = (await getSessionDetails(
    parseInt((await params).id)
  )) as RawSessionDetails;

  if (!rawSessionDetails) {
    notFound();
  }

  // Transform the raw data into the correct types
  const sessionDetails: SessionDetails = {
    session_id: rawSessionDetails.session_id,
    course_id: rawSessionDetails.course_id,
    creator_id: rawSessionDetails.creator_id,
    start_time: new Date(rawSessionDetails.start_time),
    end_time: new Date(rawSessionDetails.end_time),
    url: rawSessionDetails.url,
    notes: rawSessionDetails.notes,
    subject_code: rawSessionDetails.subject_code,
    course_number: rawSessionDetails.course_number,
    title: rawSessionDetails.title,
    creator_name: rawSessionDetails.creator_name,
    rsvp_status: rawSessionDetails.rsvp_status,
    current_attendees: rawSessionDetails.current_attendees,
    messages: rawSessionDetails.messages.map((m: RowDataPacket) => ({
      message_id: m.message_id,
      content: m.content,
      created_at: m.created_at,
      author_name: m.author_name,
      likes: m.likes,
      has_liked: m.has_liked,
    })),
    attendees: rawSessionDetails.attendees.map((a: RowDataPacket) => ({
      name: a.name,
      rsvp_status: a.rsvp_status,
      rating: a.rating,
    })),
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">
                  {sessionDetails.subject_code} {sessionDetails.course_number}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {sessionDetails.title}
                </p>
              </div>
              <RSVPControl
                sessionId={sessionDetails.session_id}
                defaultStatus={sessionDetails.rsvp_status}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(
                      new Date(sessionDetails.start_time),
                      "MMMM d, yyyy"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(sessionDetails.start_time), "h:mm a")} -{" "}
                    {format(new Date(sessionDetails.end_time), "h:mm a")}
                  </span>
                </div>
                {sessionDetails.url && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <a
                      href={sessionDetails.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Join Session
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {sessionDetails.current_attendees}{" "}
                    {sessionDetails.current_attendees === 1
                      ? "person is"
                      : "people are"}{" "}
                    going
                  </span>
                </div>
              </div>

              {sessionDetails.notes && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Session Notes</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {sessionDetails.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MessageList
              messages={sessionDetails.messages}
              sessionId={sessionDetails.session_id}
            />
          </div>
          <div>
            <AttendeeList attendees={sessionDetails.attendees} />
          </div>
        </div>
      </div>
    </div>
  );
}
