import { createClient } from "@/utils/supabase/server";
import CompleteAccount from "./CompleteAccount";
import { redirect } from 'next/navigation'
import Sidebar from './sidebar';

export default async function Dashboard() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: churches } = await supabase
    .from('churches')
    .select("id , church_name");
    const churchList = [];
    if(churches){
      let church;
      for(let i=0; i < churches.length ; i++){
          church = {
              id: churches[i].id,
              churchName: churches[i].church_name
          };
          churchList.unshift(church);
      }
    }
    if(user){
      const userId: string = user.id;
      return (
        <div className="flex flex-row w-full gap-12">  
            <Sidebar />
            <div className="dashboard-container">
              <h6 className="text-md">Benvenuto {user.email}</h6>
              <CompleteAccount churchList={churchList} />
            </div>
    
    </div>
    );
    }else{
      redirect('/login');
    }
  }
  
  