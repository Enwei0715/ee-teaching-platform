import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function checkAdmin() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/signin");
    }

    if (session.user.role !== 'ADMIN') {
        redirect("/");
    }

    return session.user;
}
