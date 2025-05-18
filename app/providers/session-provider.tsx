"use client";

import { createContext, useContext } from "react";

type SessionContextType = {
  userId: number;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: number;
}) {
  return (
    <SessionContext.Provider value={{ userId }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
