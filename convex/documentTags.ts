import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { mutation, query } from "./_generated/server";

export const insertTag = mutation({
    args: { documentID: v.optional(v.string()), tagID: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unauthorized");
        }
        if (!args.documentID || !args.tagID) {
            throw new ConvexError("Missing documentID or tagID");
        }

        return await ctx.db.insert("documentTags", {
            documentId: args.documentID,
            tagId: args.tagID,
        });
    },
});
export const updateByDocumentId = mutation({
    args: { documentID: v.optional(v.string()), tagID: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new ConvexError("Unauthorized");
        }
        if (!args.tagID || !args.documentID) {
            throw new ConvexError("Missing tagID or documentID");
        }
        const existing = await ctx.db
            .query("documentTags")
            .withIndex("by_document_id", (q) => q.eq("documentId", args.documentID!))
            .first();

        if (!existing) {
            throw new ConvexError("Not found");
        }

        const _id = existing._id; // Đây là id của bản ghi trong bảng documentTags
        await ctx.db.patch(_id, { tagId: args.tagID });
    },
});
export const removeByDocumentId = mutation({
    args: { documentID: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new ConvexError("Unauthorized");
        }
        if (!args.documentID) {
            throw new ConvexError("Missing documentID");
        }
        const existing = await ctx.db
            .query("documentTags")
            .withIndex("by_document_id", (q) => q.eq("documentId", args.documentID!))
            .first();
        if (!existing) {
            throw new ConvexError("Not found");
        }
        const _id = existing._id; // Đây là id của bản ghi trong bảng documentTags
        await ctx.db.delete(_id);
    },
});

export const getTagsByDocumentId = query({
    args: { documentId: v.string(), },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        const documentTags = await ctx.db
            .query("documentTags")
            .withIndex("by_document_id", (q) => q.eq("documentId", args.documentId))
            .first();

        if (!documentTags) {
            return null;
        }
        return await ctx.db.query("tags").filter(q => q.eq(q.field("_id"), documentTags.tagId)).first();
    },
});
