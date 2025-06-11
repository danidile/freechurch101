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
} from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEditNote } from "react-icons/md";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
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

export default function Page({ params }: { params: { teamsId: string } }) {
  const { userData, loading: isloading } = useUserStore();

  const [churchTeam, setChurchTeam] = useState<teamData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMember, setSelectedMember] = useState<churchMembersT | null>(
    null
  );
  const [newSkills, setNewSkills] = useState<string[]>([]);
  const [churchMembers, setChurchMembers] = useState<churchMembersT[] | null>(
    []
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
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
            isTemp: member.isTemp || null,
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

  if (churchTeam) {
    return (
      <div className="container-sub">
        <Table
          removeWrapper
          classNames={{
            table: "max-w-[800px]",
            td: "pr-0 pl-2", // le tue classi personalizzate
          }}
          isStriped
          aria-label="Team members table"
          topContent={
            <div className="flex flex-row justify-around">
              <h6 className="font-bold">{churchTeam.team_name}</h6>
              {hasPermission(userData.role as Role, "update:teams") && (
                <MoreDropdownTeams teamsId={params.teamsId} />
              )}
            </div>
          }
          bottomContent={
            <div className="transpose-button-container">
              <SelectTeamMemberDrawer
                state={churchTeam.team_members}
                type="add"
                churchMembers={churchMembers}
                addMemberToTeam={addMemberToTeam} // Pass function correctly
                section={null}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>Nome</TableColumn>
            <TableColumn>Ruolo</TableColumn>
            <TableColumn className={`max-w-[70px] `}>
              {" "}
              {hasPermission(userData.role as Role, "update:teams") && (
                <MdEditNote size={20} className="mx-auto" />
              )}
            </TableColumn>
          </TableHeader>
          <TableBody items={churchTeam.team_members}>
            {(item) => (
              <TableRow key={item.profile}>
                <TableCell className="py-[2px]">
                  {item.name} {item.lastname}
                </TableCell>
                <TableCell className="py-[2px]">
                  {item.roles.join(", ")}
                </TableCell>
                <TableCell className="max-w-[50px] py-[2px]">
                  {hasPermission(userData.role as Role, "update:teams") && (
                    <div className="relative flex flex-row justify-center items-center gap-1 mx-auto">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button className="mx-auto" isIconOnly variant="light" size="sm">
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
                      Sei sicuro di voler rimuovere{" "}
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
