import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        pictureURL: v.string(),
        firebaseUID: v.string()
    },
    handler: async (ctx, args) => {
        // Check if user exists
        const existingUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("firebaseUID"), args.firebaseUID))
            .first();

        if (existingUser) {
            return existingUser;
        }

        // Create new user
        const userId = await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            pictureURL: args.pictureURL,
            firebaseUID: args.firebaseUID,
            credits: 3.0,
            createdAt: new Date().toISOString()
        });

        return {
            _id: userId,
            ...args,
            credits: 3.0
        };
    }
});

export const UpdateUserCredits = mutation({
    args: {
        uid: v.id('users'),
        credits: v.number()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.uid, {
            credits: args.credits
        });
        return result
    }
});

export const getAllUsers = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    }
});

export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();
    }
});