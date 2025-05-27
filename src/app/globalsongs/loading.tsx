"use client"
import { Button, Input, Skeleton } from "@heroui/react";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

export default function Loading() {

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
        {[...Array(50)].map((song) => {
          return (
            <Skeleton className="songlist-link h-20" />
          );
        })}
      </div>
    </div>
  );
}
