// app/login/page.tsx
import GetParamsMessage from "@/app/components/getParams";
import CreateChurch from "./loginForm";

export default function Page({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col h-full justify-center items-center w-full lg:max-w-[50vw] mx-auto">
        <div className="container-sub">
          <CreateChurch />
          <GetParamsMessage searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}
