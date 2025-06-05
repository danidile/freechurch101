import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import BlockDatesComponent from "./blockDatesComponent";
import { getBlockoutsByUserId } from "@/hooks/GET/getBlockoutsByUserId";
import { RangeValue, RangeValueString } from "@/utils/types/types";

export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  const blockedDates: RangeValueString[] = await getBlockoutsByUserId(userData.id);
  return (
    <div className="container-sub">
      <BlockDatesComponent preBlockedDates={blockedDates} />
    </div>
  );
}
