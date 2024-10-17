import {Image} from "@nextui-org/react";

export default function Sidebar() {


 return (
    <div className="dashboard-sidebar-container">
        <ul className="dashboard-ul">
            <li className="dashboard-li"> <Image className="dashboard-icon" src="/images/dashboard/dashboard.png"/> Dashboard</li>
            <li className="dashboard-li"><Image className="dashboard-icon" src="/images/dashboard/song-lyrics.png"/> Canzoni</li>
            <li className="dashboard-li"><Image className="dashboard-icon" src="/images/dashboard/church.png"/> La mia chiesa</li>
            <li className="dashboard-li"> <Image className="dashboard-icon" src="/images/dashboard/settings.png"/>Impostazioni</li>
            <li className="dashboard-li"> <Image className="dashboard-icon" src="/images/dashboard/user.png"/>Il mio Account</li>
        </ul>
    </div>
 )


}
  
  