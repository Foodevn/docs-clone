"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/db";
import { users, userOrganizations, documents } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";

/**
 * Get multiple documents by their IDs
 * @param ids - Array of document IDs to fetch
 */
export async function getDocuments(ids: string[]) {
    try {
        if (!ids || ids.length === 0) {
            return [];
        }

        // Query documents from database using Drizzle ORM with inArray
        const foundDocuments = await db
            .select({
                id: documents.id,
                title: documents.title,
                initialContent: documents.initialContent,
                organizationId: documents.organizationId,
                createdAt: documents.createdAt,
                updatedAt: documents.updatedAt,
            })
            .from(documents)
            .where(inArray(documents.id, ids));

        return foundDocuments;
    } catch (error) {
        console.error("Error getting documents:", error);
        return [];
    }
}

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

/**
 * Get a single document by ID with authentication
 * @param documentId - The document ID to fetch
 */
export async function getDocumentById(documentId: string) {
    try {
        // 1️⃣ Verify JWT token
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return null;
        }

        const payload = await verifyToken(token);
        const userId = (payload?.userId || payload?.id) as string;

        if (!payload || !userId) {
            return null;
        }

        // 2️⃣ Get document from database
        const [document] = await db
            .select({
                id: documents.id,
                title: documents.title,
                initialContent: documents.initialContent,
                organizationId: documents.organizationId,
                createdAt: documents.createdAt,
                updatedAt: documents.updatedAt,
            })
            .from(documents)
            .where(eq(documents.id, documentId))
            .limit(1);

        if (!document) {
            return null;
        }

        // 3️⃣ Verify user has access to document's organization
        const [membership] = await db
            .select()
            .from(userOrganizations)
            .where(
                and(
                    eq(userOrganizations.userId, userId),
                    eq(userOrganizations.organizationId, document.organizationId)
                )
            )
            .limit(1);

        if (!membership) {
            return null; // User không có quyền truy cập
        }

        return document;
    } catch (error) {
        console.error("Error getting document by ID:", error);
        return null;
    }
}

/**
 * Update document title
 * @param documentId - The document ID to update
 * @param title - New title for the document
 */
export async function updateDocument(documentId: string, title: string) {
    try {
        // 1️⃣ Verify JWT token
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return { success: false, error: "Unauthorized" };
        }

        const payload = await verifyToken(token);
        const userId = (payload?.userId || payload?.id) as string;

        if (!payload || !userId) {
            return { success: false, error: "Unauthorized" };
        }

        // 2️⃣ Check if document exists and user has access
        const [document] = await db
            .select({
                organizationId: documents.organizationId,
            })
            .from(documents)
            .where(eq(documents.id, documentId))
            .limit(1);

        if (!document) {
            return { success: false, error: "Document not found" };
        }

        // 3️⃣ Verify user has access to document's organization
        const [membership] = await db
            .select()
            .from(userOrganizations)
            .where(
                and(
                    eq(userOrganizations.userId, userId),
                    eq(userOrganizations.organizationId, document.organizationId)
                )
            )
            .limit(1);

        if (!membership) {
            return { success: false, error: "Access denied" };
        }

        // 4️⃣ Update document
        const [updatedDocument] = await db
            .update(documents)
            .set({
                title,
                updatedAt: new Date()
            })
            .where(eq(documents.id, documentId))
            .returning();

        return { success: true, data: updatedDocument };
    } catch (error) {
        console.error("Error updating document:", error);
        return { success: false, error: "Failed to update document" };
    }
}