"use client"; // Ensures this component runs on the client side

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { Button } from "@heroui/react";

const MyButton = ({
  destination,
  children,
}: {
  destination: string;
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Ensures this runs in a client component

  useEffect(() => {
    console.log("isLoading state changed:", isLoading);
  }, [isLoading]); // Log state whenever it changes

  const handleClick = async () => {
    setIsLoading(true);
    console.log("Before navigation, isLoading:", isLoading);
    await router.push(destination);
    setIsLoading(false);
    console.log("After navigation, isLoading:", isLoading);
  };

  return (
    <Button
      color="primary"
      onPress={handleClick}
      className="button-transpose my-10"
      isDisabled={isLoading}
    >
      {isLoading ? "Loading..." : children}
    </Button>
  );
};

export default MyButton;
