// components/getParams.tsx (Server Component)
import { Alert } from "@heroui/react";

export default function GetParamsMessage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const { success, error } = searchParams;

  return (
    <div className="my-0 mx-auto">
      {success && <Alert description={success} color="success" />}
      {error && <Alert description={error} color="danger" />}
    </div>
  );
}
