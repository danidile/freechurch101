"use client";
import { Button, Input, Skeleton } from "@heroui/react";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

export default function LoadingSongsPage() {
  return (
    <div className="container-sub">
      <div className="songs-header">
        <h4>Lista canzoni</h4>
        <form action="" className="songs-searchbar-form">
          <Input
            color="primary"
            type="text"
            placeholder="Cerca canzone"
            className="song-searchbar"
          />
          <Button color="primary" variant="ghost" type="submit">
            {" "}
            <ManageSearchIcon />
          </Button>
        </form>
      </div>
      <div className="container-song-list">
        {Array.from({ length: 70 }).map((_, i) => (
          <div key={i} className="songlist-link opacity-30">
            <div className="song-list flex gap-2 flex-col p-3 items-start!">
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-300" />
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-full rounded-lg bg-secondary-200" />
              </Skeleton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
