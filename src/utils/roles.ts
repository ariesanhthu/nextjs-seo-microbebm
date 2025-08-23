// src/utils/roles.ts
import { auth } from "@clerk/nextjs/server";
import type { Roles } from "@/types/globals";

const DISABLE_AUTH =
    process.env.NEXT_PUBLIC_DISABLE_AUTH === "true" ||
    process.env.NODE_ENV === "development";

export const checkRole = async (role: Roles) =>
{
    if (DISABLE_AUTH)
    {
        return true;
    }

    const { sessionClaims } = await auth();
    return sessionClaims?.metadata?.role === role;
};
