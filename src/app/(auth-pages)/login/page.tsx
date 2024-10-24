import isLoggedIn from "@/utils/supabase/getuser";
import LoginForm from "./loginForm";
import {TalertMessage} from "@/utils/types/types";
import { redirect } from 'next/navigation'


export default async function Login({ searchParams }: { searchParams: TalertMessage }) {
  const loggedIn = await isLoggedIn();
  if(loggedIn){
    redirect('/protected/dashboard')
  }else{
    return (
      <LoginForm searchParams={searchParams}/>
    );
  }


}
