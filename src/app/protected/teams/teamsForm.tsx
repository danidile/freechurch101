"use client";
import { MdMoreVert } from "react-icons/md";
import {
  churchMembersT,
  eventSchema,
  teamData,
  teamFormValues,
} from "@/utils/types/types";
import {
  Button,
  Input,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { TsongNameAuthor, formValues } from "@/utils/types/types";
import { createTeam } from "./create-team/createTeamAction";
import { updateSetlist } from "./[teamsId]/update/updateSetlist";
import { SelectTeamMemberDrawer } from "./SelectTeamMemberDrawer";
import { Chip } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { AddRole } from "./AddRole";

export default function TeamsForm({
  churchMembers,
  churchTeam,
  page,
}: {
  page: string;
  churchTeam: teamData;
  churchMembers: churchMembersT[];
}) {
  console.log("churchTeam");
  console.log(churchTeam);
  const [state, setState] = useState<churchMembersT[]>(
    churchTeam?.team_members || []
  );

  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting },
  } = useForm<teamFormValues>({
    resolver: zodResolver(eventSchema),
  });

  // MANAGE roleS

  // -------------------------------------------
  const addRolefunction = (churchMemberId: string, roleToAdd: string) => {
    const newRoles = roleToAdd.split(",").map((role) => role.trim()); // Trim spaces
    console.log("churchMemberId");
    console.log(churchMemberId);

    setState((prevMembers) =>
      prevMembers.map((member) => {
        console.log(member.name);
        return member.profile === churchMemberId
          ? {
              ...member,
              roles: [...(member.roles || []), ...newRoles], // Spread new roles into the array
            }
          : member;
      })
    );
  };
  const removeRole = (roleToRemove: string, teamMember: string) => {
    setState((prevMembers) =>
      prevMembers.map((member) =>
        member.profile === teamMember
          ? {
              ...member,
              roles: member.roles
                ? member.roles.filter((role) => role !== roleToRemove)
                : [],
            }
          : member
      )
    );
  };

  // -------------------------------------------

  // END  MANAGE roleS

  // -------------------------------------------

  // MANAGE TEAM-MEMBERS

  const addMemberToTeam = (member: churchMembersT) => {
    setState([
      ...state,
      {
        profile: member.id,
        email: member.email,
        name: member.name,
        lastname: member.lastname,
        roles: [],
      },
    ]);
  };

  const removeMemberToTeam = (id: string) => {
    setState(state.filter((section) => section.id !== id));
  };

  // -------------------------------------------

  // END MANAGE TEAM-MEMBERS

  const convertData = async () => {
    const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
    const teamList: teamData = {
      id: crypto.randomUUID(),
      team_name: watchAllFields.team_name,
      is_worship: watchAllFields.is_worship,
      team_members: state,
    };
    console.log("updatedTeamList");
    console.log(teamList);
    console.log("teamList");

    if (page === "create") {
      createTeam(teamList);
    } else if (page === "update") {
      // updateSetlist(teamList, setlistData);
    }
  };

  return (
    <div className="container-sub">
      <div className="form-div crea-setlist-container">
        <form onSubmit={handleSubmit(convertData)}>
          <h4>
            {page === "create" && "Crea"}
            {page === "update" && "Aggiorna"} Team
          </h4>

          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <div className="gap-1.5">
              <Input
                {...register("team_name")}
                label="Nome Team"
                variant="underlined"
                labelPlacement="outside"
                className="title-input"
                required
                defaultValue="Worship Team"
                placeholder="Worship Team"
              />
            </div>
            <Checkbox {...register("is_worship")}>
              Questo è il Team dell'Adorazione/Worship Team
            </Checkbox>

            <h5 className="mt-6">Membri del Team</h5>

            {state.map((member, index) => {
              return (
                <div className="teammember-container" key={member.profile}>
                  <div className="teammember-section">
                    <Input
                      name={"type" + member.profile}
                      key={member.id}
                      value={member.profile.toString()}
                      className="hide-input"
                      {...register(`sections.${index}.id`)}
                    />
                    <p>
                      <b>{member.name + " " + member.lastname}</b>
                    </p>

                    <Popover placement="bottom" showArrow={true}>
                      <PopoverTrigger>
                        <Button
                          isIconOnly
                          radius="full"
                          variant="flat"
                          size="sm"
                        >
                          <MdMoreVert className="text-2xl" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="px-1 py-2 flex-col gap-2">
                          <div className="my-1"></div>
                          <Button
                            size="sm"
                            className="mx-0"
                            fullWidth
                            color="danger"
                            type="button"
                            variant="light"
                            id={member.profile}
                            onPress={() => removeMemberToTeam(member.profile)}
                            accessKey={String(index)}
                          >
                            Elimina
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="team-members-skills-div">
                    <p>Abilità: </p>
                    {member.roles.map((role, index) => (
                      <Chip
                        key={index}
                        variant="flat"
                        onClose={() => removeRole(role, member.id)}
                      >
                        {role}
                      </Chip>
                    ))}
                    <AddRole
                      type="add"
                      churchMemberId={member.profile}
                      addRolefunction={addRolefunction} // Pass function correctly
                    />
                  </div>
                </div>
              );
            })}

            <div className="transpose-button-container">
              <SelectTeamMemberDrawer
                state={state}
                type="add"
                churchMembers={churchMembers}
                addMemberToTeam={addMemberToTeam} // Pass function correctly
                section={null}
              />
            </div>
            <br />
            <Button
              color="primary"
              variant="shadow"
              type="submit"
              disabled={isSubmitting}
            >
              {page === "create" && "Crea"}
              {page === "update" && "Aggiorna"} Team
            </Button>
          </div>
          <div>{/* <pre>{JSON.stringify(state, null, 2)}</pre> */}</div>
        </form>
      </div>
    </div>
  );
}
