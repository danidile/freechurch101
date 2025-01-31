"use client";

import { TalertMessage } from "@/utils/types/types";

export default function Signup({
  searchParams,
}: {
  searchParams: TalertMessage;
}) {
  return (
    <div className="container-sub">
      <div
        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative my-96"
        role="alert"
      >
        <strong className="font-bold">Thank you for signing up!</strong>
        <span className="block sm:inline"> Check your Email to verify your account and
        complete registration.</span>
        
      </div>

    </div>
  );
}
