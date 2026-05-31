import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/it/protected/dashboard/account");
}
