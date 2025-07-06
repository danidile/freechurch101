"use client";

import MenuBarComponentSecondary from "./menuBarComponent2";

import { useUserStore } from "@/store/useUserStore";

export default function MenuBar() {
  const { userData } = useUserStore();

  return <MenuBarComponentSecondary />;
}
