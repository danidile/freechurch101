
import BlockDatesComponent from "./blockDatesComponent";
import { getBlockoutsByUserId } from "@/hooks/GET/getBlockoutsByUserId";
import { RangeValueString } from "@/utils/types/types";

export default async function App() {
  const blockedDates: RangeValueString[] = await getBlockoutsByUserId();

  return (
    <div className="container-sub">
      <BlockDatesComponent preBlockedDates={blockedDates} />
    </div>
  );
}
