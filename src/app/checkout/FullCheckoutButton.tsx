"use client";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@heroui/button";
import startCheckout from "./startCheckout";

export default function FullCheckoutButton() {
  const { userData, loading } = useUserStore();

  return (
    <Button
        variant="solid"
    color="primary"
      onPress={() =>
        startCheckout(
          "price_1RhSJPPiftofwQpL9u5gveG5",
          userData.id,
          userData.email,
          userData.church_id
        )
      }
    >
      Sceglia Piano
    </Button>
  );
}
