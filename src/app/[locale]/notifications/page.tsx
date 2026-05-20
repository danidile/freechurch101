"use client";
import { LuInbox } from "react-icons/lu";
import { HeaderCL } from "../components/header-comp";
import NotificationList from "./NotificationList";

export default function NotificationPage() {
  return (
    <div className="container-sub">
      <NotificationList />
    </div>
  );
}
