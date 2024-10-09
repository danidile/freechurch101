"use client"
import ChordSheetJS from 'chordsheetjs';
import { Textarea } from '@nextui-org/input';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

import { SetStateAction, useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function  SongTextArea() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const disp = '';

    const [state, setState] = useState(disp);
    const [chords, setChords] = useState(disp);


    const convertIntoChordPro = ()=>{
        const chordSheet = state;
        console.log("chordSheet"+chordSheet)
        const parser = new ChordSheetJS.ChordsOverWordsParser();
        const song = parser.parse(chordSheet);
        const proFormatter = new ChordSheetJS.ChordProFormatter();
        const disp = proFormatter.format(song);
        setState(disp);
        const parserPro = new ChordSheetJS.ChordProParser();
        const songPro = parserPro.parse(chordSheet);
        const formatter = new ChordSheetJS.TextFormatter();
        const disp2 = formatter.format(songPro);
        setChords(disp2);

    };
    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        console.log(event.target.value);
        setState(event.target.value);
        setChords(event.target.value);

      };


    return (
        <>  
            <div className="transpose-button-container">
            <Button type="button" onClick={convertIntoChordPro} color="primary" variant="flat">
            Convert into ChordPro          </Button>
            </div>
            <Textarea
            label="Lyrics"
            name="lyrics"
            placeholder="inserisci testo"
            size="sm"
            minRows={50}
            maxRows={200}
            cols={100}
            value={state}
            onChange={handleInputChange}
          />
           <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody style={{whiteSpace: 'pre-wrap'}}>
              {chords}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
          
            
            
        </>
)
}