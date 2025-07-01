"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { getInviteByToken } from "./getInviteByToken";
import { invitedByTokentype } from "@/utils/types/types";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [pendingUserData, setPendingUserData] = useState<invitedByTokentype>(
    {}
  );
  useEffect(() => {
    const fetchInvite = async () => {
      const response = await getInviteByToken(token);
      setPendingUserData(response.data);
    };
    if (token) {
      fetchInvite();
    }
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      {pendingUserData.church_logo && (
        <>
          <img
            className="max-w-[325px] mx-auto my-6"
            src={`https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/churchlogo/${pendingUserData.church_logo}`}
            alt=""
          />
        </>
      )}
      <h5 className="text-center"> Benvenuto {" " + pendingUserData.name}</h5>
      <p className="text-center">
        Sei stato invitato ad unirti alla chiesa
        <br />
        <span className="underline">{" " + pendingUserData.church_name}</span>
      </p>
      <Input
        label="Nome"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="mb-4"
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        disabled
        className="mb-4"
      />
      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="mb-4"
      />
      <Button color="primary" className="mx-auto" fullWidth>
        Completa Registrazione
      </Button>
    </div>
  );
}
