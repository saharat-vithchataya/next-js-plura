import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import {
  verifyAndAcceptInvitation,
  getNotificationAndUser,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const Layout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }
  if (!agencyId) {
    return redirect("/agency");
  }
  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  )
    return <Unauthorized />;

  let allNoti: any = [];
  const notifications = await getNotificationAndUser(agencyId);
  if (!notifications) allNoti = notifications;
  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:placeholder:-[300px]">{children}</div>
    </div>
  );
};
export default Layout;
