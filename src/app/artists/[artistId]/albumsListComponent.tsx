"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Button,
  Tooltip,
  addToast,
} from "@heroui/react";
import {
  GroupedSongsByAlbum,
  songType,
  SongWithAlbum,
} from "@/utils/types/types";
import Link from "next/link";
import { TbExternalLink } from "react-icons/tb";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useUserStore } from "@/store/useUserStore";
import { TbFileImport } from "react-icons/tb";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import importItalianSongIntoChurchAction from "./importItalianSongIntoChurchAction";
export default function AlbumsListComponent({
  songsByAlbum,
  artist,
}: {
  songsByAlbum: GroupedSongsByAlbum;
  artist: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [songToImport, setSongToImport] = useState<SongWithAlbum>();
  const { userData } = useUserStore();
console.log("songsByAlbum",songsByAlbum);
  const importItalianSongIntoChurch = async () => {
    const response = await importItalianSongIntoChurchAction(songToImport);
    if (response.success) {
      addToast({
        title: `Canzone Aggiunta con successo!`,
        description: response.message,
        color: "success",
      });
    } else {
      addToast({
        title: `Errore:`,
        description: response.message,
        color: "danger",
      });
    }
  };
  return (
    <>
      <div className="songs-header">
        <h4>Canzoni</h4>
      </div>
      <div className="container-album-list">
        {Object.entries(songsByAlbum).map(([albumName, songs]) => (
          <Card className="max-w-[600px] w-full" key={albumName}>
            <CardHeader className="flex gap-3">
              <Image
                alt="heroui logo"
                height={60}
                radius="sm"
                className="object-cover"
                src={`/images/${artist}.webp`}
                width={60}
              />
              <div className="flex flex-col">
                <h4>{albumName}</h4>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <table className="ntable">
                <thead>
                  <tr>
                    <th key="name">Nome</th>
                    {userData &&
                      hasPermission(
                        userData.role as Role,
                        "delete:setlists"
                      ) && (
                        <th key="import" className="w-[60px]">
                          Importa
                        </th>
                      )}
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song, rowIdx) => (
                    <tr key={rowIdx}>
                      <td key="name">
                        <Link
                          href={`/italiansongs/${song.id}`}
                          className="w-full"
                        >
                          <p className="truncate">{song.song_title}</p>
                        </Link>
                      </td>

                      {userData &&
                        hasPermission(
                          userData.role as Role,
                          "delete:setlists"
                        ) && (
                          <td key="import" className="text-center!">
                            <Tooltip content="Importa nella lista della tua chiesa">
                              <Button
                                onPress={() => {
                                  setSongToImport(song);
                                  onOpen();
                                }}
                                size="sm"
                                variant="light"
                                isIconOnly
                              >
                                <TbFileImport size={20} />
                              </Button>
                            </Tooltip>
                          </td>
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
            <Divider />
          </Card>
        ))}
        <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Importa Canzone
                </ModalHeader>
                <ModalBody>
                  <p>
                    Confermi di voler importare la canzone
                    <b> {songToImport.song_title} </b> di {songToImport.artist}{" "}
                    nel registro della tua chiesa?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Annulla
                  </Button>
                  <Button
                    color="primary"
                    onPress={async () => {
                      await importItalianSongIntoChurch();
                      onClose();
                    }}
                  >
                    Conferma
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
