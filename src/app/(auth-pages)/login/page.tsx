// app/login/page.tsx
import GetParamsMessage from "@/app/components/getParams";
import LoginForm from "./loginForm";

export default function Page({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  return (
    <div className="container-sub">
      <LoginForm />
      <GetParamsMessage searchParams={searchParams} />
    </div>
  );
}
