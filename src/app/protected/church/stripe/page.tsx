"use server";

import { HeaderCL } from "@/app/components/header-comp";
import ChurchSubscriptionPage from "./churchSubscriptionPage";
import { getChurchCustomerId } from "./getChurchCustomerId";
import { getChurchMembersCount } from "./getChurchMembersCount";
import { FaRegCreditCard } from "react-icons/fa";

export default async function Page() {
  const customerId = await getChurchCustomerId();
  const churchMembersCount = await getChurchMembersCount();
  console.log(customerId);
  return (
    <>
      <div className="container-sub">
        <HeaderCL
          icon={FaRegCreditCard}
          title="Gestisci Abbonamento"
          description="Gestisci il tuo piano e le tue fatture."
        />
      </div>
      <ChurchSubscriptionPage
        customerId={customerId}
        churchMembersCount={churchMembersCount}
      />
    </>
  );
}
