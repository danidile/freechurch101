"use client";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";
import LoginPage from "../(auth-pages)/login/page";
import LoginForm from "../(auth-pages)/login/loginForm";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, loading } = useUserStore();

  if (!loading && !userData.loggedIn && userData.fetched) return <LoginForm />;

  return (
    <div className="flex flex-row relative">
        <Sidebar />
      <div className="dashboard-container">{children}</div>
    </div>
  );
}
