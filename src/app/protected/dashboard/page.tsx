import { createClient } from "@/utils/supabase/server";
import Dashboard from '@/app/protected/dashboard/dashboard-components/dashboard'
import { redirect } from 'next/navigation'


export default async function App() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if(user){
    return (
      <>
          
          <Dashboard/>
    </>
    );
  } else{
    redirect('/login')
  }


}

