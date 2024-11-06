// "use client"; 
// import { TeventSchema, eventSchema } from "@/utils/types/types";
// import {Button} from "@nextui-org/react";
// import { Input } from '@nextui-org/input';
// import { useForm } from "react-hook-form";
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useState } from "react";
// import { Select, SelectItem, Textarea} from "@nextui-org/react";
// // import {addEvent} from './addEventAction';
// import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
// import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForever';
// import {Accordion, AccordionItem} from "@nextui-org/accordion";
// import TextFieldsIcon from '@mui/icons-material/TextFields';
// import ArticleIcon from '@mui/icons-material/Article';
// interface Tsections {
//   id: string;
//   key: string;
//   isSong: boolean;
//   isTitle: boolean;
//   titleText?: string
//   description?: string;
//   duration?: string;
//   songId?: string;
// }
// interface TeventBasics {
//   type: string;
//   title: string;
//   date: string;
// }

// interface Tsong {
//   id: string;
//   song_title: string;
// }
// interface TsongNameAuthor {
//   id: string;
//   author: string;
//   song_title: string;
// }

// export default function CreateEventForm({songsList}: {songsList : TsongNameAuthor[]}) {
//     const newSongList = songsList;
//     const [state, setState] = useState <Tsections[]>([{id: "Titolo", key:"542908453", isSong: false, isTitle:true, titleText:"Inizio Life Celebration", duration: "", songId: ""}]);
//     const [eventDetails, setEventDetails] = useState<TeventBasics>({type: '0', title: "Culto domenicale", date: ""});
//     const [eventIsOther, setEventIsOther] = useState(false);
//     let x: string;
//     const durata = ["5min","10min","15min","20min","30min","40min","50min","1h","1:30h"];
//     const tipoEvento = ["Life Celebration","Riunione di Preghiera","Studio biblico","Youth Group","Concerto","Altro..."];



//     const AddSection = (event: React.MouseEvent<HTMLButtonElement>) => {
//       const target = event.currentTarget as HTMLInputElement 
//       if(target){

//       x = JSON.stringify(Math.floor((Math.random() * 10000000) + 1));
//         const id = target.id;
//         if(target.id === "Canzone"){
//           setState((section) => [
//             ...section,
//             {id: id, key: x ,isSong: true, isTitle: false, duration: "10min"}
            
//           ]);
//         } else if(target.id === "Titolo"){
//           setState((section) => [
//             ...section,
//             {id: id, key: x , isSong: false, isTitle: true, duration: "10min"}
            
//           ]);
//         }else{
//           setState((section) => [
//             ...section,
//             {id: id, key: x , isSong: false, isTitle: false, duration: "10min"}
            
//           ]);
//         }
//         }
//     };

//     const {
//       handleSubmit,
//       setValue,
//       formState: { isSubmitting },
//     } = useForm<TeventSchema>({
//       resolver: zodResolver(eventSchema)
//         });

//     // section => section[1] === event.target.id)
//     const removeSection = (event: React.MouseEvent<HTMLButtonElement>)=>{
//       const target = event.currentTarget as HTMLInputElement 
//       if(target){
//         setState(state.filter(section => section.key != target.id));
//       }
//     };
    
//     const istypeother = (event: React.ChangeEvent<HTMLSelectElement>) =>{

//       console.log(event.target.value);
//       setEventDetails({ ...eventDetails, type: event.target.value });
//       if(event.target.value == '4'){
//         setEventIsOther(true);
//       }else{
//         setEventIsOther(false);
//       }
//       setValue("eventType", event.target.value);
//       setValue("eventTitle", tipoEvento[Number(event.target.value)]);
//     }


//     const editTitle =(event: React.ChangeEvent<HTMLInputElement>)=>{
//       const target = event.currentTarget as HTMLInputElement 
//       setValue("eventTitle", target.value);

//       setEventDetails({ ...eventDetails, title: target.value });
//     }
//     const editDate = (event: React.ChangeEvent<HTMLInputElement>) => {
//       const target = event.currentTarget as HTMLInputElement 

//       setEventDetails({ ...eventDetails, date: target.value });
//     }
//     const editDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
//       const target = event.currentTarget as HTMLInputElement 
//       console.log(event);
//         setState(
//           state.map((section) => {
//             if(section.key == target.id){
//               section.description = target.value;
//               return section;
//             }else{
//               return section;
//             }
//           })
//         );
//     }
//     const editSong = (event: React.ChangeEvent<HTMLSelectElement>) => {
//       const target = event.currentTarget as HTMLSelectElement;
//       console.log(event);
//         setState(
//           state.map((section) => {
//             if(section.key == target.id){
//               section.description = target.value;
//               return section;
//             }else{
//               return section;
//             }
//           })
//         );
//     }
//     const editDuration = (event: React.ChangeEvent<HTMLSelectElement>) =>{
//       const target = event;
//       console.log(target);

//       // setState(
//       //   state.map((section) => {
//       //     if(section.key == target.id){
//       //       section.duration = target.value;
//       //       return section;
//       //     }else{
//       //       return section;
//       //     }
//       //   })
//       //   );
//       //   console.log(state);

//     }
//     const editTitleText = (event: React.ChangeEvent<HTMLInputElement>) => {
//       const target = event.currentTarget as HTMLInputElement 
//       console.log(event);
//         setState(
//           state.map((section) => {
//             if(section.key == target.id){
//               section.titleText = target.value;
//               return section;
//             }else{
//               return section;
//             }
//           })
//         );
//     }

//   const convertData = async () =>{
//     const formData= {
//     eventType: eventDetails.type,
//     eventTitle: eventDetails.title,
//     date: eventDetails.date,
//     start: "Hello",
//       sections: state};
//     console.log(formData);  

//     // addEvent(formData);
// }

// return (<>

// {/* <Script  type="text/javascript" src='/snippets/accordian.js' /> */}

//     <div className=" flex flex-row rounded-xl gap-3">
//     <div className="form-div">
//     <form onSubmit={handleSubmit(convertData)} >
//         <h4>Crea Evento</h4>
        
//         <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
//         <div className="gap-1.5">
//         <Select
//           label="Tipo di evento"
//           size="sm"
//           placeholder="Riunione dei Giovani..."
//           onChange={istypeother}
//         >
//           {tipoEvento.map((evento:string ,index) => (
                
//                 <SelectItem key={index} value={evento}>
//                     {evento}
//                 </SelectItem>
//                 ))}
//         </Select>
//         {eventIsOther && (
//           <Input
//         type="text"
//         label="Aggiungi Titolo evento"
//         variant="bordered"
//         size="sm"
//         onChange={editTitle}
//         />)}

        
//         </div>
//        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
//        <Input
//             type="date"
//             label="Event Date"
//             variant="bordered"
//             size="sm"
//             onChange={editDate}

//         />

// {/* 
// {errors.eventType && <p>{errors.eventType.message}</p>}
// {errors.eventTitle && <p>{errors.eventTitle.message}</p>}
//  */}

//         </div>
       
//         <h6 className="mt-6">Aggingi sezione</h6>
          

//           <div  className="transpose-button-container">
//                 <Button color="primary" variant="flat" type="button" id="Canzone"  onClick={AddSection}>Canzone</Button>
//                 <Button color="primary" variant="flat" type="button" id="Predica"  onClick={AddSection}>Predica</Button>
//                 <Button color="primary" variant="flat" type="button" id="Generico"  onClick={AddSection}>Generico</Button>
//                 <Button color="primary" variant="flat" type="button" id="Titolo"  onClick={AddSection}>Titolo</Button>
//           </div>
//             <div >
//             <Accordion selectionBehavior="replace" isCompact={true} selectionMode="single" variant="light" className="gap-4" keepContentMounted={true}>

//             {   
//                 state.map((element,index) =>{
//                     if(element.isTitle){
//                       return (
//                         <AccordionItem
//                         startContent={<TextFieldsIcon/>}
//                         key={element.key} aria-label="Accordion 1" title={element.id} >
//                             <Input                              
//                             name={"type"+element.key} 
//                             key={index}  value={element.id} className='hide-input'
//                             />
                            
                                    
//                             <Input
//                                     size="sm"
//                                     onChange={editTitleText}
//                                     id={element.key}
//                                     label="Titolo"
//                                     defaultValue="Inizio Life Celebration"
//                             />
//                              <Textarea
//                                      className="my-2"
//                                     size="sm"
//                                     onChange={editDescription}
//                                     id={element.key}
//                                     label="Descrizione"
//                                     placeholder="Inserisci informazioni utili..."
//                             />
//                             <Button size="sm"
//                               className="float-right my-2"
//                               isIconOnly type='button'
//                               variant="bordered"
//                               id={element.key}
//                               onClick={removeSection}
//                               accessKey={String(index)}
//                               >
//                                 <DeleteForeverOutlinedIcon/>
//                               </Button>
//                     </AccordionItem>
// )
//                     }else{
//                       return (
//                         <AccordionItem 
//                         startContent={<ArticleIcon/>}
//                         key={element.key} aria-label="Accordion 1" title={element.id}>

//                             <Input  
//                             name={"type"+element.key} key={element.key} value={element.id} className='hide-input' />

//                                         <Select
//                                         className="my-2"
                                        
//                                         size="sm"
//                                           label="Durata sezione"
//                                           placeholder="10min..."
//                                           onChange={editDuration}
//                                           key={element.key}
//                                         >
//                                           {durata.map((tempo:string ,index) => (
                                                
//                                                 <SelectItem key={index} value={tempo} >
//                                                     {tempo}
//                                                 </SelectItem>
//                                                 ))}
//                                         </Select>
                                        
//                                     {element.isSong && (
//                                       <Autocomplete 
                                      
//                                             size="sm"
//                                             fullWidth={true}
//                                             label="Seleziona la canzone" 
//                                             className="max-w-lg"
//                                             onChange={editSong}
//                                         >
//                                             {newSongList.map((song: Tsong) => (
                                                
//                                             <AutocompleteItem key={song.id} value={song.song_title}>
//                                                 {song.song_title}
//                                             </AutocompleteItem>
//                                             ))}
//                                         </Autocomplete>
                                        
    
//                                     )}
//                                     <Textarea
//                                           className="my-2"
//                                           label="Descrizione"
//                                           onChange={editDescription}
//                                           id={element.key}
//                                           size="sm"
//                                           labelPlacement="inside"
//                                           placeholder="Inserisci informazioni utili..."
//                                         />
//                                      <Button size="sm"
//                               className="float-right my-2"
//                               isIconOnly type='button'
//                               variant="bordered"
//                               id={element.key}
//                               onClick={removeSection}
//                               accessKey={String(index)}
//                               >
//                                 <DeleteForeverOutlinedIcon/>
//                               </Button>   
//                           </AccordionItem>

//                             )
//                     }
                    
//                 })
                
//             }
//                 </Accordion>

//             </div>

          

          

//           <br/><br/>
//           <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
//           Add Song
//           </Button>
//         </div>
//       </form>
//       </div>


//       <div className="schedule-presentation bg-slate-100 ">
      
//       <h4 className="border-b border-black">
//       {!eventIsOther && tipoEvento[Number(eventDetails.type)]}
//       {eventIsOther && eventDetails.title}
//       </h4>
//       <p className="mb-6">{eventDetails.date}</p>
      
//       {state.map((element) => {
//         if(element.id === "Titolo"){
//           return (
//           <div key={element.key}>
//           <div  className="event-section-titolo">
//             <p>{element.titleText}</p>
//             </div>
//             {element.description}
//           </div>);
//         }
//         return (<div key={element.key}>
//         <p>{element.id}<small>{element.duration}</small></p>
//         <small>{element.description}</small>
//         </div>
//       );
//       })}


//       </div>
//       </div>

// </>);
// }