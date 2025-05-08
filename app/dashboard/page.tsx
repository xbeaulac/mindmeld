import { db } from "@/db";
import { RowDataPacket } from "mysql2";
import LogoutButton from "../components/LogoutButton";
export default async function Dashboard() {
  const [rows, fields] = await db.query<RowDataPacket[]>(
    "SELECT * FROM StudySession.Session"
  );
  console.log(rows);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Sessions</h2>
        <div className="flex flex-col gap-2">
          {rows.length > 0 ? (
            rows.map((row) => <p key={row.session_id}>{row.notes}</p>)
          ) : (
            <p>You have no upcoming sessions.</p>
          )}
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
