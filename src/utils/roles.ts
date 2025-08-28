// src/utils/roles.ts
import { auth } from "@clerk/nextjs/server";
import type { Roles } from "@/types/globals";

export const checkRole = async (role: Roles) =>
{
    try {
        const { sessionClaims } = await auth();
        return sessionClaims?.metadata?.role === role;
    } catch (_) {
        // Clerk not configured or auth threw -> treat as unauthorized
        return false;
    }
};
