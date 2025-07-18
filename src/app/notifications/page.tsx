import NotificationList from "./NotificationList";

export default async function NotificationPage() {
  return (
    <div className="container-sub gap-1 ">
      <h5 className="text-center m-5 ">Notifiche</h5>
      <NotificationList />
    </div>
  );
}
