'use client'
import { Button,Input, Link } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { TuserData, userData } from "@/utils/types/userData";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {completeAccountAction} from './completeAccountAction';
import { TchurchMinimalData } from "@/utils/types/types";


export default function CompleteAccount({ churchList, userId }){
    const id = userId;
    const {
        register,
        handleSubmit,
        formState: {  isSubmitting },
      } = useForm<TuserData>({
        resolver: zodResolver(userData),
      });

      const convertData = async (data: TuserData) => {
        for(let i=0;i<churchList.length ; i++){
          if(churchList[i].churchName === data.church){
            data.church = churchList[i].id;
          }
        }

        completeAccountAction(data);
      console.log(data.church);
      }

    return(
        <>
        <form onSubmit={handleSubmit(convertData)}>
        <h1 className="text-2xl font-medium">Completa il tuo Profilo</h1>
     
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">

        <div className="flex gap-4 items-center">
        <Input 
        {...register("name",)}
        label="Nome"
        variant="bordered"
          size="sm"
          />
       
       <Input 
       {...register("lastname")}
       label="Cognome"
       variant="bordered"
       size="sm"

        />
        </div>
       

        <Autocomplete  variant="bordered"
        placeholder="La mia chiesa..."
        {...register("church")}

        label="Seleziona la tua chiesa" 
        >
            {churchList.map((church: TchurchMinimalData) => (
                
            <AutocompleteItem key={church.id} value={church.id}>
                {church.churchName}
            </AutocompleteItem>
            ))}
        </Autocomplete>
       <small>Se la tua chiesa non è nella lista <Link size="sm" underline="hover" href="/churches/addChurch">Clicca qui</Link></small>


       <Input 
       {...register("id")}
       name="id"
       label="id"
       className="hidden"
       value={id}
        />

       
       
       <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
         Aggiorna profilo
       </Button>

     </div>
        </form>
    </>
    );
}