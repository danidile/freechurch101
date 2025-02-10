"use client"

import { NavbarItem, Link, Button} from "@heroui/react";
import logoutTest from '@/app/components/logOutAction'


export default function LogInOutButton (props: { username: string; isLoggedIn: number; email: string; }){
 const {isLoggedIn} = props;
 async function logouter () {
    logoutTest();
    }
    

  if(isLoggedIn == 0){
    return (
    <NavbarItem>
        <Button  color="primary">
            <Link href="/login" className="text-white">
                Accedi
            </Link>
        </Button>
    </NavbarItem>);
  } else{
    return (<>
    <NavbarItem>
        <Button color="danger" variant="bordered" onClick={logouter}>
          Sign out
        </Button>
    </NavbarItem>

  </>
);
  }
}