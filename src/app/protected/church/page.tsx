"use client";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { churchMembersT, profileT, setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

import { FiPlus } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
import { TransitionLink } from "@/app/components/TransitionLink";
import SetListTabs from "@/app/components/SetListTabsComponent";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import { FaRegEye, FaUserPlus } from "react-icons/fa";
import NextEventsComponent from "./nextEventsComponent";
import CalendarPage from "@/app/calendar/page";
import { Card } from "@heroui/card";
import { useForm } from "react-hook-form";
import { HeaderCL } from "@/app/components/header-comp";
import { PiChurch } from "react-icons/pi";

type FormData = {
  name: string;
  lastname: string;
  email: string;
};

export default function ChurchComponent() {
  const { userData, loading } = useUserStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
    },
  });

  const [profiles, setProfiles] = useState<profileT[] | null>([]);

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (
      !loading &&
      userData.loggedIn &&
      hasPermission(userData.role as Role, "read:churchmembers")
    ) {
      getProfilesByChurch(userData.church_id).then(
        (fetchedPeople: profileT[]) => {
          setProfiles(fetchedPeople);
        }
      );
    }
  }, [loading, userData]);

  const addMember = async (data: FormData) => {
    // Replace this with your actual backend call

    console.log("User added:", data);
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full p-2">
      <HeaderCL
        icon={PiChurch}
        title={userData.church_name}
        titleDropDown={
          <Link
            href="/protected/church/invitemembers"
            className="flex flex-row gap-2 items-center bg-blue-100 py-3  px-3 sm:px-4   rounded-md"
          >
            <FaUserPlus /> <p className="hidden sm:block">Invita membri</p>
          </Link>
        }
      />

      <div>
        <div className="max-w-full mx-auto w-full ">
          <table className="ntable max-w-[800px] ">
            <thead>
              <tr>
                <th>Nome</th>
                <th className="hidden sm:table-cell">Email</th>
                <th className="max-w-[50px] w-[50px] py-[2px]"></th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="py-[2px]">
                      {item.name} {item.lastname}{" "}
                      {item.role <= 2 && (
                        <small className="font-bold">Admin</small>
                      )}
                    </td>
                    <td className="py-[2px] hidden sm:table-cell">
                      {item.email}{" "}
                    </td>
                    <td className="max-w-[50px] w-[50px] py-[2px]">
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
                                as={Link}
                                startContent={<FaRegEye />}
                                href={`/people/${item.id}`}
                              >
                                Visualizza dettagli utente
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          aria-labelledby="add-user-modal-title"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader
                  className="flex flex-col gap-1"
                  id="add-user-modal-title"
                >
                  Aggiungi membro Chiesa
                </ModalHeader>
                <ModalBody>
                  <form
                    onSubmit={handleSubmit(addMember)}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-row gap-2">
                      <Input
                        label="Nome"
                        size="sm"
                        id="name"
                        {...register("name", { required: "Name is required" })}
                      />
                      <Input
                        label="Cognome"
                        size="sm"
                        id="lastname"
                        {...register("lastname", {
                          required: "Name is required",
                        })}
                      />
                    </div>

                    <div>
                      <Input
                        label="Email"
                        size="sm"
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </div>

                    {isSubmitSuccessful && (
                      <p className="text-green-600 mt-2">
                        User added successfully!
                      </p>
                    )}
                    <div className="flex flex-row gap-4">
                      <Button
                        color="danger"
                        variant="light"
                        fullWidth
                        onPress={onClose}
                      >
                        Chiudi
                      </Button>
                      <Button
                        type="submit"
                        fullWidth
                        disabled={isSubmitting}
                        color="primary"
                      >
                        {isSubmitting ? "Aggiungendo..." : "Aggiungi"}
                      </Button>
                    </div>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
