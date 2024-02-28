import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { options } from "../api/auth/[...nextauth]/options";

async function Member() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Member");
  }

  return (
    <div>
      <h1>Member Server Session</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
      {session?.user?.phone && (
        <p>Phone: {session.user.phone}</p>
      )}
      {session?.user?.image && (
        <img src={session.user.image} alt="User Profile" />
      )}
    </div>
  );
}

export default Member;
