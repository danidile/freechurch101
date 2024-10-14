"use client"

import { Button, Input, Textarea } from '@nextui-org/react';
import { useState } from 'react';

export default function Sections (){
    const [state, setState] = useState([]);
    let x;

    const AddSection = (event: { target: { id: any; }; }) => {
        x = Math.floor((Math.random() * 10000000) + 1);
        console.log(event.target.id);
        setState([
            ...state,
            [event.target.id, x ]
            
          ]);
    };

    // section => section[1] === event.target.id)
    const removeSection = (event: { target: { id: any; }; })=>{
        const array = state.filter(section => section[1] != event.target.id);
        setState(array);
    };

    

    return (
        <>  
            <div  className="transpose-button-container">
                <Button type="button" id="Canzone" className="button-transpose" onClick={AddSection}>Canzone</Button>
                <Button type="button" id="Predica" className="button-transpose" onClick={AddSection}>Predica</Button>
                <Button type="button" id="Generico" className="button-transpose" onClick={AddSection}>Generico</Button>
            </div>
            
            {
                state.map((element) =>{
                    console.log("Element" + element);
                    return (
                    <div key="" className='flex flex-col gap-1.5 bg-gray-200 rounded-2xl p-4'>
                        <p><strong>{element[0]}</strong></p>

                        <div className="container-input-2col flex gap-1.5">
                             <Input  name={"type"+element[1]} key={element[1]} value={element} className='hide-input' />
                                <div>
                                    <Input label="Duration:" type="time" name="duration"  />
                                </div>
                                <div>
                                    <Input label="Event Starts at:" type="time" name="start-hour"  />
                                </div>
                        </div>
                        <div>
                            <Textarea/>
                        </div>
                        <Button isIconOnly type='button' id={element[1]} onClick={removeSection}>X</Button>
                </div>)
                })
            }
        </>
);
}