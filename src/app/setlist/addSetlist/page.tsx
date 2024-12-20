import { createClient } from '@/utils/supabase/server'
import CreateSetlistForm from './createSetlistForm';
interface TsongNameAuthor {
id: string;
author: string;
song_title: string;
}
export default async function songs() {

const supabase = createClient()
const { data: songs  } = await supabase
.from('songs')
.select('*');
if(songs){
const newSongList: TsongNameAuthor[] = [];
let newSong: TsongNameAuthor = {id: "", author: "", song_title:""};
for(let i = 0; i< songs.length; i++){
  newSong = {id: songs[i].id, author: songs[i].author, song_title: songs[i].song_title};
  newSongList.unshift(newSong);
}    



return (<div className="container-sub">
  <CreateSetlistForm songsList={newSongList} />
</div>);
}
}
