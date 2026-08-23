import React from "react";
import { PageEnterAnimation } from "../components/transition/PageEnterAnimation";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageEnterAnimation>{children}</PageEnterAnimation>;
}
