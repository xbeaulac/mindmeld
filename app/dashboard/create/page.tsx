import { getAllCourses } from "@/app/actions/functions";
import { Card } from "@/components/ui/card";
import { getSession } from "@/app/lib/session";
import CreateSessionForm from "./CreateSessionForm";

export default async function CreateSessionPage() {
  const session = await getSession();
  const courses = await getAllCourses();
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Create a New Session</h2>
        <CreateSessionForm
          courses={courses}
          userId={session?.userId as string}
        />
      </Card>
    </div>
  );
}
