import db from "@/db";
import { drink_option_type, drink_option_value } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";

export const drinkOptionRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async () => {
    const types = await db.select().from(drink_option_type);

    const typesWithValues = await Promise.all(
      types.map(async (type) => {
        const values = await db
          .select()
          .from(drink_option_value)
          .where(eq(drink_option_value.drink_option_type_id, type.id));
        return { ...type, values };
      })
    );

    return typesWithValues;
  }),
});
