"use server";
import { createClient } from '@/utils/supabase/server'




    export default async function getSongs(){
        "use server";
        const supabase = createClient()
        const { data: songs } = await supabase
        .from('songs')
        .select('*');
    }
