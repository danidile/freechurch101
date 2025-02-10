"use client"; 

import { Input, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Tchurch, church } from "@/utils/types/types";


export default  function AddChurch() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Tchurch>({
    resolver: zodResolver(church),
  });
  



  const convertData = async (data: Tchurch) =>{
    console.log(data);
  }
  

  return (<>
    

    <form onSubmit={handleSubmit(convertData)} className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Add Church</h1>
        <p className="text-sm text text-foreground">
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input {...register("churchName",)} label="Church Name" name="church-name" placeholder="La mia chiesa "  required />
          
          <Input {...register("pastor",)} label="Pastor" name="pastor" placeholder="Paolo " required />

          <Input {...register("address",)} label="Address" name="address" placeholder="Via XII Sett.."  />

          <Input {...register("website",)} label="Sito Web" name="website" placeholder="www.lamiachiesa.it"  />

          <Input {...register("igHandle",)} label="handle Instagram" name="ig-handle" placeholder="@my_church" />

         
          
          <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
          Add Song
          </Button>
        </div>
      </form>




</>);
}