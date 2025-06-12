import db from "@/db";
import {
  drink_option_type,
  drink_option_value,
  item,
  item_drink_option,
} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { itemValidation } from "@/validations/item";
import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const menuRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      itemValidation.extend({
        image: z.string().nonempty({
          message: "Image is required",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, price, type, drink_type, image, variations } =
        input;

      if (!ctx.userId || ctx.userRole !== "admin") {
        throw new Error("User is not authenticated.");
      }

      const newItem = await db
        .insert(item)
        .values({
          id: uuidv4(),
          name: name,
          description: description,
          price: price.toString(),
          type: type,
          drink_type: drink_type,
          image_url: image,
        })
        .returning({ id: item.id })
        .execute();

      if (type === "drink" && !variations) {
        throw new Error("Variations are required for drink items.");
      }
      if (type === "drink") {
        variations.forEach(async (variation) => {
          if (!ctx.userId || ctx.userRole !== "admin") {
            throw new Error("User is not authenticated.");
          }
          await db
            .insert(item_drink_option)
            .values({
              item_id: newItem[0].id,
              drink_option_value_id: parseInt(variation),
            })
            .returning()
            .execute();
        });
      }
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId || ctx.userRole !== "admin") {
        throw new Error("User is not authenticated.");
      }

      const { itemId } = input;

      const rows = await db
        .select({
          item: item,
          item_drink_option: item_drink_option,
          drink_option_value: drink_option_value,
          drink_option_type: drink_option_type,
        })
        .from(item)
        .leftJoin(item_drink_option, eq(item.id, item_drink_option.item_id))
        .leftJoin(
          drink_option_value,
          eq(item_drink_option.drink_option_value_id, drink_option_value.id)
        )
        .leftJoin(
          drink_option_type,
          eq(drink_option_value.drink_option_type_id, drink_option_type.id)
        )
        .where(eq(item.id, itemId));

      // Group by item
      const itemGroup = {
        item: rows[0]?.item,
        item_drink_options: [] as Array<{
          drink_option_type: typeof drink_option_type.$inferSelect;
          drink_option_values: Array<{
            item_drink_option: typeof item_drink_option.$inferSelect;
            drink_option_value: typeof drink_option_value.$inferSelect;
          }>;
        }>,
      };

      for (const row of rows) {
        if (
          row.item_drink_option &&
          row.drink_option_value &&
          row.drink_option_type
        ) {
          // Find or create the drink_option_type group
          let typeGroup = itemGroup.item_drink_options.find(
            (g) => g.drink_option_type.id === row.drink_option_type!.id
          );
          if (!typeGroup) {
            typeGroup = {
              drink_option_type: row.drink_option_type,
              drink_option_values: [],
            };
            itemGroup.item_drink_options.push(typeGroup);
          }
          // Add the value to the type group
          typeGroup.drink_option_values.push({
            item_drink_option: row.item_drink_option,
            drink_option_value: row.drink_option_value,
          });
        }
      }

      return itemGroup;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId || ctx.userRole !== "admin") {
      throw new Error("User is not authenticated.");
    }
    const rows = await db
      .select({
        item: item,
        item_drink_option: item_drink_option,
        drink_option_value: drink_option_value,
        drink_option_type: drink_option_type,
      })
      .from(item)
      .leftJoin(item_drink_option, eq(item.id, item_drink_option.item_id))
      .leftJoin(
        drink_option_value,
        eq(item_drink_option.drink_option_value_id, drink_option_value.id)
      )
      .leftJoin(
        drink_option_type,
        eq(drink_option_value.drink_option_type_id, drink_option_type.id)
      )
      .orderBy(desc(item.is_available));

    // Group by item
    const result = rows.reduce<
      Array<{
        item: typeof item.$inferSelect;
        item_drink_options: Array<{
          drink_option_type: typeof drink_option_type.$inferSelect;
          drink_option_values: Array<{
            item_drink_option: typeof item_drink_option.$inferSelect;
            drink_option_value: typeof drink_option_value.$inferSelect;
          }>;
        }>;
      }>
    >((acc, row) => {
      let itemGroup = acc.find((g) => g.item.id === row.item.id);
      if (!itemGroup) {
        itemGroup = {
          item: row.item,
          item_drink_options: [],
        };
        acc.push(itemGroup);
      }

      // Only group if all are present
      if (
        row.item_drink_option &&
        row.drink_option_value &&
        row.drink_option_type
      ) {
        // Find or create the drink_option_type group
        let typeGroup = itemGroup.item_drink_options.find(
          (g) => g.drink_option_type.id === row.drink_option_type!.id
        );
        if (!typeGroup) {
          typeGroup = {
            drink_option_type: row.drink_option_type,
            drink_option_values: [],
          };
          itemGroup.item_drink_options.push(typeGroup);
        }
        // Add the value to the type group
        typeGroup.drink_option_values.push({
          item_drink_option: row.item_drink_option,
          drink_option_value: row.drink_option_value,
        });
      }
      return acc;
    }, []);

    return result;
  }),

  updateAvailability: protectedProcedure
    .input(
      z.object({
        itemId: z.string().uuid(),
        isAvailable: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId, isAvailable } = input;

      if (!ctx.userId || ctx.userRole !== "admin") {
        throw new Error("User is not authenticated.");
      }

      const updatedItem = await db
        .update(item)
        .set({ is_available: isAvailable })
        .where(eq(item.id, itemId))
        .returning()
        .execute();

      if (updatedItem.length === 0) {
        throw new Error("Item not found.");
      }

      return updatedItem[0];
    }),

  update: protectedProcedure
    .input(
      itemValidation.extend({
        id: z.string(),
        image: z.string().nonempty({
          message: "Image is required",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        name,
        description,
        price,
        type,
        drink_type,
        image,
        variations,
      } = input;

      if (!ctx.userId || ctx.userRole !== "admin") {
        throw new Error("User is not authenticated.");
      }

      const existingItem = await db
        .select()
        .from(item)
        .where(eq(item.id, id))
        .execute();

      if (existingItem.length === 0) {
        throw new Error("Item not found.");
      }

      const updatedItem = await db
        .update(item)
        .set({
          name: name,
          description: description,
          price: price.toString(),
          type: type,
          drink_type: drink_type,
          image_url: image,
        })
        .where(eq(item.id, id))
        .returning()
        .execute();

      if (type === "drink") {
        if (!variations || variations.length === 0) {
          throw new Error("Variations are required for drink items.");
        }

        await db
          .delete(item_drink_option)
          .where(eq(item_drink_option.item_id, id))
          .execute();

        for (const variation of variations) {
          await db
            .insert(item_drink_option)
            .values({
              item_id: id,
              drink_option_value_id: parseInt(variation),
            })
            .returning()
            .execute();
        }
      } else if (type === "food") {
        await db
          .delete(item_drink_option)
          .where(eq(item_drink_option.item_id, id))
          .execute();
      }

      return updatedItem[0];
    }),

  getDrinkOptions: protectedProcedure
    .input(z.object({ item_id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.userId || ctx.userRole !== "admin") {
        throw new Error("User is not authenticated.");
      }

      const { item_id } = input;

      // Join item_drink_option -> drink_option_value -> drink_option_type
      const rows = await db
        .select({
          item_drink_option: item_drink_option,
          drink_option_value: drink_option_value,
          drink_option_type: drink_option_type,
        })
        .from(item_drink_option)
        .leftJoin(
          drink_option_value,
          eq(item_drink_option.drink_option_value_id, drink_option_value.id)
        )
        .leftJoin(
          drink_option_type,
          eq(drink_option_value.drink_option_type_id, drink_option_type.id)
        )
        .where(eq(item_drink_option.item_id, item_id))
        .execute();

      // Optionally, group by type for easier frontend use:
      const grouped = rows.reduce<
        Record<
          string,
          {
            type: string;
            values: {
              item_drink_option: typeof item_drink_option.$inferSelect;
              drink_option_value: typeof drink_option_value.$inferSelect | null;
              drink_option_type: typeof drink_option_type.$inferSelect | null;
            }[];
          }
        >
      >((acc, row) => {
        const typeId = row.drink_option_type?.id;
        if (typeId !== null && typeId !== undefined) {
          const key = String(typeId);
          acc[key] ??= {
            type: row.drink_option_type?.name ?? "",
            values: [],
          };
          acc[key].values.push({
            item_drink_option: row.item_drink_option,
            drink_option_value: row.drink_option_value,
            drink_option_type: row.drink_option_type,
          });
        }
        return acc;
      }, {});

      return Object.values(grouped);
    }),
});
