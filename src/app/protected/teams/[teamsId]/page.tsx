"use client";
import { churchMembersT, teamData } from "@/utils/types/types";
import { getChurchTeam } from "@/hooks/GET/getChurchTeam";
import MoreDropdownTeams from "./MoreDropdownTeams";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Chip,
  Input,
  Link,
} from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEditNote } from "react-icons/md";
import type { Selection } from "@heroui/react";
import { FaRegFlag } from "react-icons/fa6";
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

export default function Page({ params }: { params: { teamsId: string } }) {
  const { userData, loading: isloading } = useUserStore();
  const [selectedNewLeaders, setSelectedNewLeaders] = useState<Selection>();

  const [churchTeam, setChurchTeam] = useState<teamData>();
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
      setLeaderIds(leaderIds);
      console.log(leaderIds);
      setLoading(false);
    };

    fetchTeam();
  }, [params.teamsId]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (
        userData &&
        userData.role &&
        userData.church_id &&
        hasPermission(userData.role as Role, "update:teams")
      ) {
        const fetchedMembers = await getChurchMembersCompact(
          userData.church_id
        );

        setChurchMembers(fetchedMembers);
      }
    };

    fetchMembers();
  }, [userData, isloading]);

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
    const arrayNewLeaders: string[] =
      Array.from(selectedNewLeaders).map(String);
    saveNewLeadersAction(arrayNewLeaders, params.teamsId);
  };

  if (churchTeam) {
    return (
      <div className="container-sub">
        <Table
          defaultSelectedKeys={new Set(leaderIds)}
          onSelectionChange={(selection) => {
            setSelectedNewLeaders(selection);
            console.log(selection);
          }}
          removeWrapper
          classNames={{
            base: "w-full max-w-[800px]",
            td: "pr-0 pl-2 py-[2px]", // le tue classi personalizzate
          }}
          isStriped
          aria-label="Team members table"
          topContent={
            <div className="flex flex-row justify-around px-3">
              <div>
                <h6 className="font-bold">{churchTeam.team_name}</h6>{" "}
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
                              className="text-default-700 underline"
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
          }
          bottomContent={
            hasPermission(userData.role as Role, "update:teams") && (
              <div className="transpose-button-container">
                {defineLeaders && (
                  <>
                    <Button
                      onPress={() => {
                        setSaveLeadersModal(true);
                        onLeaderOpen();
                      }}
                    >
                      Salva Team Leader
                    </Button>
                  </>
                )}
                {!defineLeaders && (
                  <SelectTeamMemberDrawer
                    state={churchTeam.team_members}
                    type="add"
                    churchMembers={churchMembers}
                    addMemberToTeam={addMemberToTeam} // Pass function correctly
                    section={null}
                  />
                )}
              </div>
            )
          }
          selectionMode={defineLeaders ? "multiple" : "none"}
        >
          <TableHeader>
            <TableColumn>Nome</TableColumn>
            <TableColumn>Ruolo</TableColumn>
            <TableColumn
              className={`max-w-[70px] ${defineLeaders ? "hidden" : "table-cell"} `}
            >
              {" "}
              {hasPermission(userData.role as Role, "update:teams") && (
                <MdEditNote size={20} className="mx-auto" />
              )}
            </TableColumn>
          </TableHeader>
          <TableBody items={churchTeam.team_members}>
            {(item) => (
              <TableRow key={item.profile}>
                <TableCell
                  className={item.isLeader ? "font-bold underline" : ""}
                >
                  <div className="flex flex-row gap-2 items-center ">
                    {item.isLeader && (
                      <>
                        <PiFlagBannerBold />{" "}
                      </>
                    )}
                    {item.name} {item.lastname}
                  </div>
                </TableCell>
                <TableCell>{item.roles.join(", ")}</TableCell>
                <TableCell
                  className={`max-w-[50px]  ${defineLeaders ? "hidden" : "table-cell"}`}
                >
                  {hasPermission(userData.role as Role, "update:teams") && (
                    <div className="relative flex flex-row justify-center items-center gap-1 mx-auto">
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
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                            onChange={(e) => setSearchText(e.target.value)} // Update state with input value
                            size="sm"
                            type="text"
                            color="primary"
                            variant="bordered"
                            placeholder="Cantante..."
                            onKeyDown={(e: React.KeyboardEvent) => {
                              if (e.key === "Enter") {
                                addRolefunction(
                                  selectedMember.profile,
                                  searchText
                                );
                                setSearchText(""); // Clear input after adding
                              }
                            }} // Listen for Enter key
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
                    <p>
                      Confermi di voler aggiungere le seguenti persone come
                      Leader del team?
                    </p>
                    {Array.from(selectedNewLeaders).map((id) => {
                      const person =
                        churchTeam.team_members.find(
                          (member) => member.profile === id
                        ) || {};
                      return (
                        <p className="leading-none underline">
                          {person.name + " " + person.lastname}
                        </p>
                      );
                    })}
                    <div className="text-center">
                      <b>Come Team Leader potranno:</b>
                      <ul>
                        <li>
                          Aggiungere e rimuovere persone dal{" "}
                          {churchTeam.team_name}
                        </li>
                        <li>
                          Aggiungere e rimuovere membri del loro team dalle
                          turnazioni
                        </li>
                        <li>
                          Vedere tutti gli eventi in cui è coinvolto il{" "}
                          {churchTeam.team_name}.
                        </li>
                      </ul>
                    </div>
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
