import { createClient } from '@/utils/supabase/server'
import { Input, Button } from '@nextui-org/react';
import { addSong } from './addChurchAction';

export default async function songs({ searchParams }: { searchParams: Message }) {
  const supabase = createClient()

  let { data: songs, error } = await supabase
  .from('songs')
  .select('*');


  return (<>
    

    <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Add Church</h1>
        <p className="text-sm text text-foreground">
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input label="Church Name" name="church-name" placeholder="La mia chiesa "  required />
          
          <Input label="Pastor" name="pastor" placeholder="Paolo " required />

          <Input label="Address" name="address" placeholder="Via XII Sett.."  />

          <Input label="Sito Web" name="website" placeholder="www.lamiachiesa.it"  />

          <Input label="handle Instagram" name="ig-handle" placeholder="@my_church" />

         
          
          <Button formAction={addSong}>
          Add Song
          </Button>
        </div>
      </form>




</>);
}