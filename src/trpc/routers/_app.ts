import { menuRouter } from "@/modules/admin/menu/server/menu/procedure";
import { createTRPCRouter } from "../init";
import { drinkOptionRouter } from "@/modules/admin/menu/server/drink-option/procedure";
import { userRouter } from "@/modules/admin/users/server/procedure";
import { branchRouter } from "@/modules/admin/branch/server/procedure";
export const appRouter = createTRPCRouter({
  drinkOption: drinkOptionRouter,
  menu: menuRouter,
  user: userRouter,
  branch: branchRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
