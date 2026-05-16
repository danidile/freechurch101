import Sidebar from "../../sidebar";
export default function Dashboard() {
  return (
    <div className="flex flex-row w-full gap-12 ">
      <div className="sidebar-container-app">
        <Sidebar />
      </div>
    </div>
  );
}
