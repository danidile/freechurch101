import GetParamsMessage from "../components/getParams";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex flex-col gap-12 items-start">
      {children}
      <GetParamsMessage />
    </div>
  );
}
