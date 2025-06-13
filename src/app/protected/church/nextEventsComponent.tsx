"use client";
import { TransitionLink } from "@/app/components/TransitionLink";
import { setListT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { Button } from "@heroui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa";
export default function NextEventsComponent({
  setlists,
  userData,
}: {
  setlists: setListT[];
  userData: basicUserData;
}) {
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);
  let month = "ve";

  const upcomingSetlists = setlists
    .filter((setlist) => {
      const date = new Date(setlist.date);
      return nextDate <= date; // Keep only upcoming dates
    })
    .map((setlist) => {
      const date = new Date(setlist.date);
      const dateDay = date.toLocaleString("it-IT", { day: "numeric" });
      const dateWeekDay = date.toLocaleString("it-IT", { weekday: "short" });
      const setlistMonth = date.toLocaleString("it-IT", { month: "long" });
      const isSunday = dateWeekDay === "dom";

      let newMonth = false;
      if (setlistMonth !== month) {
        month = setlistMonth;
        newMonth = true;
      }

      return { ...setlist, date, dateDay, isSunday, newMonth };
    });
  return (
    <div className="setlistviewmode-container">
      <Table
        isHeaderSticky
        classNames={{
          base: "max-h-[520px] overflow-scroll",
          table: "min-h-[400px]",
        }}
        topContent={<h6 className="font-bold">Prossimi eventi</h6>}
      >
        <TableHeader>
          <TableColumn>Nome</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Azioni</TableColumn>
        </TableHeader>
        <TableBody items={upcomingSetlists}>
          {(setlist) => {
            return (
              <TableRow key={setlist.id}>
                <TableCell className="py-[2px]">
                  {setlist.event_title}
                </TableCell>
                <TableCell className="py-[2px] hidden sm:table-cell">
                  {Object.values(setlist.setlistTeams).flat().length >= 1 && (
                    <>
                      <small className="font-semibold">Team: </small>
                    </>
                  )}
                  {Object.values(setlist.setlistTeams)
                    .flat()
                    .map((team) => {
                      return (
                        <small
                          className={`${
                            team.profile === userData.id ? "font-bold" : ""
                          } ${
                            team.profile === userData.id ? "text-cyan-800" : ""
                          }`}
                        >
                          {team.name + " " + team.lastname}
                        </small>
                      );
                    })}
                </TableCell>
                <TableCell className="py-[2px]">
                  {hasPermission(userData.role as Role, "update:teams") && (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          className="mx-auto"
                          isIconOnly
                          variant="light"
                          size="sm"
                        >
                          <BsThreeDotsVertical />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        <DropdownItem
                          key="update"
                          as={Link}
                          startContent={<FaRegEye />}
                          href={`/people/${setlist.id}`}
                        >
                          Visualizza dettagli utente
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
      {setlists &&
        setlists.map((setlist, index) => {
          const date = new Date(setlist.date);
          const dateDay = date.toLocaleString("it-IT", {
            day: "numeric", // "10"
          });
          const dateWeekDay = date.toLocaleString("it-IT", {
            weekday: "short", // "Sunday"
          });
          const setlistmonth = date.toLocaleString("it-IT", {
            month: "long",
          });
          let isSunday = false;
          if (dateWeekDay == "dom") {
            isSunday = true;
          }

          if (nextDate <= date) {
            let newMonth = false;
            if (setlistmonth !== month) {
              month = setlistmonth;
              newMonth = true;
            }
            return (
              <>
                {newMonth && (
                  <div className="setlist-list-link mt-3">
                    <h6 className="capitalize !font-semibold ml-0">
                      {setlistmonth}
                    </h6>
                  </div>
                )}
                <TransitionLink
                  className="setlist-list-link border-1  border-gray-100 over my-1  !max-w-full"
                  href={`/setlist/${setlist.id}`}
                >
                  <div className="setlist-list" key={setlist.id}>
                    <div
                      style={{
                        left: "0px",
                        height: "77%",
                        width: "2px",
                        backgroundColor: setlist.color,
                        position: "absolute",
                      }}
                    ></div>

                    <div className="setlist-date-avatar">
                      <p
                        className={`setlist-day ${
                          isSunday ? "text-red-400" : "text-black"
                        }`}
                      >
                        {dateDay}
                      </p>
                      <small className="setlist-weekday">{dateWeekDay}</small>
                    </div>

                    <div className="setlist-name-exp" key={setlist.id}>
                      <p>{setlist.event_title}</p>
                      <div className="flex gap-1 flex-wrap leading-3 text-slate-600">
                        {Object.values(setlist.setlistTeams).flat().length >=
                          1 && <small className="font-semibold">Team: </small>}
                        {Object.values(setlist.setlistTeams)
                          .flat()
                          .map((team) => {
                            return (
                              <small
                                className={`${
                                  team.profile === userData.id
                                    ? "font-bold"
                                    : ""
                                } ${
                                  team.profile === userData.id
                                    ? "text-cyan-800"
                                    : ""
                                }`}
                              >
                                {team.name + " " + team.lastname}
                              </small>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </TransitionLink>
              </>
            );
          }
        })}
    </div>
  );
}
