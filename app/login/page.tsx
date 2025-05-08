import Logo from "../Logo";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex-1 flex flex-col items-center max-w-xs">
        <Logo />
        <h2 className={"font-bold text-lg"}>Welcome to MindMeld</h2>
        <p className={"text-gray-500 mb-4"}>Log in to lock in.</p>
        <div className="flex flex-col gap-2 w-full">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
