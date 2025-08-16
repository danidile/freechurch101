"use server";

import ChurchSubscriptionPage from "./churchSubscriptionPage";
import { getChurchCustomerId } from "./getChurchCustomerId";
import { getChurchMembersCount } from "./getChurchMembersCount";

export default async function Page() {
  const customerId = await getChurchCustomerId();
  const churchMembersCount = await getChurchMembersCount();
  console.log(customerId);
  return <ChurchSubscriptionPage customerId={customerId} churchMembersCount={churchMembersCount} />;
}
