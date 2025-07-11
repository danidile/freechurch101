// app/login/page.tsx
import GetParamsMessage from "@/app/components/getParams";
import LoginForm from "./loginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-row h-[calc(100vh-75px)] w-full ">
      <div className="relative  h-screen bg-gradient-to-br from-[#474be1] to-[#0e117f] overflow-hidden w-full hidden lg:block">
        {/* Grain overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[url('/images/noise1.webp')] opacity-20 mix-blend-overlay"></div>

        {/* Your content */}
        <div className=" relative z-20 flex flex-col gap-5 items-center justify-center h-[90vh]">
          <div className="flex gap-5 items-center justify-center">
            <Image
              src="/images/brand/Logo_white.png"
              alt="Logo ChurchLab"
              width={140}
              height={80}
            />
            <h1 className="text-white text-6xl font-medium mb-7">
              Benvenuto su
              <br />
              ChurchLab
            </h1>
          </div>

          <h4 className="text-white text-xl font-normal max-w-[600px]">
            <span className="underline-offset-4 underline">
              La Tua Chiesa, Sempre Organizzata.
            </span>{" "}
            Una piattaforma completa per pianificare servizi, gestire team,
            archiviare canti e coordinare i volontari, tutto in cloud.
          </h4>
        </div>
      </div>
      <div className="flex flex-col h-full items-center justify-center w-full lg:max-w-[40vw]  p-4">
        <LoginForm />
      </div>
    </div>
  );
}
