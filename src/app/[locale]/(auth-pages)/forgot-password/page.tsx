import { TalertMessage } from "@/utils/types/types";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: Promise<TalertMessage>;
}) {
  const awaitedParams = await searchParams;
  return <ForgotPasswordForm searchParams={awaitedParams} />;
}
