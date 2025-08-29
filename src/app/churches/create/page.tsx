// app/login/page.tsx
import CreateChurch from "./CreateChurchForm";

export default function Page() {
  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col h-full justify-center items-center w-full xl:max-w-[50vw] mx-auto">
        <div className="container-sub">
          <CreateChurch />
        </div>
      </div>
    </div>
  );
}
