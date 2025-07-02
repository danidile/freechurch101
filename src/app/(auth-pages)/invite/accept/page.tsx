"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { getInviteByToken } from "./getInviteByToken";
import { newMember, registrationData } from "@/utils/types/types";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { inviteRegristrationAction } from "./inviteRegristrationAction";
import { addToast } from "@heroui/toast";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import ChurchLabLoader from "@/app/components/churchLabSpinner";

export default function AcceptInvitePage() {
  const { userData, loading, fetchUser } = useUserStore();
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState<registrationData>({
    firstName: "",
    lastName: "",
    church: "",
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [pendingUserData, setPendingUserData] = useState<newMember>();
  useEffect(() => {
    const fetchInvite = async () => {
      const response = await getInviteByToken(token);
      if (response) {
        setPendingUserData(response.data);
        const formattedData = {
          firstName: response.data.name,
          lastName: response.data.lastname,
          church: response.data.church_id,
          email: response.data.email,
          token: token,
          password: "",
        };
        setFormData(formattedData);
      }
    };
    if (token) {
      fetchInvite();
    }
  }, [token]);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const register = async () => {
    const response = await inviteRegristrationAction(formData);
    if (response.success) {
      await fetchUser();
      router.push("/protected/dashboard/account");
    } else {
      addToast({
        title: `Errore durante la registrazione:`,
        description: response.error,
        color: "danger",
      });
    }
  };
  if (!pendingUserData) {
    return (
      <div className="max-w-md mx-auto mt-12 px-4">
        <ChurchLabLoader />
      </div>
    );
  }
  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      {pendingUserData.status === "pending" && (
        <>
          {pendingUserData.church_logo && (
            <>
              <img
                className="max-w-[325px] mx-auto my-6"
                src={`https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/churchlogo/${pendingUserData.church_logo}`}
                alt=""
              />
            </>
          )}
          <h5 className="text-center">
            {" "}
            Benvenuto {" " + pendingUserData.name}
          </h5>
          <p className="text-center">
            Sei stato invitato ad unirti alla chiesa
            <br />
            <span className="underline">
              {" " + pendingUserData.church_name}
            </span>
          </p>
          <Card className="max-w-full w-[340px]  mx-auto mt-12 ">
            <CardHeader className="text-center">
              <h1 className="text-2xl font-medium capitalize mx-auto my-4">
                Iscriviti
              </h1>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              <Input
                label="Email"
                type="email"
                value={pendingUserData.email}
                disabled
              />
              <Input
                name="password"
                isRequired
                value={formData.password}
                onChange={handleChange}
                label="Password"
                minLength={8}
                placeholder="password..."
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              />

              <Button
                color="primary"
                className="mx-auto"
                fullWidth
                onPress={() => register()}
              >
                Completa Registrazione
              </Button>
            </CardBody>
          </Card>
        </>
      )}
      {pendingUserData?.status !== "pending" && (
        <div className="text-center ncard nborder space-y-2">
          <h5>Invito scaduto</h5>
          <p className="text-sm ">
            Chiedi al leader della tua chiesa di inviarti un nuovo invito.
          </p>
          <Link href="/" className="inline-block mt-2 text-sm  hover:underline">
            Torna alla homepage
          </Link>
        </div>
      )}
    </div>
  );
}
