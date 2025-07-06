"use client";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@heroui/button";
import startCheckout from "./startCheckout";

export default function ProCheckoutButton() {
  const { userData, loading } = useUserStore();

  return (
    <Button
    variant="solid"
    color="primary"
      onPress={() =>
        startCheckout(
          "price_1RhSKAPiftofwQpL9pyDiFxv",
          userData.id,
          userData.email,
          userData.church_id
        )
      }
    >
      Scegli Piano
    </Button>
  );
}
