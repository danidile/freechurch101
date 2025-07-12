"use client";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@heroui/button";
import startCheckout from "./startCheckout";

export default function CheckoutButton({ price }: { price: string }) {
  const { userData, loading } = useUserStore();

  return (
    <Button
      variant="solid"
      color="primary"
      onPress={() =>
        startCheckout(price, userData.id, userData.email, userData.church_id)
      }
    >
      Scegli Piano
    </Button>
  );
}
