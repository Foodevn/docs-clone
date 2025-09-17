import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        initialContent: v.optional(v.string()),
        ownerId: v.string(),
        roomId: v.optional(v.string()),
        organizationId: v.optional(v.string()),
    })
        .index("by_owner_id", ["ownerId"])
        .index("by_organization_id", ["organizationId"])
        .searchIndex("search_title", {
            searchField: "title",
            filterFields: ["ownerId", "organizationId"],
        }),

    tags: defineTable({
        name: v.string(),
        color: v.string(),
        icon:v.string(),
    }),

    documentTags: defineTable({
        documentId: v.string(),
        tagId: v.string(),
    }).index("by_document_id", ["documentId"])
        .index("by_tag_id", ["tagId"]),
});
