
import BlockDatesComponent from "./blockDatesComponent";
import { getBlockoutsByUserId } from "@/hooks/GET/getBlockoutsByUserId";
import { RangeValueString } from "@/utils/types/types";

export default async function App() {

  return (
    <div className="container-sub">
      <BlockDatesComponent />
    </div>
  );
}
