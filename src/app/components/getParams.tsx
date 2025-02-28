"use client";
import { useSearchParams } from "next/navigation";
import { Alert } from "@heroui/react";

export default function GetParamsMessage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  return (
    <div className="my-2 mx-auto">
      {success && <Alert description={success} color="success" />}
      {error && <Alert description={error} color="danger" />}
    </div>
  );
}
