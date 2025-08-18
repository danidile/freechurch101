"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserDataMenu from "./userDataMenu";
import MenuApp from "./MenuApp";
import { useUserStore } from "@/store/useUserStore";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { FaInbox } from "react-icons/fa";

export default function MenuBarComponentCustom() {
  const { userData, notifications } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if running in standalone mode (PWA)
  const isStandalone =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Render PWA menu if in standalone mode
  if (isStandalone) {
    return (
      <MenuApp
        userdata={userData || null}
        notifications={notifications?.pending?.notifications?.length}
      />
    );
  }

  // Don't render navbar if user is logged in (based on original logic)
  if (userData?.loggedIn) {
    return null;
  }

  return (
    <>
      <style>{`
        .hamburger {
          width: 24px;
          height: 3px;
          background: #333;
          position: relative;
          transition: all 0.3s ease;
        }

        .hamburger::before,
        .hamburger::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 3px;
          background: #333;
          transition: all 0.3s ease;
        }

        .hamburger::before {
          top: -8px;
        }

        .hamburger::after {
          top: 8px;
        }

        .menu-toggle.active .hamburger {
          background: transparent;
        }

        .menu-toggle.active .hamburger::before {
          top: 0;
          transform: rotate(45deg);
        }

        .menu-toggle.active .hamburger::after {
          top: 0;
          transform: rotate(-45deg);
        }
      `}</style>

      <nav className=" h-[75px] flex items-center justify-between px-8 z-30 relative">
        <div className="flex items-center gap-8 justify-between sm:w-auto w-full">
          <button
            className={`block sm:hidden p-2 rounded-lg transition-colors hover:bg-black/0 menu-toggle ${
              isMenuOpen ? "active" : ""
            }`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="hamburger"></div>
          </button>

          <div className="navbar-brand">
            <Link href="/">
              <img
                src="/images/brand/LOGO_.png"
                alt="Logo"
                className="max-h-10 w-auto"
              />
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-8">
          {(!userData || !userData.loggedIn) && (
            <>
              <Link href="/" prefetch className="text-gray-800 font-medium">
                Home
              </Link>
              <Link href="/app" prefetch className="text-gray-800 font-medium">
                App
              </Link>
              <Link
                href="/artists"
                prefetch
                className="text-gray-800 font-medium"
              >
                Artisti
              </Link>
              <Link
                href="/italiansongs"
                prefetch
                className="text-gray-800  font-medium"
              >
                Canzoni
              </Link>
              <Link
                href="/login"
                prefetch
                className="text-blue-800  font-medium"
              >
                Accedi
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed w-full left-0 right-0 bg-white border-b border-black/10 p-4 transition-all duration-300 ease-in-out z-20 ${
          isMenuOpen
            ? "translate-y-0 h-[100vh] opacity-100 visible"
            : "-translate-y-full opacity-0 invisible"
        }`}
      >
        <div className="block py-2 ">
          <Link
            prefetch
            href="/"
            className="text-gray-800 font-medium text-lg no-underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </div>
        <div className="block py-2 ">
          <Link
            prefetch
            href="/app"
            className="text-gray-800 font-medium text-lg no-underline"
            onClick={() => setIsMenuOpen(false)}
          >
            App
          </Link>
        </div>
        <div className="block py-2">
          <Link
            prefetch
            href="/artists"
            className="text-gray-800 font-medium text-lg no-underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Artisti
          </Link>
        </div>
        <div className="block py-2">
          <Link
            prefetch
            href="/italiansongs"
            className="text-gray-800 font-medium text-lg no-underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Canzoni
          </Link>
        </div>
        <Link
          prefetch
          href="/login"
          onClick={() => setIsMenuOpen(false)}
        >
          <p className="my-18 w-full bg-black p-3 text-white text-lg text-center rounded-lg">Accedi</p>
        </Link>
      </div>
    </>
  );
}
