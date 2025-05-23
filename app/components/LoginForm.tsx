"use client";

import { login } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);
  return (
    <form className={"flex flex-col gap-4 w-full"} action={formAction}>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={"font-medium"}>
          Email
        </label>
        <input
          defaultValue={state?.data?.email}
          type="email"
          name={"email"}
          className={"p-2 border border-gray-400 rounded-md h-10"}
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors.email[0]}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className={"font-medium"}>
          Password
        </label>
        <input
          defaultValue={state?.data?.password}
          type="password"
          name={"password"}
          className={"p-2 border border-gray-400 rounded-md h-10"}
        />
        {state?.errors?.password && (
          <p className="text-red-500 text-sm">{state.errors.password[0]}</p>
        )}
      </div>
      <button
        disabled={pending}
        type={"submit"}
        className={
          "bg-gray-900 text-white h-10 rounded-md font-medium hover:bg-gray-800 transition-color disabled:opacity-50"
        }
      >
        Sign in
      </button>
    </form>
  );
}
