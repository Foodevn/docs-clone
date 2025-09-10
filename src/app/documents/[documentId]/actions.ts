"use server";

import { ConvexHttpClient } from "convex/browser";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<"documents">[]) {
    return await convex.query(api.documents.getByIds, { ids });
};
interface SessionClaims {
    sub?: string;
    o?: {
        id?: string;
        slg?: string;
        rol?: string;
    };
}

function normalizeSessionClaims(claims: SessionClaims | null) {
    return {
        ...claims,
        org_id: claims?.o?.id || null,
        org_slug: claims?.o?.slg || null,
        org_role: claims?.o?.rol || null,
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
        color: "",
    }));

    return user;
}