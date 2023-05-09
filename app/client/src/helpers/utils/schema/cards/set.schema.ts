import * as zod from "zod";
import { commonIdNameSchema } from "./common.schema";
import { cardSetPartialSchema } from "./card-set.schema";

export const setSchema = commonIdNameSchema.extend({
  code: zod.string(),
  image: zod.string(),
  cardSets: zod.array(zod.lazy(() => cardSetPartialSchema)),
});

export const setPartialSchema = zod.object({
  code: zod.string(),
  image: zod.string(),
  cardSets: zod.string().array().optional(),
});

export const setOneResponseSchema = zod.object({
  data: setSchema,
});

export const setArrayResponseSchema = zod.object({
  data: setSchema.array(),
});