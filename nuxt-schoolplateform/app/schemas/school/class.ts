import z from "zod";
import { selectOption, zId, type SelectOption } from "~/lib/schema";
import type { FlattenSelectOption } from "~/types/utils";

// CREATE
export const classCreateForm = z.object({
  academic_id: selectOption,
  grade_id: selectOption,
  grade_name: z
    .array(z.string())
    .refine((classes) => classes.some((c) => c.trim() !== ""), {
      message: "ចំនួនថ្នាក់រៀនយ៉ាងតិចត្រូវមាន 1!",
    })
    .refine(
      (items) => {
        const filledItems = items.filter((i) => i.trim() !== "");
        return new Set(filledItems).size === filledItems.length;
      },
      { message: "ថ្នាក់រៀននីមួយៗ ត្រូវតែមានឈ្មោះខុសពីគ្នា!" }
    ),
});

const classCreateFormFull = classCreateForm.extend({
  location_code: z.string().nonempty("សូមបញ្ចូលលេខកូដអង្គភាព!"),
  created_by: z.number().int().positive(),
  updated_by: z.number().int().positive(),
});

export const classCreateREQ = classCreateFormFull.extend({
  academic_id: zId,
  grade_id: zId,
});

export type ClassCreateForm = z.infer<typeof classCreateForm>;
export type ClassCreateFormFull = z.infer<typeof classCreateFormFull>;
export type ClassCreateREQ = FlattenSelectOption<ClassCreateFormFull>;
export type ClassCreateRES = {
  status: boolean;
  message: string;
  data: {
    created: {
      location_code: string;
      academic_id: number;
      grade_id: number;
      grade_name: string[];
      created_by: number;
      updated_by: number;
      created_at: string | null;
      updated_at: string | null;
    };
  };
};

// UPDATE
export const classUpdateForm = z.object({
  academic_id: selectOption,
  grade_id: selectOption,
  grade_name: z.string().nonempty("សូមបញ្ចូលឈ្មោះថ្នាក់រៀន!"),
});

const classUpdateFormFull = classUpdateForm.extend({
  tgrade_id: z.number(),
  location_code: z.string().nonempty("សូមបញ្ចូលលេខកូដអង្គភាព!"),
  created_by: z.number(),
  updated_by: z.number(),
});

export const classUpdateREQ = classUpdateFormFull.extend({
  academic_id: zId,
  grade_id: zId,
});

export type ClassUpdateForm = z.infer<typeof classUpdateForm>;
export type ClassUpdateFormFull = z.infer<typeof classUpdateFormFull>;
export type ClassUpdateREQ = FlattenSelectOption<ClassUpdateFormFull>;

export type ClassUpdateRES = {
  timetable_grades: {
    tgrade_id: number;
    academic_id: number;
    location_code: string;
    grade_id: number;
    grade_name: string;
    created_by: number;
    updated_by: number;
    created_at: null;
    updated_at: null;
  };
};

// SEARCH
export const classSearchForm = z.object({
  academic_id: selectOption,
  grade_id: z
    .object({
      id: zId,
      value: z.string(),
    })
    .nullable()
    .optional(),
});

const classSearchFormFull = classSearchForm.extend({
  page: z.coerce.number().int().positive().optional().nullable(),
});

export const classSearchFormREQ = classSearchFormFull.extend({
  academic_id: zId,
  grade_id: zId.nullable().optional(),
});

export type ClassSearchForm = z.infer<typeof classSearchForm>;
export type ClassSearchFormFull = z.infer<typeof classSearchFormFull>;
export interface ClassSearchResponse {
  timetable_grades: {
    current_page: number;
    data: ClassShowResponse["timetable_grades"][];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: null | string;
      label: string;
      page: number | null;
      active: boolean;
    }[];
    next_page_url: null;
    path: string;
    per_page: number;
    prev_page_url: null;
    to: number;
    total: number;
  };
}
export interface ClassSearchRES {
  data: ClassEachSearchRES[];
  links: {
    first_page_url: ClassSearchResponse["timetable_grades"]["first_page_url"];
    prev_page_url: ClassSearchResponse["timetable_grades"]["prev_page_url"];
    next_page_url: ClassSearchResponse["timetable_grades"]["next_page_url"];
    last_page_url: ClassSearchResponse["timetable_grades"]["last_page_url"];
  };
  meta: {
    current_page: ClassSearchResponse["timetable_grades"]["current_page"];
    last_page: ClassSearchResponse["timetable_grades"]["last_page"];
    per_page: ClassSearchResponse["timetable_grades"]["per_page"];
    total: ClassSearchResponse["timetable_grades"]["total"];
  };
}
export type ClassEachSearchRES = {
  tgrade_id: ClassShowResponse["timetable_grades"]["tgrade_id"];
  academic_id: string;
  grade_id: string;
  grade_name: ClassShowResponse["timetable_grades"]["grade_name"];
};

// SHOW - SINGLE
export interface ClassShowResponse {
  timetable_grades: {
    tgrade_id: number;
    academic_id: number;
    location_code: string;
    grade_id: number;
    grade_name: string;
    created_by: number;
    updated_by: number;
    created_at: null;
    updated_at: null;
  };
}
export type ClassShowRES = {
  data: ClassUpdateFormFull;
  options: {
    academics: SelectOption[];
    grades: SelectOption[];
  };
};
