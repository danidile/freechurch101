"use client";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { getSongs } from "@/hooks/GET/getSongs";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { songType } from "@/utils/types/types";
import { importPlanningCenterSongsAction } from "./importPlanningCenterSongsAction";
export default function importPlanningCenterSongs() {
  const { userData, loading } = useUserStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [ChurchSongs, setChurchSongs] = useState<any[] | null>(null);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const fetchedSongs = await getSongs(userData);
      setChurchSongs(fetchedSongs);
      setLoadingSongs(false);
    };
    fetchSongs();
  }, []);

  const [songs, setSongs] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleRowSelection = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const allSelected = selectedRows.length === songs.length && songs.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(songs.map((_, index) => index));
    }
  };

  const excludedColumns = [
    "CCLI",
    "Themes",
    "Notes",
    "Arrangement 1 Length",
    "Arrangement 1 Length",
    "Arrangement 1 Tag 1",
    "Arrangement 1 Tag 2",
    "Arrangement 1 Chord Chart Key",
    "Arrangement 2 Name",
    "Arrangement 2 BPM",
    "Arrangement 2 Length",
    "Arrangement 2 Notes",
    "Arrangement 2 Keys",
    "Arrangement 2 Chord Chart",
    "Arrangement 1 Name",
  ];
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: { data: any[]; }) => {
        const data = result.data as any[];
        setSongs(data);
        setHeaders(Object.keys(data[0] || {}));
      },
      error: (error: any) => {
        console.error("CSV parsing error:", error);
      },
    });
  };
  const filteredHeaders = headers.filter(
    (header) => !excludedColumns.includes(header)
  );
  function findDuplicateTitles(
    bulkSongs: any[],
    dbSongs: songType[]
  ): string[] {
    // Create a Set of existing titles (lowercase for case-insensitive check)
    const existingTitles = new Set(
      dbSongs.map((song) => song.song_title.toLowerCase().trim())
    );

    // Filter bulkSongs to find titles that already exist in DB
    const duplicates = bulkSongs
      .map((song) => song["Title"]?.trim() ?? song.title?.trim())
      .filter((title) => existingTitles.has(title?.toLowerCase()));

    return duplicates;
  }

  const removeFromSelection = (titleToRemove: string) => {
    setSelectedRows((prev) =>
      prev.filter((idx) => {
        const song = songs[idx];
        const songTitle = (song["Title"] ?? song.title ?? "").trim();
        return songTitle.toLowerCase() !== titleToRemove.toLowerCase();
      })
    );
  };
  const transformSongs = (rawSongs: any[]): any[] => {
    return rawSongs.map((song) => ({
      song_title: song["Title"] ?? "",
      lyrics: song["Arrangement 1 Chord Chart"] ?? "",
      upload_key: song["Arrangement 1 Chord Chart Key"] ?? "",
      church: userData?.church_id,
      notes: song["Arrangement 1 Notes"] ?? "",
      tags: song["Song Tag 1"] ?? null,
      bpm: song["Arrangement 1 BPM"] ?? null,
    }));
  };

  const importSongsIntoChurchFunction = async () => {
    const selectedSongs = selectedRows.map((idx) => songs[idx]);
    const newSongs = transformSongs(selectedSongs);
    // Here you would typically send newSongs to your backend to save them
    // For now, we will just log them
    console.log("Importing songs:", newSongs);
    const response = await importPlanningCenterSongsAction(newSongs);
    
  };

  return (
    <div className="p-4 max-w-5xl mx-auto flex flex-col items-center ">
      <div className="max-w-md mx-auto p-6 ncard nborder mb-4 flex-col items-center justify-center">
        <h6 className="font-extrabold mb-6 text-center text-gray-800">
          Importa canzoni da Planning Center
        </h6>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-600
               file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-100 file:text-blue-700
               hover:file:bg-blue-200
               cursor-pointer"
        />
      </div>

      {songs.length > 0 && (
        <div className="overflow-auto max-h-[60vh]">
          <table className="min-w-full table-auto border-collapse">
            <thead className="sticky top-0 z-10 bg-white shadow-sm">
              <tr>
                <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-sm font-semibold text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-blue-500"
                  />
                </th>
                <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-sm font-semibold text-left">
                  #
                </th>
                {filteredHeaders.map((header: string, index: number) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-left bg-gray-100 text-sm font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {songs.map((row: any, rowIndex: number) => {
                const isSelected = selectedRows.includes(rowIndex);
                return (
                  <tr
                    key={rowIndex}
                    onClick={() => toggleRowSelection(rowIndex)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? "bg-blue-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRowSelection(rowIndex)}
                        onClick={(e) => e.stopPropagation()} // prevent row click from double toggling
                        className="w-4 h-4 accent-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-sm">
                      {rowIndex + 1}
                    </td>
                    {filteredHeaders.map((header: string, colIndex: number) => (
                      <td
                        key={colIndex}
                        className="border align-middle border-gray-300 px-4 py-[2PX]  text-sm"
                      >
                        <div className="whitespace-pre-wrap max-h-[40px] overflow-auto">
                          {row[header]}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {songs.length > 0 && (
        <Button color="primary" className="mx-auto my-3" onPress={onOpen}>
          Importa Canzoni
        </Button>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => {
            const selectedSongs = selectedRows.map((idx) => songs[idx]);
            const duplicates = findDuplicateTitles(selectedSongs, ChurchSongs);

            return (
              <>
                <ModalHeader>Importa Canzoni</ModalHeader>
                <ModalBody>
                  <p>
                    Stai importando <b>{selectedRows.length}</b> canzoni nella
                    tua chiesa…
                  </p>
                  <ScrollShadow
                    hideScrollBar
                    className="max-w-[400px] max-h-[300px]"
                    offset={100}
                    orientation="horizontal"
                  >
                    {selectedSongs.map((song) => {
                      return <p>{song.Title}</p>;
                    })}
                  </ScrollShadow>

                  {duplicates.length > 0 && (
                    <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
                      <h6 className="font-semibold">Attenzione!</h6>
                      <p>
                        Le seguenti canzoni sembrano essere già presenti nella
                        lista della tua chiesa. Clicca <b>Rimuovi</b> per
                        escluderle dall’importazione.
                      </p>
                      <ScrollShadow
                        hideScrollBar
                        className="max-w-[400px] max-h-[300px]"
                        offset={100}
                        orientation="horizontal"
                      >
                        <ul className="list-disc  mt-2 ">
                          {duplicates.map((title, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-center"
                            >
                              <span>{title}</span>
                              <Button
                                color="danger"
                                size="sm"
                                className="mr-0"
                                variant="ghost"
                                onPress={() => removeFromSelection(title)}
                              >
                                Rimuovi
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </ScrollShadow>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    fullWidth
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    Cancella
                  </Button>
                  <Button
                    fullWidth
                    color="primary"
                    onPress={() => {
                      onClose;
                      importSongsIntoChurchFunction();
                    }}
                  >
                    Importa
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </div>
  );
}
