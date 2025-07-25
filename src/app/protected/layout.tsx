"use client";
import { useUserStore } from "@/store/useUserStore";
import LoginForm from "../(auth-pages)/login/loginForm";
import LoginPage from "../(auth-pages)/login/page";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, loading } = useUserStore();

  if (!loading && !userData.loggedIn && userData.fetched) return <LoginPage />;

  return <>{children}</>;
}
