"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/db";
import { users, userOrganizations, documents } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Get all users in the document's organization
 * Used for sharing/collaboration features
 * @param documentId - The document ID to get users for
 */
export async function getUser(documentId?: string) {
    try {
        // 1️⃣ Verify JWT token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            throw new Error("Unauthorized - No token provided");
        }

        const payload = await verifyToken(token);
        const userId = (payload?.userId || payload?.id) as string;

        if (!payload || !userId) {
            throw new Error("Unauthorized - Invalid token");
        }

        let organizationId: string | null = null;

        // 2️⃣ Get organization ID from document or user's first organization
        if (documentId) {
            // Get organization from document
            const [document] = await db
                .select({
                    organizationId: documents.organizationId,
                })
                .from(documents)
                .where(eq(documents.id, documentId))
                .limit(1);

            organizationId = document?.organizationId ?? null;
        }

        // If no document or document not found, get user's first organization
        if (!organizationId) {
            const userMemberships = await db
                .select({
                    organizationId: userOrganizations.organizationId,
                })
                .from(userOrganizations)
                .where(eq(userOrganizations.userId, userId))
                .limit(1);

            organizationId = userMemberships[0]?.organizationId ?? null;
        }

        if (!organizationId) {
            return [];
        }

        // 3️⃣ Get all users in the organization
        const orgMembers = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                imageUrl: users.imageUrl,
            })
            .from(users)
            .innerJoin(
                userOrganizations,
                eq(users.id, userOrganizations.userId)
            )
            .where(eq(userOrganizations.organizationId, organizationId));

        // 4️⃣ Format response
        const formattedUsers = orgMembers.map((member) => ({
            id: member.id,
            name: member.name ?? member.email ?? "Anonymous",
            avatar: member.imageUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name ?? member.email ?? "A")}`, // Generate avatar from name
        }));

        return formattedUsers;
    } catch (error) {
        console.error("Error getting users:", error);
        return [];
    }
}