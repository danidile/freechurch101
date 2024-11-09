import {Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarContent, NavbarItem, Link} from "@nextui-org/react";
import { createClient } from "@/utils/supabase/server";
import LogInOutButton from '@/app/components/logInOutButton';
import {Image} from "@nextui-org/react";


export default async function MenuBar() {


  const menuItems = [
    "songs",
    "setlist",
    "churches",
    "dashboard",
    "turnazioni",
    "SundayPlanner"
  ];
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();


  
  let loggedIn = 0;

  let profileName = "";
  let profileEmail = "";

  if(user){
    loggedIn = 1;
    
const { data: profile } = await supabase
.from('profiles')
.select()
.eq('id', user.id)
    if(profile){
      profileName = profile[0].username;
       profileEmail = profile[0].email;
    }
     
  }

  return (
    <Navbar disableAnimation isBordered className="navbar-top">
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
        <Image className="max-h-8" src="/images/brand/LOGO_.png" alt="" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
        <Link color="foreground" href="/">
        <Image className="max-h-8 overflow-visible" src="/images/brand/LOGO_.png" alt="" />
        </Link>
        
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" href="/songs">
            Songs
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/setlist">
            SetList
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/turnazioni" aria-current="page" >
          Turnazioni
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/churches">
            Churches
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/sundayPlanner">
          SundayPlanner
          </Link>
        </NavbarItem>
        {loggedIn === 1 && (
          <NavbarItem>
          <Link color="foreground" href="/protected/dashboard">
            Dashboard
          </Link>
        </NavbarItem>
        )}
        

      </NavbarContent>

      <NavbarContent justify="end">
      
        <LogInOutButton isLoggedIn={loggedIn} username={profileName} email={profileEmail} />
        
      </NavbarContent>

      <NavbarMenu className="mobile-top-menu">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`} >
            <Link
              className="w-full"
              color={
                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href={"/"+ item}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}