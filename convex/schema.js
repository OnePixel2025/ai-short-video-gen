import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        pictureURL: v.string(),
        credits: v.float64(),
        firebaseUID: v.string(),
        createdAt: v.string(),
        updatedAt: v.optional(v.string())
    })
    .index("by_email", ["email"])
    .index("by_firebase_uid", ["firebaseUID"]),

    videoData: defineTable({
        title: v.string(),
        topic: v.string(),
        script: v.string(),
        videoStyle: v.string(),
        caption: v.any(),
        voice: v.string(),
        uid: v.id('users'),
        // double check this 
        credits: v.optional(v.float64()),
        status: v.string(),
        downloadUrl: v.optional(v.string()),
        images: v.optional(v.any()),
        audioUrl: v.optional(v.string()),
        captionJson: v.optional(v.any()),
        createdAt: v.optional(v.string()),
        createdBy: v.optional(v.string()),

    })
    .index("by_uid", ["uid"])
    .index("by_status", ["status"])
});