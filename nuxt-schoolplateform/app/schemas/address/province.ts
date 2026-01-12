import z from "zod";

const baseProvinceSchema = z.object({
  pro_code: z.coerce
    .string({ message: "សូមបញ្ចូលលេខកូដ!" })
    .regex(/^\d+$/, {
      message: "សូមបញ្ចូលលេខកូដ ជាតម្លៃលេខ!",
    })
    .max(2, "លេខកូដយ៉ាងច្រើនមានត្រឹម 2 ខ្ទង់!")
    .transform((code) => code.toString().padStart(2, "0").slice(0, 2)),
  name_en: z
    .string({ message: "សូមបញ្ចូលឈ្មោះខេត្ត ជាអង់គ្លេស!" })
    .min(1, "សូមបញ្ចូលឈ្មោះខេត្ត ជាអង់គ្លេស!"),
  name_kh: z
    .string({ message: "សូមបញ្ចូលឈ្មោះខេត្ត ជាភាសាខ្មែរ!" })
    .min(1, "សូមបញ្ចូលឈ្មោះខេត្ត ជាភាសាខ្មែរ!"),
  Reference: z.string().nullable().optional(),
  active: z.number().default(1),
});
type baseProvince = z.infer<typeof baseProvinceSchema>;

// CREATE
const byWho = z.object({
  created_by: z.number({ message: "សូមបញ្ចូល ID របស់អ្នកប្រើប្រាស់!" }),
  updated_by: z.number({ message: "សូមបញ្ចូល ID របស់អ្នកប្រើប្រាស់!" }),
});
export const provinceCreateSchema = baseProvinceSchema.merge(byWho);
export const provinceUpdateSchema = baseProvinceSchema.merge(byWho);

// SEARCH
export const provinceSearchSchema = z
  .object({
    name_en: z.string().optional(),
    name_kh: z.string().optional(),
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

// Types
export type ProvinceCreateRequest = z.infer<typeof provinceCreateSchema>;
export type ProvinceCreateResponse = {
  message: string;
  data: ProvinceCreateRequest & {
    created_at: string | null;
    updated_at: string | null;
  };
};

export type ProvinceSearchRequest = z.infer<typeof provinceSearchSchema>;
export type ProvinceSearchResponse = {
  message: string;
  data: Array<
    Omit<baseProvince, "active"> & {
      active: number;
      created_at: string | null;
      updated_at: string | null;
      created_by: number | null;
      updated_by: number | null;
    }
  >;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type ProvinceShowResponse = {
  message: string;
  data: ProvinceSearchResponse["data"][0];
};

export type ProvinceUpdateRequest = ProvinceCreateRequest;
export type ProvinceUpdateResponse = {
  message: string;
  data: Omit<baseProvince, "active"> & {
    active: number;
    created_at: string | null;
    updated_at: string | null;
    created_by: number | null;
    updated_by: number | null;
  };
};
