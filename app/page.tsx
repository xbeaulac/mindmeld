"use client";

import LoginForm from "@/app/login/LoginForm";
import SignupForm from "@/app/login/SignupForm";
import Logo from "@/app/Logo";
import { useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex-1 flex flex-col items-center max-w-xs">
        <Logo />
        <h2 className={"font-bold text-lg"}>Welcome to MindMeld</h2>
        <p className={"text-gray-500 mb-4"}>
          {isLogin ? "Log in to lock in." : "Create an account to get started."}
        </p>
        <div className="flex flex-col gap-2 w-full">
          {isLogin ? <LoginForm /> : <SignupForm />}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 text-sm mt-2 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </main>
    </div>
  );
}