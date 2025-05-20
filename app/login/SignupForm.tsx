"use client";

import { signup } from "@/app/actions/auth";
import { useActionState } from "react";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, undefined);
  return (
    <form className={"flex flex-col gap-4 w-full"} action={formAction}>
      <div className="flex gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="firstName" className={"font-medium"}>
            First Name
          </label>
          <input
            defaultValue={state?.data?.firstName}
            type="text"
            name={"firstName"}
            className={"p-2 border border-gray-400 rounded-md h-10"}
            required
          />
          {state?.errors?.firstName && (
            <p className="text-red-500 text-sm">{state.errors.firstName[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="lastName" className={"font-medium"}>
            Last Name
          </label>
          <input
            defaultValue={state?.data?.lastName}
            type="text"
            name={"lastName"}
            className={"p-2 border border-gray-400 rounded-md h-10"}
            required
          />
          {state?.errors?.lastName && (
            <p className="text-red-500 text-sm">{state.errors.lastName[0]}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={"font-medium"}>
          Email
        </label>
        <input
          defaultValue={state?.data?.email}
          type="email"
          name={"email"}
          className={"p-2 border border-gray-400 rounded-md h-10"}
          required
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors.email[0]}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="major" className={"font-medium"}>
          Major
        </label>
        <input
          defaultValue={state?.data?.major}
          type="text"
          name={"major"}
          className={"p-2 border border-gray-400 rounded-md h-10"}
          required
        />
        {state?.errors?.major && (
          <p className="text-red-500 text-sm">{state.errors.major[0]}</p>
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
          required
          minLength={8}
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
        Sign up
      </button>
    </form>
  );
}