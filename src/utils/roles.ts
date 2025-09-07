// src/utils/roles.ts
import { currentUser } from "@clerk/nextjs/server";
import type { Roles } from "@/types/globals";

export const checkRole = async (role: Roles) =>
{
    try {
        const user = await currentUser();
        if (!user) return false;
        const userRole = (user.publicMetadata?.role as string | undefined)
            ?? (user.privateMetadata?.role as string | undefined);

        return userRole === role;
    } catch (_) {
        console.log("Error when check-role")
        return false;
    }
};
