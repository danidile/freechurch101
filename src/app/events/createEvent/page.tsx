import { createClient } from '@/utils/supabase/server'

import Link from "next/link";
import { addEvent } from './addEventAction';
import Sections from './sections';
import { Button, Input } from '@nextui-org/react';
import CreateEventForm from './createEventForm';

import getSongs from "./getSongs";
import { get } from 'http';



export default async function songs() {
  
  const supabase = createClient()
  const { data: songs } = await supabase
  .from('songs')
  .select('*');
  
  return (<>
    
    
      <CreateEventForm songsList={songs} />




</>);
}