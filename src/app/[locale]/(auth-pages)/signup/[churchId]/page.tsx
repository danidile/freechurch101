import { getChurchLogo } from "@/hooks/GET/getChurchLogo";
import SignupForm from "./signupForm";
import Image from "next/image";

export default async function SignupPage({
  params,
}: {
  params: Promise<{ churchId: string }>;
}) {
  const { churchId } = await params;

  const churchData = await getChurchLogo(churchId);
  console.log("churchData:", churchData);
  if (!churchId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-75px)] w-full">
        <div className="text-center max-w-sm p-6">
          <div className="text-4xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold mb-2">Link non valido</h2>
          <p className="text-sm text-gray-600">
            Per registrarti hai bisogno di un link di invito fornito dalla tua
            chiesa. Contatta il tuo responsabile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-[calc(100vh-75px)] w-full">
      <div className="relative h-screen bg-linear-to-br from-[#474be1] to-[#0e117f] overflow-hidden w-full hidden lg:block">
        <div className="pointer-events-none absolute inset-0 z-10 bg-[url('/images/noise1.webp')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-20 flex flex-col gap-5 items-center justify-center h-[90vh]">
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
      <div className="flex flex-col h-full items-center justify-center w-full lg:max-w-[40vw] p-4 overflow-y-auto">
        <SignupForm churchData={churchData} />
      </div>
    </div>
  );
}
