import db from "@/db";
import {
  branch,
  branch_item_stock,
  branch_operating_hours,
  dayEnum,
  item,
} from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { branchValidation } from "@/validations/branch";
import { and, asc, eq, gt, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

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

  create: protectedProcedure
    .input(branchValidation)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || ctx.userRole !== "admin") {
        throw new Error("User is not authenticated.");
      }

      const {
        name,
        address,
        latitude,
        longitude,
        phone,
        location_detail,
        operatingHours,
      } = input;

      const existBranch = await db
        .select({ name: branch.name, phone: branch.phone_number })
        .from(branch)
        .where(
          or(
            ilike(branch.name, name.trim()),
            ilike(branch.phone_number, phone.trim())
          )
        )
        .execute();

      if (
        existBranch.length > 0 &&
        existBranch[0].name.trim().toLowerCase() === name.trim().toLowerCase()
      ) {
        throw new Error("Branch with this name already exists");
      }
      if (
        existBranch.length > 0 &&
        existBranch[0].phone.trim().toLowerCase() === phone.trim().toLowerCase()
      ) {
        throw new Error("Branch with this phone number already exists");
      }

      const newBranch = await db
        .insert(branch)
        .values({
          id: uuidv4(),
          name: name.trim(),
          google_map_address: address.trim(),
          latitude: latitude.toString().trim(),
          longitude: longitude.toString().trim(),
          phone_number: phone.trim(),
          location_detail: location_detail.trim(),
        })
        .returning({ id: branch.id })
        .execute();

      await db
        .insert(branch_operating_hours)
        .values(
          Object.entries(operatingHours).map(([day, hours]) => ({
            branch_id: newBranch[0].id,
            day_of_week: day as (typeof dayEnum.enumValues)[number],
            opening_time: hours.from,
            closing_time: hours.to,
            is_closed: hours.closed,
          }))
        )
        .execute()
        .catch(() => {
          throw new Error("Failed to create branch operating hours");
        });

      const items = await db.select({ id: item.id }).from(item);

      await db
        .insert(branch_item_stock)
        .values(
          items.map((itemRow) => ({
            id: uuidv4(),
            branch_id: newBranch[0].id,
            item_id: itemRow.id,
          }))
        )
        .execute()
        .catch(() => {
          throw new Error("Failed to create branch item stock");
        });
    }),

  getById: baseProcedure
    .input(
      z.object({
        id: z.string().nonempty({
          message: "Branch ID is required",
        }),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const branchData = await db
        .select()
        .from(branch)
        .where(eq(branch.id, id))
        .execute();

      if (branchData.length === 0) {
        throw new Error("Branch not found");
      }

      const operatingHours = await db
        .select()
        .from(branch_operating_hours)
        .where(eq(branch_operating_hours.branch_id, id))
        .execute();

      return {
        ...branchData[0],
        operatingHours: operatingHours.reduce((acc, curr) => {
          acc[curr.day_of_week] = {
            from: curr.opening_time,
            to: curr.closing_time,
            closed: curr.is_closed,
          };
          return acc;
        }, {} as Record<string, { from: string; to: string; closed: boolean }>),
      };
    }),
});
