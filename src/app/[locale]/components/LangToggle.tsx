"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export function LangToggle() {
  const locale = useLocale();
  const otherLocale = locale === "it" ? "en" : "it";
  const pathname = usePathname();

  // Link from next-intl handles /it/... ↔ /en/... automatically
  return (
    <Link href={pathname} locale={otherLocale}>
      <button>{locale === "it" ? "🇬🇧 EN" : "🇮🇹 IT"}</button>
    </Link>
  );
}
