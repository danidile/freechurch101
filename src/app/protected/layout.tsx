import type { Metadata } from "next";

import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import { encodedRedirect } from "@/utils/utils";

export const metadata: Metadata = {
  title: "ChurchLab",
  description: "Dai struttura alla tua chiesa",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData: basicUserData = await fbasicUserData();
console.log(userData.loggedIn);
  if(userData.loggedIn){
  return (<>
    {children}
    </>
  )}else{
      return encodedRedirect("error", "/login", "login to access the dashboard");
  }

}
