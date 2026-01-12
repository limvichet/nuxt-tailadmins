import { z } from "zod";

const locationObjectSchema = z.object({
  id: z.union([z.string(), z.number()]),
  value: z.string(),
});

export const schoolSearchSchema = z
  .object({
    locationType: locationObjectSchema.nullable().optional(),
    locationProvince: locationObjectSchema.nullable().optional(),
    locationDistrict: locationObjectSchema.nullable().optional(),
    locationCommune: locationObjectSchema.nullable().optional(),
    locationVillage: locationObjectSchema.nullable().optional(),
    searchQuery: z.string().optional(),
  })
  .refine(
    (data) => {
      return Object.values(data).some(
        (value) => value !== undefined && value !== null && value !== ""
      );
    },
    {
      message: "សូមបំពេញក្នុងប្រអប់យ៉ាងតិចចំនួនមួយ ដើម្បីស្វែងរក!",
    }
  );

export const schoolCreateSchema = z
  .object({
    locationType: locationObjectSchema,
    locationProvince: locationObjectSchema,
    locationDistrict: locationObjectSchema,
    locationCommune: locationObjectSchema,
    locationVillage: locationObjectSchema,
    schoolNameKH: z.string().min(1, "ឈ្មោះសាលាជាភាសាខ្មែរត្រូវតែបំពេញ!"),
    locationLocation: locationObjectSchema.optional(),
    locationRegion: locationObjectSchema.optional(),
    locationLevel: locationObjectSchema.optional(),
    locationSchoolRelate: locationObjectSchema.optional(),
    schoolNameEN: z.string().optional(),
    schoolHistory: z.string().optional(),
    haveProblem: z.boolean().optional(),
    toggleEmergencyCode: z.boolean().optional(),
    emergencyCode: z.string().nullable(),
    toggleSchoolAnnex: z.boolean().optional(),
    trailingLocationCode: z.coerce
      .string()
      .nonempty("សូមបញ្ចូលលេខកូដអង្គភាព!")
      .regex(/^[0-9]{3}$/, {
        message: "លេខកូដត្រូវមានប្រវែង 3 ខ្ទង់...",
      }),
    edu_level_id: locationObjectSchema,
  })
  .superRefine(async (data, ctx) => {
    // Sync part for emergency code
    if (!data.toggleEmergencyCode) {
      data.emergencyCode = null;
    }

    // If the toggle is on, check if the code is provided
    if (
      data.toggleEmergencyCode &&
      (!data.emergencyCode || data.emergencyCode.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emergencyCode"],
        message:
          "សូមបញ្ចូលលេខកូដ EMIS ក្រោយពេលដែលអ្នកបានបើកលេខកូដបណ្ដោះអាសន្ន!",
      });
    }
  });

export type SchoolCreateForm = z.infer<typeof schoolCreateSchema>;
export type SchoolSearchForm = z.infer<typeof schoolSearchSchema>;
