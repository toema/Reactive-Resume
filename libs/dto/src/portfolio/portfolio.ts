import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";
import { idSchema, portfolioDataSchema } from "@reactive-resume/schema";
import { userSchema } from "../user";

export const portfolioSchema = z.object({
  id: idSchema,
  title: z.string(),
  slug: z.string(),
  data: portfolioDataSchema,
  visibility: z.enum(["private", "public"]).default("private"),
  locked: z.boolean().default(false),
  userId: idSchema,
  user: userSchema.optional(),
  createdAt: z.date().or(z.dateString()),
  updatedAt: z.date().or(z.dateString()),
});

export class PortfolioDto extends createZodDto(portfolioSchema) {}
