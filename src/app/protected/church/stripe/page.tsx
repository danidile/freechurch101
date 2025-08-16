"use server";

import ChurchSubscriptionPage from "./churchSubscriptionPage";
import { getChurchCustomerId } from "./getChurchCustomerId";

export default async function Page() {
  const customerId = await getChurchCustomerId();
  console.log(customerId)
  return <ChurchSubscriptionPage customerId={customerId}/>;
}
