import z from "zod";
import {
  optionalSelectOption,
  optionalZId,
  selectOption,
  zId,
  type SelectOption,
} from "~/lib/schema";
import type { FlattenSelectOption } from "~/types/utils";

// CREATE
export const staffTeachingCreateForm = z.object({
  academic_id: selectOption,
  staff_id: selectOption,
  cgt_id: selectOption,
  add_teaching: z.boolean(),
  chief_technical: z.boolean(),
  bi_language: z.boolean(),
  teach_english: z.boolean(),
  class_incharge: z.boolean(),
});

const staffTeachingCreateFormFull = staffTeachingCreateForm.extend({
  location_code: z.string().nonempty("សូមបញ្ចូលលេខកូដអង្គភាព!"),
  created_by: z.number().int().positive(),
  updated_by: z.number().int().positive(),
});

export const staffTeachingCreateREQ = staffTeachingCreateFormFull.extend({
  academic_id: zId,
  staff_id: zId,
  cgt_id: zId,
  add_teaching: z.number().nonnegative().int(),
  chief_technical: z.number().nonnegative().int(),
  bi_language: z.number().nonnegative().int(),
  teach_english: z.number().nonnegative().int(),
  class_incharge: z.number().nonnegative().int(),
});

export type StaffTeachingCreateForm = z.infer<typeof staffTeachingCreateForm>;
export type StaffTeachingCreateFormFull = z.infer<
  typeof staffTeachingCreateFormFull
>;
export type StaffTeachingCreateREQ = Omit<
  FlattenSelectOption<StaffTeachingCreateFormFull>,
  | "add_teaching"
  | "chief_technical"
  | "bi_language"
  | "teach_english"
  | "class_incharge"
> & {
  add_teaching: number;
  chief_technical: number;
  bi_language: number;
  teach_english: number;
  class_incharge: number;
};
export type StaffTeachingCreateRES = {
  status: boolean;
  message: string;
  data: {
    teaching_id: number;
    academic_id: number;
    location_code: string;
    staff_id: number;
    add_teaching: number;
    class_incharge: number | null;
    chief_technical: number;
    bi_language: number;
    teach_english: number;
    cgt_id: number;
    created_by: number;
    updated_by: number;
    created_at: string | null;
    updated_at: string | null;
  };
};

// UPDATE
export const staffTeachingUpdateForm = staffTeachingCreateForm;
const staffTeachingUpdateFormFull = staffTeachingUpdateForm.extend({
  teaching_id: z.number(),
  location_code: z.string().nonempty("សូមបញ្ចូលលេខកូដអង្គភាព!"),
  created_by: z.number().int().positive(),
  updated_by: z.number().int().positive(),
});
export const staffTeachingUpdateREQ = staffTeachingUpdateFormFull.extend({
  academic_id: zId,
  staff_id: zId,
  cgt_id: zId,
  add_teaching: z.number().nonnegative().int(),
  chief_technical: z.number().nonnegative().int(),
  bi_language: z.number().nonnegative().int(),
  teach_english: z.number().nonnegative().int(),
  class_incharge: z.number().nonnegative().int(),
});

export type StaffTeachingUpdateForm = z.infer<typeof staffTeachingUpdateForm>;
export type StaffTeachingUpdateFormFull = z.infer<
  typeof staffTeachingUpdateFormFull
>;
export type StaffTeachingUpdateREQ = Omit<
  FlattenSelectOption<StaffTeachingUpdateFormFull>,
  | "add_teaching"
  | "chief_technical"
  | "bi_language"
  | "teach_english"
  | "class_incharge"
> & {
  add_teaching: number;
  chief_technical: number;
  bi_language: number;
  teach_english: number;
  class_incharge: number;
};
export type StaffTeachingUpdateRES = {
  status: boolean;
  message: string;
  data: StaffTeachingShowResponse["data"];
};

// SEARCH
export const staffTeachingSearchForm = z.object({
  academic_id: selectOption,
  staff_id: optionalSelectOption,
});

const staffTeachingSearchFormFull = staffTeachingSearchForm.extend({
  page: z.coerce.number().int().positive().optional().nullable(),
});

export const staffTeachingSearchFormREQ = staffTeachingSearchFormFull.extend({
  academic_id: zId,
  staff_id: optionalZId,
});

export type StaffTeachingSearchForm = z.infer<typeof staffTeachingSearchForm>;
export type StaffTeachingSearchFormFull = z.infer<
  typeof staffTeachingSearchFormFull
>;
export type StaffTeachingSearchResponse = {
  data: {
    current_page: number;
    data: StaffTeachingShowResponse["data"][];
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
};
export interface StaffTeachingSearchRES {
  data: StaffTeachingEachSearchRES[];
  links: {
    first_page_url: StaffTeachingSearchResponse["data"]["first_page_url"];
    prev_page_url: StaffTeachingSearchResponse["data"]["prev_page_url"];
    next_page_url: StaffTeachingSearchResponse["data"]["next_page_url"];
    last_page_url: StaffTeachingSearchResponse["data"]["last_page_url"];
  };
  meta: {
    current_page: StaffTeachingSearchResponse["data"]["current_page"];
    last_page: StaffTeachingSearchResponse["data"]["last_page"];
    per_page: StaffTeachingSearchResponse["data"]["per_page"];
    total: StaffTeachingSearchResponse["data"]["total"];
  };
}
export type StaffTeachingEachSearchRES = {
  teaching_id: StaffTeachingShowResponse["data"]["teaching_id"];
  academic_id: string;
  staff_id: string;
  cgt_id: string;
  add_teaching: StaffTeachingCreateFormFull["add_teaching"];
  class_incharge: StaffTeachingCreateFormFull["class_incharge"];
  chief_technical: StaffTeachingCreateFormFull["chief_technical"];
  bi_language: StaffTeachingCreateFormFull["bi_language"];
  teach_english: StaffTeachingCreateFormFull["teach_english"];
};

// SHOW - SINGLE
export interface StaffTeachingShowResponse {
  data: {
    teaching_id: number;
    staff_id: number;
    location_code: string;
    academic_id: number | null;
    add_teaching: number | null;
    class_incharge: number | null;
    chief_technical: number | null;
    bi_language: number | null;
    teach_english: number | null;
    cgt_id: number | null;
    created_at: string | null;
    updated_at: string | null;
    created_by: number;
    updated_by: number;
  };
}
export type StaffTeachingShowRES = {
  data: StaffTeachingUpdateFormFull;
  options: {
    academics: SelectOption[];
    staffs: SelectOption[];
    grade_types: SelectOption[];
  };
};
