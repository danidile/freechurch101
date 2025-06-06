import Sidebar from "./sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="dashboard-container">{children}</div>
    </div>
  );
}
