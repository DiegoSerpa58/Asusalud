import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border bg-white p-4">{children}</div>;
}
