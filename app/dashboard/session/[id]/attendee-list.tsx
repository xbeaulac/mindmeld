import { RSVPStatus } from "@/app/actions/functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Attendee = {
  name: string;
  rsvp_status: RSVPStatus;
  rating: number | null;
};

export function AttendeeList({ attendees }: { attendees: Attendee[] }) {
  const goingAttendees = attendees.filter((a) => a.rsvp_status === "Yes");
  const maybeAttendees = attendees.filter((a) => a.rsvp_status === "Maybe");
  const noAttendees = attendees.filter((a) => a.rsvp_status === "No");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendees</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goingAttendees.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">
                Going ({goingAttendees.length})
              </h3>
              <div className="space-y-2">
                {goingAttendees.map((attendee) => (
                  <div key={attendee.name}>{attendee.name}</div>
                ))}
              </div>
            </div>
          )}
          {maybeAttendees.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">
                Maybe ({maybeAttendees.length})
              </h3>
              <div className="space-y-2">
                {maybeAttendees.map((attendee) => (
                  <div key={attendee.name}>{attendee.name}</div>
                ))}
              </div>
            </div>
          )}

          {noAttendees.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">
                Not Going ({noAttendees.length})
              </h3>
              <div className="space-y-2">
                {noAttendees.map((attendee) => (
                  <div key={attendee.name}>{attendee.name}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
