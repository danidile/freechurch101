"use client";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@heroui/button";
import startCheckout from "./startCheckout";

export default function Page({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const { userData, loading } = useUserStore();

  return (
    <Button
      onPress={() =>
        startCheckout(
          "price_1RhSKAPiftofwQpL9pyDiFxv",
          userData.id,
          userData.email,
          userData.church_id
        )
      }
    >
      Subscribe Now
    </Button>
  );
}
