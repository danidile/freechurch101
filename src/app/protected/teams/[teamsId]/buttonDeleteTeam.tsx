"use client";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Button, Link } from "@heroui/react";
import { deleteSetList } from '@/app/setlist/[setListId]/deleteSetlistAction';
import { MdDelete } from "react-icons/md";


export default function ButtonDeleteTeam({setlistID}: {setlistID : string }) {

    const deleteSetlist =(event : any)=>{
        deleteSetList(setlistID);
      }


  return (
    <Button fullWidth size='md' color="danger" startContent={<MdDelete />} variant="flat" onPress={deleteSetlist}>
       Elimina
    </Button>
  );
}
