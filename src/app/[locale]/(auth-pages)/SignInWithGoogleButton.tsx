"use client";
import { Button } from "@heroui/react";
import { signInWithGoogle } from "@/actions";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const SignInWithGoogleButton = () => {
  return (
    <Button
      type="button"
      fullWidth
      variant="shadow"
      className="loginwithgooglebutton"
      onPress={() => {
        signInWithGoogle();
      }}
      startContent={<FcGoogle size={25} />}
    >
      Accedi con Google
    </Button>
  );
};

export default SignInWithGoogleButton;
