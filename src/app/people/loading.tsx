"use client";
import { Skeleton } from "@heroui/react";

export default function LoadingPeoplePage() {
  return (
    <div className="container-sub ">
      <h3 className="pb-6">People</h3>
      <div className="flex-col gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div className="flex flex-row w-full gap-12">
            <div className="people-link border-1 rounded-xl border-slate-300 my-1"></div>
            <div key={i} className="songlist-link opacity-30">
              <div className="people-list">
                <Skeleton className="w-full rounded-lg">
                  <div className="h-9 w-full rounded-lg bg-secondary-300" />
                </Skeleton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
