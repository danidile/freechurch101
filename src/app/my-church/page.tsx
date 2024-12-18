import { redirect } from 'next/navigation'
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import fchurchMembers from '@/utils/supabase/getChurchMembers';


export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  const churchId :string = userData.church_id;
  const churchMembers: basicUserData[] = await fchurchMembers({churchId});
console.log(churchMembers);
  if(["2"].includes(userData.role.toString())){
    return (
      <>
          {churchMembers.map((member)=>{
              return(
                <div className="song-list" key={member.id}>
                  <p key={member.id}>
                    {member.name}
                    <br />
                    <small>{member.email}</small>
                    
                  </p>
                  <p>{member.role}</p>
                  
                
              </div>
              )
          })}
    </>
    );
  } else{
    redirect('/login')
  }


}

