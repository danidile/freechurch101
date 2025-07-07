"use client";
import { churchMembersT, teamData } from "@/utils/types/types";
import { getChurchTeam } from "@/hooks/GET/getChurchTeam";
import MoreDropdownTeams from "./MoreDropdownTeams";
import { Button, Chip, Input } from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEditNote } from "react-icons/md";
import { PiFlagBannerBold } from "react-icons/pi";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { RiEdit2Line } from "react-icons/ri";
import { PiTrash } from "react-icons/pi";
import { FaPlus } from "react-icons/fa";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useUserStore } from "@/store/useUserStore";
import { removeMemberFromTeamAction } from "./removeMemberFromTeamAction";
import { SelectTeamMemberDrawer } from "../SelectTeamMemberDrawer";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import { addMemberToTeamAction } from "./addMemberToTeamAction";
import { saveUpdatedSkillsAction } from "./saveUpdatedSkillsAction";
import { saveNewLeadersAction } from "./saveNewLeadersAction";
import { addNewLeadersAction } from "./addNewLeadersAction";
import { removeLeadersAction } from "./removeLeadersAction";

export default function Page({ params }: { params: { teamsId: string } }) {
  const { userData, loading: isloading } = useUserStore();
  const [selectedNewLeaders, setSelectedNewLeaders] = useState<
    typeof churchTeam.team_members
  >([]);
  const [leadersToAdd, setLeadersToAdd] = useState<churchMembersT[]>([]);
  const [leadersToRemove, setLeadersToRemove] = useState<churchMembersT[]>([]);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth(); // set on mount
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const [churchTeam, setChurchTeam] = useState<teamData>();
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [leaderIds, setLeaderIds] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<churchMembersT | null>(
    null
  );
  const [defineLeaders, setDefineLeaders] = useState<boolean>(false);
  const [newSkills, setNewSkills] = useState<string[]>([]);
  const [churchMembers, setChurchMembers] = useState<churchMembersT[] | null>(
    []
  );
  const [saveLeadersModal, setSaveLeadersModal] = useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const {
    isOpen: isLeaderOpen,
    onOpen: onLeaderOpen,
    onOpenChange: onLeaderOpenChange,
  } = useDisclosure();

  const [memberToDelete, setMemberToDelete] = useState<churchMembersT | null>(
    null
  );
  const toggleSelectionLeaders = (
    member: (typeof churchTeam.team_members)[number]
  ) => {
    setSelectedNewLeaders((prev) => {
      const exists = prev.some((m) => m.profile === member.profile);
      const newSelected = exists
        ? prev.filter((m) => m.profile !== member.profile)
        : [...prev, member];

      // Now calculate the new leaders to add/remove
      const originallyLeaders = churchTeam.team_members.filter(
        (m) => m.isLeader
      );

      const toAdd = newSelected.filter(
        (m) =>
          !m.isLeader && !originallyLeaders.some((o) => o.profile === m.profile)
      );

      const toRemove = originallyLeaders.filter(
        (m) => !newSelected.some((s) => s.profile === m.profile)
      );

      setLeadersToAdd(toAdd);
      setLeadersToRemove(toRemove);

      return newSelected;
    });
  };

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };
  const handleOpenModal = (member: churchMembersT) => {
    setSelectedMember(member);
    setNewSkills(member.roles);
    onOpen();
  };
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      const team: teamData = await getChurchTeam(params.teamsId);
      setChurchTeam(team);

      const leaderIds = team.team_members
        .filter((member) => member.isLeader)
        .map((member) => member.profile);

      // Set isLeader if user is one of the leaders
      if (leaderIds.includes(userData?.id)) {
        setIsLeader(true);
      }

      setLeaderIds(leaderIds);

      // ✅ Initialize selectedNewLeaders with current leaders
      const initialSelected = team.team_members.filter((m) => m.isLeader);
      setSelectedNewLeaders(initialSelected);

      console.log(leaderIds);
      setLoading(false);
    };

    fetchTeam();
  }, [params.teamsId, refetchTrigger]);
  useEffect(() => {
    const fetchMembers = async () => {
      if (
        userData &&
        userData.role &&
        userData.church_id &&
        (hasPermission(userData.role as Role, "update:teams") || isLeader)
      ) {
        const fetchedMembers = await getChurchMembersCompact(
          userData.church_id
        );

        setChurchMembers(fetchedMembers);
      }
    };

    fetchMembers();
  }, [userData, isloading, isLeader]);

  if (loading || isloading) return <Spinner />;

  const addMemberToTeam = (member: churchMembersT) => {
    setChurchTeam((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        team_members: [
          ...prev.team_members,
          {
            profile: member.id,
            email: member.email,
            name: member.name,
            lastname: member.lastname,
            roles: [],
          },
        ],
      };
    });

    addMemberToTeamAction(member.id, params.teamsId);
  };
  const addRolefunction = (churchMemberId: string, roleToAdd: string) => {
    const newRoles = roleToAdd.split(",").map((role) => role.trim());
    setNewSkills((prevSkills) => [...prevSkills, ...newRoles]);
  };

  const saveUpdatedSkills = async () => {
    await saveUpdatedSkillsAction(
      selectedMember.profile,
      newSkills,
      params.teamsId
    );

    setChurchTeam((prevTeam) => {
      if (!prevTeam) return prevTeam;

      const updatedMembers = prevTeam.team_members.map((member) =>
        member.profile === selectedMember.profile
          ? {
              ...member,
              roles: newSkills,
            }
          : member
      );

      return {
        ...prevTeam,
        team_members: updatedMembers,
      };
    });
    setNewSkills([]);
    setSelectedMember(null);
  };
  const removeRole = (roleToRemove: string, churchMemberId: string) => {
    setNewSkills((prevSkills) =>
      prevSkills.filter((role) => role !== roleToRemove)
    );
    console.log("newSkills", newSkills);
  };

  const saveNewLeaders = () => {
    if (leadersToAdd.length >= 1) {
      console.log("leadersToAdd", leadersToAdd);

      addNewLeadersAction(leadersToAdd, params.teamsId);
    }
    if (leadersToRemove.length >= 1) {
      console.log("leadersToRemove", leadersToRemove);

      removeLeadersAction(leadersToRemove, params.teamsId);
    }
    setRefetchTrigger((prev) => !prev);
  };
  if (churchTeam) {
    return (
      <div className="container-sub">
        <div className="flex flex-row justify-between px-3 gap-5 items-center mb-7">
          <div>
            <h3 className="font-medium">{churchTeam.team_name}</h3>{" "}
            {hasPermission(userData.role as Role, "update:teams") && (
              <>
                {!defineLeaders && (
                  <>
                    {!churchTeam.team_members.some(
                      (member) => member.isLeader
                    ) && (
                      <p className="text-red-500">
                        Questo team non ha un Leader.{" "}
                        <small
                          className="text-default-700 underline !cursor-pointer"
                          onClick={() => {
                            setDefineLeaders(true);
                          }}
                        >
                          Clicca qui per aggiungere i leader
                        </small>
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div>
            {hasPermission(userData.role as Role, "update:teams") && (
              <>
                {!defineLeaders && (
                  <>
                    <MoreDropdownTeams
                      setDefineLeaders={setDefineLeaders}
                      teamsId={params.teamsId}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <table className="w-full max-w-[800px] table-auto border-collapse ntable">
          <thead>
            <tr className="bg-gray-100">
              {defineLeaders && <th className="w-[30px] px-2 py-1"></th>}
              <th className="text-left px-2 py-1">Nome</th>
              {width >= 800 && (
                <>
                  <th className="text-left px-2 py-1 ">Ruolo</th>
                </>
              )}

              {!defineLeaders &&
                hasPermission(userData.role as Role, "update:teams") && (
                  <th className="text-center px-2 py-1 max-w-[50px] w-[50px]">
                    <MdEditNote size={20} className="mx-auto" />
                  </th>
                )}
            </tr>
          </thead>
          <tbody>
            {churchTeam.team_members.map((item) => {
              const isSelected = selectedNewLeaders.some(
                (i) => i.profile === item.profile
              );
              console.log("item", item);
              return (
                <tr
                  key={item.profile}
                  className={`even:bg-gray-50 border-t border-gray-200 ${
                    defineLeaders && isSelected ? "bg-blue-100" : ""
                  }`}
                >
                  {defineLeaders && (
                    <td className="px-2 py-[2px]">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectionLeaders(item)}
                        className="cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="px-2 py-[2px]">
                    <div className="px-2 py-[2px]">
                      <p
                        className={` ${item.isLeader ? "font-bold underline" : ""}`}
                      >
                        {item.name} {item.lastname}{" "}
                      </p>
                      {width < 800 && (
                        <>
                          <small className="!no-underline">
                            {item.roles.join(", ")}
                          </small>
                        </>
                      )}
                    </div>
                  </td>
                  {width >= 800 && (
                    <>
                      <td
                        className="px-2 py-[2px] 
"
                      >
                        {item.roles.join(", ")}
                      </td>
                    </>
                  )}

                  {!defineLeaders &&
                    hasPermission(userData.role as Role, "update:teams") && (
                      <td className="px-2 py-[2px] text-center max-w-[50px] w-[50px]">
                        {(isLeader ||
                          hasPermission(
                            userData.role as Role,
                            "update:teams"
                          )) && (
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
                                onPress={() => handleOpenModal(item)}
                                startContent={<RiEdit2Line />}
                              >
                                Aggiorna
                              </DropdownItem>
                              <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                onPress={() => {
                                  setMemberToDelete(item);
                                  onDeleteOpen();
                                }}
                                startContent={<PiTrash />}
                              >
                                Elimina
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      </td>
                    )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="w-full p-4 max-w-[800px] text-center ">
          <>
            {!defineLeaders && (
              <>
                {" "}
                {(isLeader ||
                  hasPermission(userData.role as Role, "update:teams")) && (
                  <>
                    <SelectTeamMemberDrawer
                      state={churchTeam.team_members}
                      type="add"
                      churchMembers={churchMembers}
                      addMemberToTeam={addMemberToTeam} // Pass function correctly
                      section={null}
                    />
                    <div className="transpose-button-container">
                      {defineLeaders && (
                        <Button
                          color="danger"
                          variant="flat"
                          onPress={() => setDefineLeaders(false)}
                        >
                          Annulla
                        </Button>
                      )}
                      {defineLeaders &&
                        (leadersToAdd.length >= 1 ||
                          leadersToRemove.length >= 1) && (
                          <>
                            <Button
                              color="primary"
                              variant="solid"
                              onPress={() => {
                                setSaveLeadersModal(true);
                                onLeaderOpen();
                              }}
                            >
                              Salva Team Leader
                            </Button>
                          </>
                        )}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        </div>

        {selectedMember && (
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Modifica profilo: {selectedMember.name}{" "}
                    {selectedMember.lastname}
                  </ModalHeader>
                  <ModalBody>
                    {/* Your edit form goes here */}
                    <>
                      <div className="team-members-skills-div">
                        <p>Abilità: </p>
                        {newSkills.map((role, index) => (
                          <Chip
                            key={index}
                            variant="flat"
                            onClose={() =>
                              removeRole(role, selectedMember.profile)
                            }
                          >
                            {role}
                          </Chip>
                        ))}
                        <div className="songs-searchbar-form">
                          <Input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onBlur={() => {
                              if (searchText.trim() !== "") {
                                addRolefunction(
                                  selectedMember.profile,
                                  searchText.trim()
                                );
                                setSearchText("");
                              }
                            }}
                            size="sm"
                            type="text"
                            color="primary"
                            variant="bordered"
                            placeholder="Cantante..."
                            onKeyDown={(e: React.KeyboardEvent) => {
                              if (e.key === "Enter") {
                                addRolefunction(
                                  selectedMember.profile,
                                  searchText.trim()
                                );
                                setSearchText("");
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            color="primary"
                            variant="ghost"
                            isIconOnly
                            onPress={() => {
                              if (searchText.trim() !== "") {
                                // Prevent empty input submission
                                addRolefunction(
                                  selectedMember.profile,
                                  searchText
                                );
                                setSearchText(""); // Clear input after adding
                              }
                            }}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                        <small>
                          Per aggiungere più abilità dividile con una virgola "
                          , ".
                        </small>
                        <br />
                      </div>
                    </>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Chiudi
                    </Button>
                    <Button
                      color="primary"
                      onPress={async () => {
                        await saveUpdatedSkills();
                        onClose();
                      }}
                    >
                      Salva
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
        {memberToDelete && (
          <Modal
            isOpen={isDeleteOpen}
            onOpenChange={onDeleteOpenChange}
            placement="center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Conferma Eliminazione
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Sei sicuro di voler{" "}
                      <strong>
                        {memberToDelete.name} {memberToDelete.lastname}
                      </strong>{" "}
                      dal team?
                    </p>
                    <small>
                      Rimuovendolo da questo team verrà rimosso anche da tutti
                      gli eventi in cui era di turno con il{" "}
                      {" " + churchTeam.team_name}
                    </small>
                  </ModalBody>
                  <ModalFooter>
                    <Button fullWidth variant="light" onPress={onClose}>
                      Annulla
                    </Button>
                    <Button
                      fullWidth
                      color="danger"
                      onPress={() => {
                        // Do your actual removal logic here
                        setChurchTeam((prevTeam) => {
                          if (!prevTeam) return prevTeam;
                          const updatedMembers = prevTeam.team_members.filter(
                            (m) => m.profile !== memberToDelete.profile
                          );
                          return { ...prevTeam, team_members: updatedMembers };
                        });
                        removeMemberFromTeamAction(
                          memberToDelete.profile,
                          params.teamsId
                        );
                        setMemberToDelete(null);

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
        )}

        {saveLeadersModal && (
          <Modal
            size="xl"
            isOpen={isLeaderOpen}
            onOpenChange={onLeaderOpenChange}
            placement="center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Conferma Eliminazione
                  </ModalHeader>
                  <ModalBody>
                    <p>Confermi di voler aggiornare i Leader del team?</p>

                    {leadersToAdd.map((person) => (
                      <p
                        key={person.profile}
                        className="leading-none text-green-700 underline"
                      >
                        ✅ Aggiungerai: {person.name} {person.lastname}
                      </p>
                    ))}

                    {leadersToRemove.map((person) => (
                      <p
                        key={person.profile}
                        className="leading-none text-red-600 underline"
                      >
                        ❌ Rimuoverai: {person.name} {person.lastname}
                      </p>
                    ))}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      fullWidth
                      variant="light"
                      color="danger"
                      onPress={onClose}
                    >
                      Annulla
                    </Button>
                    <Button
                      fullWidth
                      color="primary"
                      onPress={() => {
                        saveNewLeaders();
                        onClose();
                        setDefineLeaders(false);
                      }}
                    >
                      Salva
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </div>
    );
  } else {
    return (
      <div className="container-sub">
        <div className="song-presentation-container">
          <h6>
            <strong>Nessun Team trovato</strong>
          </h6>
        </div>
      </div>
    );
  }
}
