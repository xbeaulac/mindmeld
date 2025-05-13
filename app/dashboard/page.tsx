"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";
import LogoutButton from "../components/LogoutButton";

type RSVPStatus = "yes" | "maybe" | "no";

interface StudySession {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  hostName: string;
  currentAttendees: number;
  maxAttendees: number;
  rsvpStatus?: RSVPStatus;
}

const RSVPControl = ({
  value,
  onValueChange,
}: {
  value?: RSVPStatus;
  onValueChange: (value: RSVPStatus) => void;
}) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="flex gap-1 rounded-lg"
    >
      <div className="grid grid-cols-3 w-full">
        <Label
          htmlFor="rsvp-yes"
          className={cn(
            "flex items-center justify-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
            value === "yes" ? "bg-green-600 text-white" : "hover:bg-gray-100"
          )}
        >
          <RadioGroupItem value="yes" id="rsvp-yes" className="hidden" />
          Going
        </Label>
        <Label
          htmlFor="rsvp-maybe"
          className={cn(
            "flex items-center justify-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
            value === "maybe" ? "bg-yellow-600 text-white" : "hover:bg-gray-100"
          )}
        >
          <RadioGroupItem value="maybe" id="rsvp-maybe" className="hidden" />
          Maybe
        </Label>
        <Label
          htmlFor="rsvp-no"
          className={cn(
            "flex items-center justify-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
            value === "no" ? "bg-gray-600 text-white" : "hover:bg-gray-100"
          )}
        >
          <RadioGroupItem value="no" id="rsvp-no" className="hidden" />
          No
        </Label>
      </div>
    </RadioGroup>
  );
};

const SessionCard = ({
  session: initialSession,
}: {
  session: StudySession;
}) => {
  const [session, setSession] = useState(initialSession);

  const handleRSVPChange = (value: RSVPStatus) => {
    setSession({ ...session, rsvpStatus: value });
    // TODO: Add API call to update RSVP status
  };

  return (
    <Card key={session.id} className="py-0 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{session.title}</h3>
            <p className="text-sm text-muted-foreground">
              Hosted by {session.hostName}
            </p>
          </div>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {session.subject}
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{session.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{session.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span>
                {session.currentAttendees} / {session.maxAttendees} attendees
              </span>
            </div>
          </div>

          <RSVPControl
            value={session.rsvpStatus}
            onValueChange={handleRSVPChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const mockAvailableSessions: StudySession[] = [
    {
      id: "1",
      title: "Calculus II Final Review",
      subject: "Mathematics",
      date: "March 15, 2024",
      time: "3:00 PM - 5:00 PM",
      location: "Library Room 204",
      hostName: "Alex Brown",
      currentAttendees: 4,
      maxAttendees: 8,
    },
    {
      id: "2",
      title: "Python Programming Workshop",
      subject: "Computer Science",
      date: "March 16, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "CS Lab 101",
      hostName: "Sarah Chen",
      currentAttendees: 6,
      maxAttendees: 10,
    },
  ];

  const mockRSVPdSessions: StudySession[] = [
    {
      id: "3",
      title: "Biology Study Group",
      subject: "Biology",
      date: "March 17, 2024",
      time: "1:00 PM - 3:00 PM",
      location: "Science Building 302",
      hostName: "Mike Johnson",
      currentAttendees: 5,
      maxAttendees: 8,
      rsvpStatus: "yes",
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-bold">MindMeld</h1>
        <LogoutButton />
      </header>

      <main className="p-6">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="available">Available Sessions</TabsTrigger>
            <TabsTrigger value="rsvpd">RSVP'd Sessions</TabsTrigger>
          </TabsList>
          <TabsContent value="available">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockAvailableSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="rsvpd">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockRSVPdSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
