"use client";

import { Input, Button } from "@heroui/react";
import Link from "next/link";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { basicUserData } from "@/utils/types/userData";
import {
  scheduleTemplate,
  searchBar,
  songsListType,
  songType,
} from "@/utils/types/types";
import { TbExternalLink } from "react-icons/tb";

export default function ScheduleListComponent({
  schedules,
}: {
  schedules: scheduleTemplate[];
}) {
  const [schedulesList, setSchedulesList] = useState(schedules);
  console.log(schedules);

  return (
    <div className="max-w-[1324px]">
      <div className="songs-header">
        <h3>Lista Template</h3>
      </div>
      <div className="container-song-list w-full min-w-[300px] mx-auto">
        <table
          aria-label="Song list"
          className="w-full table-fixed border-collapse ntable"
        >
          <thead>
            <tr>
              <th className="w-6/12 min-w-[200px]">Title</th>
              <th className="w-3/12">Autore</th>
              <th className="w-3/12">Tag</th>
            </tr>
          </thead>
          <tbody>
            {schedulesList.map((template) => (
              <tr key={template.id}>
                <td>
                  <Link
                    href={`/protected/church/personalize/schedule-template/${template.id}`}
                  >
                    <span className="font-medium line-clamp-1">
                      {template.name}
                    </span>
                  </Link>
                </td>

                <td>
                  <small className="line-clamp-1">
                    {/* {song.author || "Unknown"} */}
                  </small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
