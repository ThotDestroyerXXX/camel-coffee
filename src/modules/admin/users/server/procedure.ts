import db from "@/db";
import { account, roleEnum, user } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { createUserValidation } from "@/validations/user";
import { and, desc, eq, ilike, lt, not, or } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";

export const userRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(50).default(1),
        search: z.string().nullish(),
      })
    )

    .query(async ({ ctx, input }) => {
      if (!ctx.userId || ctx.userRole !== "admin") {
        throw new Error("User is not authenticated.");
      }
      const { cursor, limit, search } = input;
      const searchFilter =
        search && search.trim() !== ""
          ? ilike(user.email, `%${search.trim()}%`)
          : undefined;

      const users = await db
        .select()
        .from(user)
        .where(
          and(
            not(eq(user.id, ctx.userId)),
            cursor
              ? or(
                  lt(user.createdAt, cursor.createdAt),
                  and(
                    eq(user.createdAt, cursor.createdAt),
                    lt(user.id, cursor.id)
                  )
                )
              : undefined,
            searchFilter
          )
        )
        .limit(limit + 1)
        .orderBy(desc(user.createdAt), desc(user.id))
        .execute();

      const hasMore = users.length > limit;
      const items = hasMore ? users.slice(0, -1) : users;

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, createdAt: lastItem.createdAt }
        : null;
      return {
        items,
        nextCursor,
      };
    }),

  updateRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(roleEnum.enumValues),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || ctx.userRole !== "admin") {
        throw new Error("User is not authenticated.");
      }
      const { userId, role } = input;

      const updatedUser = await db
        .update(user)
        .set({ role })
        .where(eq(user.id, userId))
        .returning()
        .execute();

      if (updatedUser.length === 0) {
        throw new Error("User not found or update failed.");
      }

      return updatedUser[0];
    }),

  create: protectedProcedure
    .input(
      createUserValidation.extend({
        image: z.string().nonempty({
          message: "Image is required",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || ctx.userRole !== "admin") {
        throw new Error("User is not authenticated.");
      }
      const {
        name,
        email,
        password,
        role,
        image,
        google_map_address,
        latitude,
        longitude,
        phone,
      } = input;

      const newUser = await db
        .insert(user)
        .values({
          id: uuidv4(),
          name,
          email,
          emailVerified: true,
          role,
          image,
          phoneNumber: phone,
          google_map_address,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        })
        .returning({ id: user.id })
        .execute();

      if (newUser.length === 0) {
        throw new Error("User creation failed.");
      }

      const context = await auth.$context;
      const hash = await context.password.hash(password);

      await db.insert(account).values({
        id: uuidv4(),
        accountId: uuidv4(),
        userId: newUser[0].id,
        providerId: "credential",
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return newUser[0];
    }),
});
