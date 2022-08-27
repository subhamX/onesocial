import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * This component wraps everything such that we take at least 100vh height
 */
export const Layout = ({ children }: Props) => (
  // Ensure that you pass only two blocks
  // one having content and another having footer
  <div className="min-h-screen">{children}</div>
);
