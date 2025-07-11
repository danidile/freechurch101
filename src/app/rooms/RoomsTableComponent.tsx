"use client";

import { Input, Button } from "@heroui/react";
import Link from "next/link";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { basicUserData } from "@/utils/types/userData";
import {
  roomsType,
  searchBar,
  songsListType,
  songType,
} from "@/utils/types/types";
import { TbExternalLink } from "react-icons/tb";

export default function RoomsTableComponent({ rooms }: { rooms: roomsType[] }) {
  const [roomsList, setRoomsList] = useState(rooms);

  return (
    <div className="max-w-[1324px]">
      <div className="songs-header">
        <h3>Lista Stanze</h3>
      </div>
      <div className="container-song-list w-full min-w-[300px] mx-auto">
        {roomsList.map((room) => (
          <div key={room.id} className="ncard nborder inline-flex flex-row gap-4 items-center justify-between w-full max-w-[500px]">
            <div>
              <span className="font-medium line-clamp-1">{room.name}</span>
              <small className="line-clamp-1">
                {room.address || "Unknown"}
              </small>
            </div>
            <div>
              <div className="flex flex-row items-center gap-1 flex-wrap">Edit</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
