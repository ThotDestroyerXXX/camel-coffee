import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/db"; // your drizzle instance
import { phoneNumber } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
        input: false,
      },
      google_map_address: {
        type: "string",
        required: false,
      },
      latitude: {
        type: "string",
        required: false,
      },
      longitude: {
        type: "string",
        required: false,
      },
    },
  },

  plugins: [phoneNumber()],
});

export type Session = typeof auth.$Infer.Session;
