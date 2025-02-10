"use client";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Button, Link } from "@nextui-org/react";
import { deleteSetList } from './deleteSetlistAction';


export default function ButtonDeleteSetlist({setlistID}: {setlistID : string }) {

    const deleteSetlist =(event : any)=>{
        deleteSetList(setlistID);
      }


  return (
    <Button isIconOnly color="danger" variant="flat" onPress={deleteSetlist}>
      <DeleteForeverRoundedIcon />
    </Button>
  );
}
