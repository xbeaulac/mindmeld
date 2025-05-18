import { getAllCourses } from "@/app/actions/functions";
import { getSession } from "@/app/lib/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CreateSessionForm from "./CreateSessionForm";

export default async function CreateSessionPage() {
  const session = await getSession();
  const courses = await getAllCourses();
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-lg mx-auto">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Create a New Session</h2>
          <CreateSessionForm
            courses={courses}
            userId={session?.userId as string}
          />
        </Card>
      </div>
    </div>
  );
}
