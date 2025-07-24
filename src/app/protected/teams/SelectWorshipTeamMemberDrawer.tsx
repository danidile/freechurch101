"use client";

import { churchMembersT, setListSongT } from "@/utils/types/types";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import { fadeInUp, transitionSpring } from "@/motion/motionVariants";
import { MdPersonAddAlt1 } from "react-icons/md";

export function SelectWorshipTeamMemberDrawer({
  teamId,
  state,
  teamMembers,
  addMemberToTeam,
  date,
}: {
  teamId: string;
  state: churchMembersT[];
  type: string;
  teamMembers: churchMembersT[];
  addMemberToTeam: (song: setListSongT, teamId: string) => void;
  section: number;
  date: DateValue;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [members, setmembers] = useState(teamMembers);
  const [searchTerm, setSearchTerm] = useState("");

  function isMemberUnavailable(
    member: churchMembersT,
    date: DateValue
  ): boolean {
    const selectedDate = date.toDate(getLocalTimeZone());

    return member.blockouts.some((range) => {
      const start = new Date(range.start + "T00:00:00");
      const end = new Date(range.end + "T23:59:59"); // cover full day
      return selectedDate >= start && selectedDate <= end;
    });
  }
  return (
    <>
      <Button
        isIconOnly
        color="default"
        variant="flat"
        size="md"
        radius="sm"
        className="mr-0"
        onPress={onOpen}
      >
<MdPersonAddAlt1 />
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1"></DrawerHeader>
              <DrawerBody>
                <div className="songs-header">
                  <h4>Lista Membri</h4>
                </div>

                {/* Search bar */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Cerca per nome o cognome"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <AnimatePresence>
                    <motion.div
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      variants={{
                        hidden: {},
                        show: {
                          transition: {
                            staggerChildren: 0.05,
                          },
                        },
                      }}
                      className="container-song-list"
                    >
                      {members
                        .filter(
                          (member) =>
                            !state.some((m) => m.profile === member.profile) &&
                            `${member.name} ${member.lastname}`
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                        .map((member, index) => {
                          const isUnavailable = isMemberUnavailable(
                            member,
                            date
                          );

                          return (
                            <motion.div
                              key={member.profile}
                              layout
                              variants={fadeInUp}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              transition={transitionSpring(index * 0.02)}
                              className={`song-card-searchBar ${isUnavailable ? "opacity-50 cursor-default!" : ""}`}
                              style={{
                                cursor: isUnavailable ? "default" : "pointer",
                              }}
                              onClick={() => {
                                if (!isUnavailable) {
                                  addMemberToTeam(member, teamId);
                                }
                              }}
                            >
                              <div>
                                <p className="song-card-searchBar">
                                  {member.name + " " + member.lastname}
                                  <br />

                                  {!isUnavailable && (
                                    <small>{member.roles.join(", ")}</small>
                                  )}
                                  {isUnavailable && (
                                    <span className="text-red-500 block text-sm mt-1">
                                      Non è disponibile in questa data.
                                    </span>
                                  )}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button fullWidth color="primary" onPress={onClose}>
                  Chiudi
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
