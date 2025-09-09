"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
function normalizeSessionClaims(claims: any) {
    return {
        ...claims,
        org_id: claims.o?.id || null,
        org_slug: claims.o?.slg || null,
        org_role: claims.o?.rol || null,
    };
}

export async function getUser() {

    const { sessionClaims } = await auth();
    const normalized = normalizeSessionClaims(sessionClaims);

    const clerk = await clerkClient();

    const respone = await clerk.users.getUserList({
        organizationId: [normalized.org_id as string],
    });

    const user = respone.data.map((user) => ({
        id: user.id,
        name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
        avatar: user.imageUrl,
    }));

    return user;
}