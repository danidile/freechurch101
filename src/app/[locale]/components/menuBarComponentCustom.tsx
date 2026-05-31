"use client";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import MenuApp from "./MenuApp";
import { useUserStore } from "@/store/useUserStore";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { MdOutlineLogout } from "react-icons/md";
import logoutAction from "./logOutAction";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { PiPasswordBold } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { User } from "@heroui/user";
import { IoSettingsOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";

export default function MenuBarComponentCustom() {
  const { userData, fetchUser, notifications } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const next = locale === "it" ? "en" : "it";
    router.replace(pathname, { locale: next });
  };

  const isStandalone =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isStandalone) {
    return (
      <MenuApp userdata={userData || null} notifications={notifications} />
    );
  }

  async function logouter() {
    await logoutAction();
    await fetchUser();
    router.push("/protected/dashboard/account");
  }
  // the toggle button, reused in both desktop and mobile
  const LangToggle = () => (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors hover:bg-gray-50"
    >
      {locale === "it" ? "🇬🇧 EN" : "🇮🇹 IT"}
    </button>
  );

  return (
    <>
      <style>{`
        .hamburger {
          width: 24px; height: 3px; background: #333;
          position: relative; transition: all 0.3s ease;
        }
        .hamburger::before, .hamburger::after {
          content: ""; position: absolute; width: 100%;
          height: 3px; background: #333; transition: all 0.3s ease;
        }
        .hamburger::before { top: -8px; }
        .hamburger::after { top: 8px; }
        .menu-toggle.active .hamburger { background: transparent; }
        .menu-toggle.active .hamburger::before { top: 0; transform: rotate(45deg); }
        .menu-toggle.active .hamburger::after { top: 0; transform: rotate(-45deg); }
      `}</style>

      <nav className="h-[75px] flex items-center justify-between px-8 z-30 relative">
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
          {userData?.email == "danidile94@gmail.com" && (
            <div className="block sm:hidden">
              <LangToggle />
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-8">
          {(!userData || !userData.loggedIn) && (
            <>
              <Link href="/" prefetch className="text-gray-800 font-medium">
                Home
              </Link>
              <Link
                href="/artists"
                prefetch
                className="text-gray-800 font-medium"
              >
                {locale === "it" ? "Artisti" : "Artists"}
              </Link>
              <Link
                href="/italiansongs"
                prefetch
                className="text-gray-800 font-medium"
              >
                {locale === "it" ? "Canzoni" : "Songs"}
              </Link>
              <Link
                href="/login"
                prefetch
                className="text-gray-800 font-medium"
              >
                {locale === "it" ? "Accedi" : "Login"}
              </Link>
              {userData?.email == "danidile94@gmail.com" && <LangToggle />}
            </>
          )}
          {userData?.loggedIn && (
            <>
              <Link
                href="/setlist"
                prefetch
                className="text-gray-800 font-medium"
              >
                {locale === "it" ? "Eventi" : "Events"}
              </Link>
              <Link
                href="/songs"
                prefetch
                className="text-gray-800 font-medium"
              >
                {locale === "it" ? "Canzoni" : "Songs"}
              </Link>

              <Link
                href="/protected/church"
                prefetch
                className="text-gray-800 font-medium"
              >
                {locale === "it" ? "Membri Chiesa" : "People"}
              </Link>
              {userData.email == "danidile94@gmail.com" && <LangToggle />}

              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <button className="">
                    <User
                      name={``}
                      description={``}
                      // You can use a generic avatar or a real one if you have it
                      avatarProps={{
                        src: userData.avatar_url
                          ? `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.avatar_url}?t=${Date.now()}`
                          : "/images/userAvatarDefault.jpg",

                        fallback: (
                          <FaUserCircle className="w-6 h-6 text-zinc-500" />
                        ),
                      }}
                    />
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions">
                  <DropdownItem
                    key="profile"
                    as={Link}
                    href="/protected/dashboard/account"
                    startContent={<FiUser />}
                  >
                    Profilo
                  </DropdownItem>
                  <DropdownItem
                    key="update_profile"
                    as={Link}
                    href="/protected/dashboard/account/completeAccount"
                    startContent={<IoSettingsOutline />}
                  >
                    Aggiorna Profilo
                  </DropdownItem>
                  <DropdownItem
                    key="reset_password"
                    as={Link}
                    href="/protected/reset-password"
                    startContent={<PiPasswordBold />}
                  >
                    Cambia Password
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    className="text-danger"
                    onClick={logouter}
                    startContent={<MdOutlineLogout />}
                  >
                    Esci
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
        <div className="block py-2">
          <Link
            prefetch
            href="/"
            className="text-gray-800 font-medium text-lg no-underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </div>
        <div className="block py-2">
          <Link
            prefetch
            href="/artists"
            className="text-gray-800 font-medium text-lg no-underline"
            onClick={() => setIsMenuOpen(false)}
          >
            {locale === "it" ? "Artisti" : "Artists"}
          </Link>
        </div>
        <div className="block py-2">
          <Link
            prefetch
            href="/italiansongs"
            className="text-gray-800 font-medium text-lg no-underline"
            onClick={() => setIsMenuOpen(false)}
          >
            {locale === "it" ? "Canzoni" : "Songs"}
          </Link>
        </div>
        <Link prefetch href="/login" onClick={() => setIsMenuOpen(false)}>
          <p className="my-4 w-full bg-black p-3 text-white text-lg text-center rounded-lg">
            {locale === "it" ? "Accedi" : "Login"}
          </p>
        </Link>
        {userData?.email === "danidile94@gmail.com" && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <LangToggle />
          </div>
        )}
      </div>
    </>
  );
}
