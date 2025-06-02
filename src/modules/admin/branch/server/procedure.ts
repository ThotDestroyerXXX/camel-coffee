import db from "@/db";
import { branch } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, asc, eq, gt, ilike, or } from "drizzle-orm";
import { z } from "zod";

export const branchRouter = createTRPCRouter({
  getMany: baseProcedure
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

    .query(async ({ input }) => {
      const { cursor, limit, search } = input;
      const searchFilter =
        search && search.trim() !== ""
          ? ilike(branch.name, `%${search.trim()}%`)
          : undefined;

      const branches = await db
        .select()
        .from(branch)
        .where(
          and(
            cursor
              ? or(
                  gt(branch.created_at, cursor.createdAt),
                  and(
                    eq(branch.created_at, cursor.createdAt),
                    gt(branch.id, cursor.id)
                  )
                )
              : undefined,
            searchFilter
          )
        )
        .limit(limit + 1)
        .orderBy(asc(branch.created_at), asc(branch.id))
        .execute();

      const hasMore = branches.length > limit;
      const items = hasMore ? branches.slice(0, -1) : branches;

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, createdAt: lastItem.created_at }
        : null;
      return {
        items,
        nextCursor,
      };
    }),
});
