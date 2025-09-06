import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: { title: v.optional(v.string()), initialContent: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        return await ctx.db.insert("documents", {
            title: args.title ?? "Untitled document",
            ownerId: user.subject,
            initialContent: args.initialContent,
        });
    },
});

export const get = query({
    args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string()) },
    handler: async (ctx, {search , paginationOpts}) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Unauthorized");
        }

        if (search){
            return await ctx.db
                .query("documents")
                .withSearchIndex("search_title", (q) => 
                    q.search("title", search).eq("ownerId", user.subject)
                )
                .paginate(paginationOpts);
        }

        return await ctx.db
            .query("documents")
            .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
            .paginate(paginationOpts);
    },
});
