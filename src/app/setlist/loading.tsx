"use client";
import { Button, Input, Skeleton } from "@heroui/react";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

export default function LoadingSetlistsPage() {
  return (
    <div className="container-sub">
      <div className="container-sub !max-w-96">
        <h5 className="text-center m-2">Prossimi eventi</h5>
        <div className="setlistviewmode-container">
          <Skeleton className="w-16 rounded-lg mt-5">
            <div className="h-6 w-full rounded-lg bg-secondary-300" />
          </Skeleton>
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="setlist-list-link border-1 rounded-2xl border-slate-300 my-1  !max-w-full">
              <div className="setlist-list flex flex-row items-center">
                <div
                  style={{
                    left: "0px",
                    height: "100%",
                    width: "5px",
                    backgroundColor: "rgb(26, 94, 219)",
                    position: "absolute",
                  }}
                ></div>

                <div className="setlist-date-avatar">
                  <Skeleton className="w-[35px]  rounded-lg">
                    <div className="h-[35px] w-full rounded-lg bg-secondary-300" />
                  </Skeleton>
                </div>

                <div className="setlist-name-exp gap-2 flex-col flex">
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-full rounded-lg bg-secondary-300" />
                  </Skeleton>
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-full rounded-lg bg-secondary-300" />
                  </Skeleton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
