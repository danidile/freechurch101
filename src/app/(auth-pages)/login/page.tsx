// app/login/page.tsx
import GetParamsMessage from "@/app/components/getParams";
import LoginForm from "./loginForm";

export default function Page({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  return (
    <div className="flex flex-row h-[calc(100vh-75px)] w-full">
      <div className="h-full w-[50vw] hidden lg:block">
        <img
          className="h-full w-full object-cover "
          src="/images/monstera.webp"
          alt="desk"
        />
      </div>
      <div className="flex flex-col h-full justify-center items-center w-full lg:max-w-[50vw]">
        <div className="container-sub">
          <LoginForm />
          <GetParamsMessage searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}
