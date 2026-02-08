import z from "zod"
export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

export const MemberSchema = z.object({
  id: z.number(),
  phone: z.string(),
  profile: z.object({
    id: z.number(),
    gender: z.enum(Gender),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

export type Member = z.infer<typeof MemberSchema>;

export const ProfileSchema = z.object({
  id: z.number(),
  gender: z.enum(Gender),
  firstName: z.string(),
  lastName: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const ReadMembersSchema = z.object({
  keyword: z.string().optional(),
  limit: z.number().int().positive(),
  page: z.number().int().positive(),
});

export type ReadMembersDto = z.infer<typeof ReadMembersSchema>;

export const CreateProfileSchema = z.object({
  gender: z.enum(Gender),
  firstName: z.string(),
  lastName: z.string(),
})

export const CreateMemberSchema = z.object({
  phone: z.string(),
  profile: CreateProfileSchema,
})

export type CreateMemberDto = z.infer<typeof CreateMemberSchema>;

export const UpdateMemberSchema = MemberSchema.partial().extend(
  { profile: ProfileSchema.partial() }
);

export type UpdateMemberDto = z.infer<typeof UpdateMemberSchema>;
