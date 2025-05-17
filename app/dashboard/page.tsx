import { getAllUpcomingSessions } from "../actions/functions";
import LogoutButton from "../components/LogoutButton";
import Logo from "../Logo";
import { SessionCard } from "./session-card";

export default async function Dashboard() {
  const sessions = await getAllUpcomingSessions();

  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Logo className="w-10 h-10" />
          <h1 className="text-xl font-bold">MindMeld</h1>
        </div>
        <LogoutButton />
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <SessionCard key={session.session_id} session={session} />
          ))}
        </div>
      </main>
    </div>
  );
}
