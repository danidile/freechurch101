"use client"

import { NavbarItem, Link, Button} from "@nextui-org/react";
import logoutTest from '@/app/components/logOutAction'
import {User} from "@nextui-org/react";


export default function LogInOutButton (props: { username: string; isLoggedIn: number; email: string; }){
 const {username, isLoggedIn, email} = props;
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
    <User   
      name={username}
      description={email}
    />
  </>
);
  }
}