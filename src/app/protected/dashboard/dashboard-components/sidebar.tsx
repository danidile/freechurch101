import {Image, Link} from "@nextui-org/react";

export default function Sidebar() {


 return (
    <div className="dashboard-sidebar-container">
        <ul className="dashboard-ul">
            <li className="dashboard-li"> <Image className="dashboard-icon" src="/images/dashboard/dashboard.png" alt="" /> Dashboard</li>
            <Link href="/protected/people" className="dashboard-li"><Image className="dashboard-icon" src="/images/dashboard/song-lyrics.png" alt="" /> Membri Chiesa</Link>
            <Link href="/protected/mychurch"><li className="dashboard-li"><Image className="dashboard-icon" src="/images/dashboard/church.png" alt="" /> La mia chiesa</li></Link>
            <li className="dashboard-li"> <Image className="dashboard-icon" src="/images/dashboard/settings.png" alt="" />Impostazioni</li>
            <li className="dashboard-li"> <Image className="dashboard-icon" src="/images/dashboard/user.png" alt="" />Il mio Account</li>
        </ul>
    </div>
 )


}
  
  