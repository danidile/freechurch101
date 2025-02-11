"use client"

import { setListSongT, TsongSchema } from "@/utils/types/types";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@heroui/react";
import AudioFileIcon from '@mui/icons-material/AudioFile';
import ChordProViewComponent from "@/app/components/chordProViewComponent";
export default function ModalLyrics( {songData}:{songData:setListSongT}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
console.log(songData);

  return (
    <>
      <button onClick={onOpen}><AudioFileIcon  fontSize="small"/></button>
      <Modal 
        backdrop="opaque" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        isDismissable={true}
        size="3xl"
        classNames={{
            backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
          }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <ChordProViewComponent setListSong={songData}/>
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
  );
}