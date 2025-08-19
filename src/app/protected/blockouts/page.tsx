import { HeaderCL } from "@/app/components/header-comp";
import BlockDatesComponent from "./blockDatesComponent";
import { LuCalendarOff } from "react-icons/lu";

export default function App() {
  return (
    <div className="container-sub">
      <HeaderCL
        icon={LuCalendarOff}
        title="Blocca Date"
        description="            Gestisci i periodi in cui non sarai disponibile per le turnazioni.
"
      />{" "}
      <BlockDatesComponent />
    </div>
  );
}
