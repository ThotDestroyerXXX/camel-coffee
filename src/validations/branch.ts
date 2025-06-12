import { z } from "zod";

export const branchValidation = z.object({
  name: z
    .string()
    .min(3, {
      message: "Branch name must be at least 3 characters long",
    })
    .max(50, {
      message: "Branch name must be less than 50 characters",
    }),
  phone: z
    .string()
    .nonempty({ message: "Phone number must not be empty" })
    .refine(
      (val) => {
        const phoneRegex = /^\+[1-9]\d{7,14}$/;
        return phoneRegex.test(val);
      },
      {
        message: "Phone number must be in a valid format (e.g., +1234567890)",
      }
    ),
  address: z
    .string()
    .min(5, {
      message: "Address must be at least 5 characters long",
    })
    .max(255, {
      message: "Address must be less than 255 characters",
    }),
  location_detail: z
    .string()
    .nonempty({
      message: "Location detail is required",
    })
    .max(200, {
      message: "Location detail must be less than 200 characters",
    }),
  operatingHours: z.record(
    z.object({
      from: z.string().min(1, { message: "Opening time is required" }),
      to: z.string().min(1, { message: "Closing time is required" }),
      closed: z.boolean(),
    }),
    {
      errorMap: (issue, ctx) => {
        if (issue.code === "invalid_type") {
          return {
            message: "Operating hours must be an object with valid times.",
          };
        }
        return { message: ctx.defaultError };
      },
    }
  ),
  latitude: z.number().refine((val) => val >= -90 && val <= 90, {
    message: "Latitude must be between -90 and 90 degrees",
  }),
  longitude: z.number().refine((val) => val >= -180 && val <= 180, {
    message: "Longitude must be between -180 and 180 degrees",
  }),
});
