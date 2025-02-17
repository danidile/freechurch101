"use client";
import { MdMoreVert } from "react-icons/md";
import { churchMembersT, eventSchema, setListT, teamData } from "@/utils/types/types";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { TsongNameAuthor, formValues } from "@/utils/types/types";
import { addSetlist } from "./create-team/addSetlistAction";
import { updateSetlist } from "./[teamsId]/update/updateSetlist";
import { SelectTeamMemberDrawer } from "./SelectTeamMemberDrawer";
import { Chip } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { AddSkill } from "./AddSkill";

export default function TeamsForm({
  churchMembers,
  page,
  songsList,
  setlistData,
}: {
  page: string;
  songsList: TsongNameAuthor[];
  setlistData: setListT;
  churchMembers: churchMembersT[];
}) {
  const [state, setState] = useState<churchMembersT[]>(
    setlistData?.setListSongs || []
  );

  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting },
  } = useForm<formValues>({
    resolver: zodResolver(eventSchema),
  });

  // MANAGE SKILLS

  // -------------------------------------------
  const addSkillfunction = (churchMemberId: string, skillToAdd: string) => {
    const newSkills = skillToAdd.split(",").map((skill) => skill.trim()); // Trim spaces
    console.log("churchMemberId");
    console.log(churchMemberId);

    setState((prevMembers) =>
      prevMembers.map((member) => {
        console.log(member.id);
        console.log(member.name);
        return member.id === churchMemberId
          ? {
              ...member,
              skills: [...(member.skills || []), ...newSkills], // Spread new skills into the array
            }
          : member;
      })
    );
  };
  const removeSkill = (skillToRemove: string, teamMember: string) => {
    setState((prevMembers) =>
      prevMembers.map((member) =>
        member.id === teamMember
          ? {
              ...member,
              skills: member.skills
                ? member.skills.filter((skill) => skill !== skillToRemove)
                : [],
            }
          : member
      )
    );
  };

  // -------------------------------------------

  // END  MANAGE SKILLS

  // -------------------------------------------

  // MANAGE TEAM-MEMBERS

  const addMemberToTeam = (member: churchMembersT) => {
    setState([
      ...state,
      {
        id: member.id,
        email: member.email,
        name: member.name,
        lastname: member.lastname,
        skills: [],
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
    const updatedSetlist: teamData = {
      id: setlistData?.id || crypto.randomUUID(),
      team_name: watchAllFields.event_title,
      team_members: state,
    };
    console.log("updatedSetlist");
    console.log(updatedSetlist);
    console.log("setlistData");
    console.log(setlistData);

    // if (page === "create") {
    //   addSetlist(updatedSetlist);
    // } else if (page === "update") {
    //   updateSetlist(updatedSetlist, setlistData);
    // }
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
                {...register("event_title")}
                label="Nome Team"
                variant="underlined"
                labelPlacement="outside"
                className="title-input"
                required
                defaultValue="Worship Team"
                placeholder="Worship Team"
              />
            </div>

            <h5 className="mt-6">Membri del Team</h5>

            {state.map((member, index) => {
              return (
                <div className="teammember-container" key={member.id}>
                  <div className="teammember-section">
                    <Input
                      name={"type" + member.id}
                      key={member.id}
                      value={member.id.toString()}
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
                            id={member.id}
                            onPress={() => removeMemberToTeam(member.id)}
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
                    {member.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        variant="flat"
                        onClose={() => removeSkill(skill, member.id)}
                      >
                        {skill}
                      </Chip>
                    ))}
                    <AddSkill
                      type="add"
                      churchMemberId={member.id}
                      addSkillfunction={addSkillfunction} // Pass function correctly
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
