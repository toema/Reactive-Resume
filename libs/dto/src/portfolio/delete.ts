import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";
import { idSchema } from "@reactive-resume/schema";

export const deletePortfolioSchema = z.object({
  id: idSchema,
});

export class DeletePortfolioDto extends createZodDto(deletePortfolioSchema) {}
