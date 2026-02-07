import z from "zod"
export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

export const ReadMembersSchema = z.object({
  keyword: z.string().optional(),
  limit: z.number().int().positive(),
  page: z.number().int().positive(),
});

export type ReadMembersDto = z.infer<typeof ReadMembersSchema>;
