import db from "@/db";
import { user } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, asc, eq, gt, ilike, not, or } from "drizzle-orm";
import { z } from "zod";

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
                  gt(user.createdAt, cursor.createdAt),
                  and(
                    eq(user.createdAt, cursor.createdAt),
                    gt(user.id, cursor.id)
                  )
                )
              : undefined,
            searchFilter
          )
        )
        .limit(limit + 1)
        .orderBy(asc(user.createdAt), asc(user.id))
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
});
