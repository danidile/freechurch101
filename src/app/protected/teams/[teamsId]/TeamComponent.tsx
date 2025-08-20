"use client";
import { churchMembersT, teamData } from "@/utils/types/types";
import { getChurchTeam } from "@/hooks/GET/getChurchTeam";
import MoreDropdownTeams from "./MoreDropdownTeams";
import { Button, Chip, Input } from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEditNote } from "react-icons/md";

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
import { FaAsterisk, FaPlus } from "react-icons/fa";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useUserStore } from "@/store/useUserStore";
import { removeMemberFromTeamAction } from "./removeMemberFromTeamAction";
import { SelectTeamMemberDrawer } from "../SelectTeamMemberDrawer";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import { addMemberToTeamAction } from "./addMemberToTeamAction";
import { saveUpdatedSkillsAction } from "./saveUpdatedSkillsAction";
import { updateTeamMemberRoleAction } from "./updateTeamMemberRoleAction";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import { HeaderCL } from "@/app/components/header-comp";

export default function TeamIdComponent({
  params,
}: {
  params: { teamsId: string };
}) {
  const { userData, loading: isloading, fetchUser } = useUserStore();

  const [width, setWidth] = useState(0);
  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth(); // set on mount
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [uneditedChurchTeam, setUneditedChurchTeam] = useState<teamData>();
  const [churchTeam, setChurchTeam] = useState<teamData>();
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMember, setSelectedMember] = useState<churchMembersT | null>(
    null
  );
  const [defineRoles, setDefineRoles] = useState<boolean>(false);
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
      setUneditedChurchTeam(team);
      const leaderIds = team.team_members
        .filter((member) => member.isLeader)
        .map((member) => member.profile);

      // Set isLeader if user is one of the leaders
      if (leaderIds.includes(userData?.id)) {
        setIsLeader(true);
      }

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

  if (loading || isloading) return <ChurchLabLoader />;

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

  const saveNewLeaders = async () => {
    const editedRoleMembers =
      churchTeam.team_members?.filter((member) => {
        const original = uneditedChurchTeam.team_members?.find(
          (m) => m.profile === member.profile
        );
        return original && member.role !== original.role;
      }) || [];
    if (editedRoleMembers.length > 0) {
      console.log("Ruoli modificati:");
      editedRoleMembers.forEach((m) => {
        console.log(
          `${m.name} ${m.lastname} da ${uneditedChurchTeam.team_members.find((x) => x.profile === m.profile)?.role} a ${m.role}`
        );
        console.log(m);
      });
      const response = await updateTeamMemberRoleAction(
        editedRoleMembers,
        params.teamsId
      );
    }

    setRefetchTrigger((prev) => !prev);
    fetchUser();
  };
  if (churchTeam) {
    return (
      <div className="container-sub">
        <HeaderCL
          icon={FaAsterisk}
          title={churchTeam.team_name}
          titleDropDown={
            hasPermission(userData.role as Role, "update:teams") && (
              <>
                {!defineRoles && (
                  <>
                    <MoreDropdownTeams
                      teamName={churchTeam.team_name}
                      setDefineLeaders={setDefineRoles}
                      teamsId={params.teamsId}
                      isWorship={churchTeam.is_worship}
                    />
                  </>
                )}
              </>
            )
          }
          content={
            hasPermission(userData.role as Role, "update:teams") && (
              <>
                {!defineRoles && (
                  <>
                    {!churchTeam.team_members.some(
                      (member) => member.role === "leader"
                    ) && (
                      <p className="text-red-500">
                        Questo team non ha un Leader.{" "}
                        <small
                          className="text-default-700 underline !cursor-pointer"
                          onClick={() => {
                            setDefineRoles(true);
                          }}
                        >
                          Clicca qui per aggiungere i leader
                        </small>
                      </p>
                    )}
                  </>
                )}
              </>
            )
          }
        />

        <table className="w-full max-w-[800px] atable">
          <thead>
            <tr>
              <th>Nome</th>
              {width >= 800 && (
                <>
                  <th>Abilità</th>
                </>
              )}

              {!defineRoles &&
                hasPermission(userData.role as Role, "update:teams") && (
                  <th className=" w-[50px]">
                    <MdEditNote size={20} className="mx-auto" />
                  </th>
                )}
            </tr>
          </thead>
          <tbody>
            {churchTeam.team_members.map((item) => {
              return (
                <tr key={item.profile}>
                  <td>
                    <div
                      className={
                        width < 800 && defineRoles
                          ? "flex flex-row gap-4 items-center justify-between"
                          : ""
                      }
                    >
                      <p
                        className={` ${item.role === "leader" ? "font-semibold" : ""}  ${item.role === "editor" ? "font-medium text-blue-500" : ""}`}
                      >
                        {item.name} {item.lastname}{" "}
                      </p>

                      {width < 800 ? (
                        <>
                          {item.role === "member" ? (
                            <></>
                          ) : (
                            <>
                              {defineRoles ? (
                                <></>
                              ) : (
                                <>
                                  <small className="capitalize font-bold ">
                                    {item.role}
                                  </small>
                                  {" - "}
                                </>
                              )}
                            </>
                          )}
                          {defineRoles ? (
                            <select
                              className="aselect"
                              value={item.role ?? "member"}
                              onChange={(e) =>
                                setChurchTeam((prev) => {
                                  if (!prev) return prev;
                                  return {
                                    ...prev,
                                    team_members: prev.team_members.map((m) =>
                                      m.profile === item.profile
                                        ? { ...m, role: e.target.value }
                                        : m
                                    ),
                                  };
                                })
                              }
                            >
                              <option value="leader">Leader</option>
                              {/* <option value="editor">Editor</option> */}
                              <option value="member">Membro</option>
                            </select>
                          ) : (
                            <>
                              <small className="capitalize">
                                {item.roles.join(", ")}
                              </small>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <small className="capitalize  font-bold ">
                            {item.role === "member" ? <></> : <>{item.role}</>}
                          </small>
                        </>
                      )}
                    </div>
                  </td>
                  {width >= 800 && (
                    <td>
                      {defineRoles ? (
                        <select
                          className="aselect"
                          value={item.role ?? "member"}
                          onChange={(e) =>
                            setChurchTeam((prev) => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                team_members: prev.team_members.map((m) =>
                                  m.profile === item.profile
                                    ? { ...m, role: e.target.value }
                                    : m
                                ),
                              };
                            })
                          }
                        >
                          <option value="leader">Leader</option>
                          {/* <option value="editor">Editor</option> */}
                          <option value="member">Membro</option>
                        </select>
                      ) : (
                        <p className="first-letter:uppercase">
                          {item.roles.join(", ")}
                        </p>
                      )}
                    </td>
                  )}

                  {!defineRoles &&
                    hasPermission(userData.role as Role, "update:teams") && (
                      <td className="w-[50px]">
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
            {!defineRoles && (
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
                      {defineRoles && (
                        <Button
                          color="danger"
                          variant="flat"
                          onPress={() => setDefineRoles(false)}
                        >
                          Annulla
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
            {defineRoles && (
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
                        setDefineRoles(false);
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
