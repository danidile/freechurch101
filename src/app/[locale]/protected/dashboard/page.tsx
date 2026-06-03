import { redirect } from "@/i18n/navigation";
export default function App({ params }: { params: { locale: string } }) {
  redirect({ href: "/protected/dashboard/account", locale: params.locale });

}
