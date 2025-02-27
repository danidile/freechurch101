import logoutTest from "@/app/components/logOutAction";
import {Image, Link} from "@heroui/react";

export default function Sidebar() {


 return (
    <div className="dashboard-sidebar-container">
        <ul className="dashboard-ul">
            <li className="dashboard-li"> <Image className="dashboard-icon" src="/images/dashboard/dashboard.png" alt="" /> Dashboard</li>
            <Link href="/protected/mychurch" className="dashboard-li"><Image className="dashboard-icon" src="/images/dashboard/song-lyrics.png" alt="" /> mychurch</Link>
            <Link href="/protected/teams"><li className="dashboard-li"><Image className="dashboard-icon" src="/images/dashboard/church.png" alt="" /> Teams</li></Link>
            <li className="dashboard-li"> <Image className="dashboard-icon" src="/images/dashboard/settings.png" alt="" />Impostazioni</li>
            <li className="dashboard-li"> <Image className="dashboard-icon" src="/images/dashboard/user.png" alt="" />Il mio Account</li>
        </ul>
    </div>
 )


}
  
  