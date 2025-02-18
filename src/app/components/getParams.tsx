"use client";
import { useSearchParams } from "next/navigation";
import { Alert } from "@heroui/react";

export default function GetParamsMessage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  if (success) {
    return (
      <div className="my-3">
        <Alert description={success} color="success" />
      </div>
    );
  }
}
