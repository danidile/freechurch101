import { NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import isLoggedIn from "@/utils/supabase/getuser";
import logoutTest from '@/app/components/logOutAction'
import { basicUserData } from "@/utils/types/userData";


export default function UserDataMenu({ userData }: { userData: basicUserData }) {

  async function logouter () {
    logoutTest();
    }

  if (userData.loggedIn) {
    return (
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="/protected/dashboard"
            variant="flat"
          >
            Profile
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Button color="danger" variant="flat" onClick={logouter}>
            Sign out
          </Button>
        </NavbarItem>
      </NavbarContent>
    );
  }

  return (
    <NavbarContent justify="end">
      <NavbarItem className="hidden lg:flex">
        <Link href="/login">Login</Link>
      </NavbarItem>
      <NavbarItem>
        <Button as={Link} color="primary" href="/sign-up" variant="flat">
          Sign Up
        </Button>
      </NavbarItem>
    </NavbarContent>
  );
}

// Fetch user data on the server
export async function getServerSideProps() {
  const userData = await isLoggedIn(); // Ensure `isLoggedIn` is an async function
  return {
    props: {
      userData, // Pass fetched user data as props
    },
  };
}