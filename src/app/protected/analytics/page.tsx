"use client";

import { useUserStore } from "@/store/useUserStore";
import ChurchAnalitics from "./ChurchAnalitics";
import AdminAnalitics from "./AdminAnalitics";

export default function Page() {
  const { userData } = useUserStore();
  if (userData.email === "danidile94@gmail.com") {
    return (
      <>
        <AdminAnalitics />
      </>
    );
  }
  return (
    <>
      <ChurchAnalitics />
    </>
  );
}
