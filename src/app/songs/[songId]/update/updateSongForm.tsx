"use client";
import { VscPreview } from "react-icons/vsc";

import { albumsT, artistsT, songSchema } from "@/utils/types/types";
import { Button } from "@heroui/react";
import { ChevronDown, ChevronUp, Eye, Maximize2, Music, X } from "lucide-react"; // optional icons
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Textarea } from "@heroui/input";
import { useForm } from "react-hook-form";
import { useState, useRef, SetStateAction, useEffect } from "react";
import { toChordPro } from "@/utils/chordProFunctions/chordProFuncs";
import { updateSong } from "./updateSongAction";
import { FaUndoAlt, FaRedoAlt, FaRegTrashAlt, FaInfo } from "react-icons/fa";
import { addSong } from "../../addSong/addSongAction";
import { usePathname } from "next/navigation";
import { updateItalianSongAction } from "@/app/italiansongs/[songId]/update/updateItalianSongAction";
import { addItalianSong } from "@/app/italiansongs/additaliansong/addItalianSongAction";
import { keys } from "@/constants";
import { useChurchStore } from "@/store/useChurchStore";
import AutocompleteCL, {
  AutocompleteOption,
} from "@/app/components/autocompleteOption";
import { MusicUploaderHandle } from "@/app/components/musiUploader/MusicUploader";
import MusicUploaderInput from "@/app/components/musiUploader/MusicUploader";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { getAudioFileSongNames } from "@/hooks/GET/getAudioFileSongNames";
import { deleteAudiosAction } from "./deleteAudiosAction";
import ChordProViewComponentAlt from "@/app/components/chordProViewComponentAlt";
import { useScreenSize } from "@/app/components/useScreenSize";
import { LuAudioLines } from "react-icons/lu";

export default function UpdateSongForm({
  songData,
  type,
  artists,
  albums,
}: {
  songData: songSchema;
  type: string;
  artists?: artistsT[];
  albums?: albumsT[];
}) {
  const [audioPaths, setAudioPaths] = useState<string[]>([]);
  const { userData } = useUserStore();
  const { width, height } = useScreenSize();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    if (songData.audio_path) {
      const folderPath = `${userData.church_id}/music/audio/${songData.id}`;
      getAudioFileSongNames("churchdata", folderPath).then((names) => {
        console.log("Files in folder:", names);
        setAudioPaths(names);
      });
    }
  }, []);
  const musicUploaderRef = useRef<MusicUploaderHandle>(null);
  const router = useRouter();

  const artistsOptions: AutocompleteOption[] = artists?.map((artist) => {
    return { key: artist.username, label: artist.artist_name };
  });
  const albumOptions: AutocompleteOption[] = albums?.map((album) => {
    return {
      key: album.id,
      label: album.album_name,
      value: { artist_username: album.artist_username },
    };
  });
  const [selectedArtist, setSelectedArtist] = useState<string | null>(
    songData?.artist || null
  );
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(
    songData?.album || null
  );
  const {
    isOpen: deleteAudioIsOpen,
    onOpen: deleteAudioOnOpen,
    onOpenChange: deleteAudioOnOpenChange,
  } = useDisclosure();

  const { tags } = useChurchStore();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    songData?.tags ? songData.tags.split(",").map((tag) => tag.trim()) : []
  );
  const pathname = usePathname(); // e.g. "/italiansongs/7784d9a0-2d3d..."
  const category = pathname.split("/")[1]; // "italiansongs"
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState(songData?.lyrics);
  const [history, setHistory] = useState<string[]>([]);
  const [audiosToDelete, setAudiosToDelete] = useState<string[]>([]);
  const [selectedAudioToDelete, setSelectedAudioToDelete] =
    useState<string>(null);
  const [future, setFuture] = useState<string[]>([]);
  const dropdownRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<songSchema>({
    defaultValues: {
      ...songData,
    },
  });
  const isChordPro = watch("is_chordpro") || false;

  const previewData = {
    time_signature: watch("time_signature"),
    bpm: watch("bpm"),
    id: "",
    song: "",
    singer: "",
    singerName: "",
    song_title: watch("song_title"),
    author: watch("author"),
    key: "",
    lyrics: state,
    upload_key: "",
    order: 0,
    type: "",
    global_song: "",
    isSong: false,
    isTitle: false,
    duration: "",
    tonalita: "",
    note: "",
    setlist_id: "",
    title: "",
    originalIndex: 0,
    audio_path: "",
    is_chordpro: watch("is_chordpro"),
  };
  const insertBold = () => {
    const el = textAreaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    const selected = state.substring(start, end);
    const before = state.substring(0, start);
    const after = state.substring(end);

    const wrapped = selected
      ? `<section>${selected}</section>`
      : `<section></section>`;
    const newCursorPos = selected ? start + wrapped.length : start + 3;

    const newValue = before + wrapped + after;

    setState(newValue);
    console.log(newValue);

    setTimeout(() => {
      el.selectionStart = el.selectionEnd = newCursorPos;
      el.focus();
    }, 0);
  };
  // Filter albums based on selected artist
  const filteredAlbums = selectedArtist
    ? albumOptions.filter(
        (album) => album.value?.artist_username === selectedArtist
      )
    : [];

  const convertData = async (data: songSchema) => {
    data.lyrics = state;
    data.tags = selectedTags.join(", ");
    console.log(data);

    if (category === "songs") {
      let songId = "";
      if (type === "add") {
        data.lyrics = state;
        console.log(data);
        const result = await addSong(data);
        songId = result.songId;
        if (result.success) {
          router.push(`/songs/${songId}`);
        }
      } else if (type === "update") {
        data.lyrics = state;
        console.log(data);
        const result = await updateSong(data);
        songId = songData.id;
        if (result.success) {
          if (songId.length >= 1 && musicUploaderRef.current?.hasFile()) {
            console.log("Has song and SongID");
            const uploadResult = await musicUploaderRef.current.upload(songId);
            if (!uploadResult.success) {
              console.log("Successo in caricamento canzone");
            }

            // ✅ uploadResult.url -> puoi salvarla nel tuo database
            console.log("File audio caricato con successo:", uploadResult.url);
          } else {
            console.log("Doesnt have song and SongID");
          }
          if (audiosToDelete.length >= 1) {
            const paths = audiosToDelete.map((path) => {
              return `${userData.church_id}/music/audio/${songData.id}/${path}`;
            });
            deleteAudiosAction(paths);
          }
          router.push(`/songs/${songId}`);
        }
      }
    } else if (category === "italiansongs") {
      data.album = selectedAlbum;
      data.artist = selectedArtist;

      if (type === "add") {
        data.lyrics = state;
        console.log(data);
        await addItalianSong(data);
      } else if (type === "update") {
        data.lyrics = state;
        console.log(data);
        await updateItalianSongAction(data);
      }
    }
  };

  const convertIntoChordPro = () => {
    setState(toChordPro(state));
    setValue("is_chordpro", true);
    console.log(state);
  };

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setHistory((prev) => [...prev, state]); // Save current state before changing
    setState(event.target.value);
    setFuture([]); // Clear redo stack
  };
  const handleUndo = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setFuture((prev) => [state, ...prev]); // Save current to redo stack
      setState(previous);
    }
  };
  const handleRedo = () => {
    if (future.length > 0) {
      const next = future[0];
      setFuture((prev) => prev.slice(1));
      setHistory((prev) => [...prev, state]); // Save current to history
      setState(next);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [audioIsOpen, setAudioIsOpen] = useState(false);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="container-sub !flex-row items-start gap-10">
      <form onSubmit={handleSubmit(convertData)}>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <div className="flex flex-wrap  md:flex-nowrap gap-2 items-center">
            <div className="w-full">
              <label htmlFor="song_title" className="block text-sm font-medium">
                Titolo Canzone
              </label>
              <input
                {...register("song_title", {
                  required: "Song Title is required",
                })}
                name="song_title"
                className="ainput"
              />
              {errors.song_title && (
                <p className="text-red-500">{`${errors.song_title.message}`}</p>
              )}
            </div>
            <div className="w-full">
              <label htmlFor="author" className="block text-sm font-medium">
                Autore
              </label>
              <input name="author" {...register("author")} className="ainput" />
              {errors.song_title && (
                <p className="text-red-500">{`${errors.author?.message}`}</p>
              )}
            </div>
          </div>
          {category === "italiansongs" && (
            <>
              <div className="flex gap-4 items-center">
                <AutocompleteCL
                  label="Seleziona l'artista"
                  placeholder="Cerca artista..."
                  options={artistsOptions}
                  size="sm"
                  variant="bordered"
                  required
                  name="artist"
                  defaultSelectedKey={songData.artist}
                  onSelectionChange={(key, option) => {
                    setSelectedArtist(key?.toString() || null);
                    setSelectedAlbum(null); // Reset album when artist changes
                  }}
                />

                <AutocompleteCL
                  label="Seleziona l'album"
                  placeholder="Cerca album..."
                  options={filteredAlbums}
                  size="sm"
                  variant="bordered"
                  name="album"
                  disabled={!selectedArtist}
                  defaultSelectedKey={songData.album}
                  onSelectionChange={(key, option) => {
                    setSelectedAlbum(key?.toString() || null);
                  }}
                />
              </div>
            </>
          )}
          <div className="flex flex-wrap  md:flex-nowrap gap-0 sm:gap-2 items-center">
            <div className="w-1/5 pr-2 sm:pr-0">
              <label htmlFor="upload_key" className="block text-sm font-medium">
                Tonalità
              </label>
              <select
                name="upload_key"
                {...register("upload_key")}
                className="ainput"
                defaultValue={
                  keys.includes(songData?.upload_key)
                    ? songData?.upload_key
                    : keys[0]
                }
              >
                {keys.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              {errors.upload_key && (
                <p className="text-red-500">{`${errors.upload_key.message}`}</p>
              )}
            </div>

            <div className=" w-1/5  pr-2 sm:pr-0">
              <label htmlFor="bpm" className="block text-sm font-medium">
                BPM
              </label>
              <select name="bpm" {...register("bpm")} className="ainput">
                {Array.from({ length: 141 }, (_, i) => 60 + i).map((bpm) => (
                  <option key={bpm} value={bpm}>
                    {bpm}
                  </option>
                ))}
              </select>
              {errors.bpm && (
                <p className="text-red-500">{`${errors.bpm.message}`}</p>
              )}
            </div>
            <div className=" w-1/5  pr-2 sm:pr-0">
              <label
                htmlFor="time_signature"
                className="block text-sm font-medium"
              >
                Tempo
              </label>
              <select
                name="time_signature"
                {...register("time_signature")}
                className="ainput"
              >
                <option value="4/4">4/4</option>
                <option value="3/4">3/4</option>
                <option value="2/4">2/4</option>
                <option value="6/8">6/8</option>
                <option value="9/8">9/8</option>
                <option value="12/8">12/8</option>
                <option value="5/4">5/4</option>
                <option value="7/4">7/4</option>
                <option value="3/8">3/8</option>
                <option value="2/2">2/2</option>
                <option value="6/4">6/4</option>
                <option value="5/8">5/8</option>
                <option value="7/8">7/8</option>
                <option value="11/8">11/8</option>
                <option value="15/8">15/8</option>
              </select>
              {errors.time_signature && (
                <p className="text-red-500">{`${errors.time_signature.message}`}</p>
              )}
            </div>
            {category !== "italiansongs" && (
              <div className=" w-2/5 relative" ref={dropdownRef}>
                <label className="block text-sm font-medium">
                  Seleziona i tag
                </label>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="ainput w-full text-left h-[2rem] !flex !flex-row items-center justify-between max-h-[2rem] overflow-hidden"
                >
                  <p className="text-gray-700 line-clamp-1">
                    {selectedTags.length === 0
                      ? "Scegli i tag"
                      : selectedTags.join(", ")}
                  </p>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Animated Dropdown */}
                <div
                  className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto transition-all duration-200 origin-top ${
                    isOpen
                      ? "opacity-100 scale-y-100 translate-y-0"
                      : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {tags.map((tag) => (
                    <label
                      key={tag.name}
                      className="!mt-0 flex items-center space-x-2 px-3 py-1 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <input
                        type="checkbox"
                        value={tag.name}
                        checked={selectedTags.includes(tag.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTags([...selectedTags, tag.name]);
                          } else {
                            setSelectedTags(
                              selectedTags.filter((t) => t !== tag.name)
                            );
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-150"
                      />
                      <span className="text-sm text-gray-700">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border rounded-lg">
            <button
              type="button"
              onClick={() => setAudioIsOpen(!audioIsOpen)}
              className="w-full flex items-center rounded-lg justify-between px-2 py-2 bg-white hover:bg-gray-100 transition font-medium"
            >
              <span className="flex flex-row items-center gap-3">
                <LuAudioLines />
                File Audio ({audioPaths.length})
              </span>
              {audioIsOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {audioIsOpen && (
              <div className="p-2  bg-white rounded-lg">
                {audioPaths.length >= 1 &&
                  audioPaths
                    .filter((el) => !audiosToDelete.includes(el))
                    .map((path, index) => {
                      const trackName = path
                        .replace(/\.[^/.]+$/, "")
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase());

                      return (
                        <div
                          key={index}
                          className="my-1 border border-gray-100 rounded p-2"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="overflow-hidden line-clamp-1 text-sm text-gray-600">
                              {trackName}
                            </p>
                          </div>
                          <div className="flex flex-row gap-2 items-center">
                            <audio controls className="w-full h-8">
                              <source
                                src={`https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/churchdata/${userData.church_id}/music/audio/${songData.id}/${path}`}
                                type="audio/mpeg"
                              />
                              Your browser does not support the audio element.
                            </audio>
                            <Button
                              type="button"
                              color="danger"
                              variant="light"
                              size="sm"
                              isIconOnly
                              onPress={() => {
                                setSelectedAudioToDelete(path);
                                deleteAudioOnOpen();
                              }}
                            >
                              <FaRegTrashAlt size={16} />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                {audiosToDelete.length >= 1 && (
                  <div className="text-center mx-auto max-w-[300px]">
                    <small className="text-center p-2 text-red-500">
                      I file Audio verranno eliminati solo dopo aver cliccato su{" "}
                      <span className="underline">Aggiorna Canzone</span> .
                    </small>
                  </div>
                )}
                <div className="mt-4">
                  <MusicUploaderInput ref={musicUploaderRef} />
                </div>
              </div>
            )}
          </div>

          <input
            {...register("id", { required: "" })}
            name="id"
            className="hidden"
          />

          <label className="!mt-0 flex items-center space-x-2 px-3 py-1 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
            <input
              type="checkbox"
              checked={isChordPro}
              onChange={(e) => setValue("is_chordpro", e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-150"
            />
            <span className="text-sm text-gray-700">È in formato ChordPro</span>
          </label>
          <div className="flex flex-row justify-center items-center">
            <Button
              type="button"
              onPress={convertIntoChordPro}
              color="primary"
              variant="flat"
              size="sm"
              className="mr-1"
            >
              ChordPro
            </Button>
            <Button
              type="button"
              color="primary"
              variant="flat"
              size="sm"
              className="mr-1"
              onPress={() => {
                console.log("Button clicked");

                insertBold();
              }}
            >
              Sezione
            </Button>
            <Button
              type="button"
              onPress={() => setIsInfoModalOpen(true)}
              variant="flat"
              size="sm"
              color="primary"
              isIconOnly
            >
              <FaInfo />
            </Button>
            <div className="p-1 border-amber-400 flex flex-row gap-2">
              <Button
                type="button"
                onPress={handleUndo}
                variant="flat"
                size="sm"
                color="primary"
                isDisabled={history.length === 0}
                isIconOnly
              >
                <FaUndoAlt />
              </Button>
              <Button
                size="sm"
                type="button"
                onPress={handleRedo}
                variant="flat"
                color="primary"
                isDisabled={future.length === 0}
                isIconOnly
              >
                <FaRedoAlt />
              </Button>
            </div>
            {width <= 1200 && (
              <Button
                size="sm"
                color="primary"
                isIconOnly
                onPress={() => setIsModalOpen(true)}
              >
                <Maximize2 size={18} />
              </Button>
            )}
          </div>

          <Textarea
            ref={textAreaRef} // 👈 Add this line
            // {...register("lyrics")}
            variant="bordered"
            className="song-text-area"
            size="sm"
            value={state}
            onChange={handleInputChange}
            maxRows={50}
            name="lyrics"
            minRows={35}
            cols={60}
          />
          <Button
            color="primary"
            variant="solid"
            type="submit"
            disabled={isSubmitting}
          >
            {type === "add"
              ? "Aggiungi Canzone"
              : type === "update"
                ? "Aggiorna Canzone"
                : ""}
          </Button>
        </div>
      </form>
      <Modal isOpen={deleteAudioIsOpen} onOpenChange={deleteAudioOnOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-red-600">
                Elimina File Audio
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-600">
                  Sei sicuro di voler eliminare definitivamente questo file
                  audio?
                  <br />
                  Questa azione è irreversibile e il file non potrà essere
                  recuperato.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  fullWidth
                  variant="light"
                  onPress={onClose}
                >
                  Annulla
                </Button>
                <Button
                  color="danger"
                  fullWidth
                  className="bg-red-600"
                  onPress={() => {
                    setAudiosToDelete((prev) => [
                      ...prev,
                      selectedAudioToDelete,
                    ]);

                    onClose();
                  }}
                >
                  Elimina
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {width > 1200 && (
        <div className="relative border-1 border-dashed border-blue-300 rounded-lg p-4">
          {/* Preview Header */}
          <div className="flex items-center gap-2 mb-3 text-blue-700 bg-blue-100 px-3 py-2 rounded-md">
            <Eye size={18} />
            <span className="font-semibold text-sm uppercase tracking-wide">
              Anteprima
            </span>
          </div>

          {/* Fixed Height Container with Scroll */}
          <div className="relative">
            <div
              className="overflow-y-auto"
              style={{ height: "800px", width: "500px" }}
            >
              <ChordProViewComponentAlt
                mode="preview"
                setListSong={previewData}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Preview Button - shows when width <= 1200 */}

      {/* Modal for Mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0a0a0ac1] bg-opacity-20  p-2"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl mx-4 my-8 w-full max-w-2xl max-h-full flex flex-col">
            {/* Modal Header */}

            {/* Modal Body - Scrollable */}
            <div className="relative border-1 border-dashed border-blue-300 rounded-lg p-4">
              {/* Preview Header */}
              <div className="flex items-center gap-2 mb-3 text-blue-700 bg-blue-100 px-3 py-1 rounded-md justify-between">
                <div className="flex-row gap-3 flex">
                  <Eye size={18} />
                  <span className="font-semibold text-sm uppercase tracking-wide">
                    Anteprima
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 mr-0 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X color="black" size={25} />
                </button>
              </div>

              {/* Fixed Height Container with Scroll */}
              <div className="relative">
                <div
                  className="overflow-y-auto"
                  style={{ height: "500px", width: "500px" }}
                >
                  <ChordProViewComponentAlt
                    mode="preview"
                    setListSong={previewData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0a0a0ac1] bg-opacity-20"
            onClick={() => setIsInfoModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl mx-4 my-8 w-full max-w-2xl max-h-full flex flex-col">
            {/* Modal Header */}

            {/* Modal Body - Scrollable */}
            <div className="relative border-1 border-dashed border-blue-300 rounded-lg p-4">
              {/* Preview Header */}
              <div className="flex items-center gap-2 mb-3 text-blue-700 bg-blue-100 px-3 py-2 rounded-md justify-between">
                <div className="flex-row gap-3 flex">
                  <FaInfo size={18} />
                  <h5 className="font-medium">Informazioni Utili</h5>
                </div>
                <button
                  onClick={() => setIsInfoModalOpen(false)}
                  className="p-2 mr-0 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X color="black" size={25} />
                </button>
              </div>

              {/* Fixed Height Container with Scroll */}
              <div className="relative pb-12 pt-8">
                <ul className="leading-12 list-disc ml-6 space-y-4 text-sm text-gray-800 ">
                  <li>
                    {" "}
                    <p>
                      <strong>
                        Usa <code>m</code> per gli accordi minori
                      </strong>{" "}
                      – ad esempio <code>Am</code> invece di <code>A-</code>.
                    </p>{" "}
                  </li>
                  <li>
                    {" "}
                    <p>
                      <strong>
                        Evita di mettere accordi subito prima o dopo le
                        parentesi
                      </strong>{" "}
                      – aggiungi uno spazio per evitare ambiguità.
                    </p>{" "}
                  </li>
                  <li>
                    {" "}
                    <p>
                      <strong>Scrivi gli accordi in maiuscolo</strong> – sempre
                      con lettere maiuscole come <code>C</code>, <code>Dm</code>
                      .
                    </p>{" "}
                  </li>
                  <li>
                    {" "}
                    <p>
                      <strong> Sezioni Personalizzate </strong> Se l'algoritmo
                      non ti riconosce il titolo della sezione puoi sempre usare{" "}
                      <code>&lt;section&gt;&lt;/section&gt;</code> per inserire
                      il tuo titolo personalizzato. – ad esempio{" "}
                      &lt;section&gt;Sezione speciale&lt;/section&gt;.
                    </p>
                  </li>
                  <li>
                    {" "}
                    <p>
                      <strong>
                        Usa correttamente la notazione con lo slash
                      </strong>{" "}
                      – ad esempio <code>D/F#</code>.
                    </p>{" "}
                  </li>
                  <li>
                    <p>
                      <strong>Metti gli accordi sopra il testo</strong> – non
                      inserirli all’interno del testo stesso.
                    </p>{" "}
                  </li>
                  <li>
                    <p>
                      <strong>Usa un solo sistema di notazione</strong> –
                      Inglese <em>oppure</em> Italiano, non entrambi.
                    </p>{" "}
                  </li>
                  <li>
                    {" "}
                    <p>
                      <strong>Non complicare troppo gli accordi</strong> – usa
                      nomi standard se non strettamente necessario.
                    </p>
                  </li>
                  <li>
                    {" "}
                    <p>
                      <strong>Usa simboli standard</strong> – come{" "}
                      <code>maj</code>, <code>min</code>, <code>7</code>, ecc.
                    </p>{" "}
                  </li>
                  <li>
                    {" "}
                    <p>
                      <strong>
                        Etichetta chiaramente le sezioni della canzone
                      </strong>{" "}
                      – ad esempio <code>Verse</code>, <code>Chorus</code>, ecc.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
