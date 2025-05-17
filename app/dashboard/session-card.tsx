import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { getAllUpcomingSessions } from "../actions/functions";
import { RSVPControl } from "./rsvp-control";

export const SessionCard = ({
  session,
}: {
  session: Awaited<ReturnType<typeof getAllUpcomingSessions>>[number];
}) => {
  return (
    <Card className="py-0 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{session.title}</h3>
            <p className="text-sm text-muted-foreground">
              Hosted by {session.creator_name}
            </p>
          </div>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {session.subject_code} {session.course_number}
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{format(session.start_time, "MM/dd/yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>
                {format(session.start_time, "h:mm a")} -{" "}
                {format(session.end_time, "h:mm a")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{session.url}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span>
                {session.current_attendees}{" "}
                {session.current_attendees === 1 ? "person is " : "people are "}
                going
              </span>
            </div>
          </div>

          <RSVPControl
            sessionId={session.session_id}
            defaultStatus={session.rsvp_status}
          />
        </div>
      </CardContent>
    </Card>
  );
};
