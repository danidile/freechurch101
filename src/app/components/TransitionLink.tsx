"use client";
import Link, { LinkProps } from "next/link";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "@heroui/react";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  className,
  href,
  ...props
}) => {
  const router = useRouter();
  const currentPath = usePathname(); // Get current pathname
  const [isPressed, setIsPressed] = useState(false);
  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setIsPressed(true);
    e.preventDefault();
    const main = document.querySelector("main");

    main?.classList.add("page-transition");

    await sleep(100);
    router.push(href);

    // Wait for the pathname to change, with a timeout (max 5 sec)
    const maxWaitTime = 1500; // 5 seconds
    const checkInterval = 50;
    let elapsedTime = 0;

    while (
      window.location.pathname === currentPath &&
      elapsedTime < maxWaitTime
    ) {
      await sleep(checkInterval);
      elapsedTime += checkInterval;
    }

    await sleep(100);
    main?.classList.remove("page-transition");
  };

  return (
    <Link
      {...props}
      href={href}
      onClick={handleTransition}
      className={className}
    >
      {children}
    </Link>
  );
};
