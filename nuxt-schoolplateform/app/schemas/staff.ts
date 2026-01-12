import z from "zod";
import {
  dateFieldOption,
  optionalSelectOption,
  optionalZId,
  selectOption,
  zId,
} from "~/lib/schema";
import type {
  StaffInstitutionIndexResponse,
  StaffPositionIndexResponse,
  StaffProfessionalIndexResponse,
  StaffProfessionalTypeIndexResponse,
  StaffQualificationIndexResponse,
  StaffSalaryLevelIndexResponse,
  StaffStatusIndexResponse,
  StaffSubjectIndexResponse,
} from "~/types/staff";
import type { FlattenSelectOption } from "~/types/utils";

// CREATE
export const staffCreateForm = z.object({
  // top section
  position_id: selectOption,
  staff_dob: dateFieldOption("សូមបញ្ចូលថ្ងៃ ខែ ឆ្នាំកំណើត!"),
  staff_name: z.string().nonempty("សូមបញ្ចូលឈ្មោះជាភាសាខ្មែរ!"),
  staff_gender: selectOption,
  staff_email: z.string().email("សូមបញ្ចូល E-mail!").nullable().optional(),
  staff_phone: z
    .string()
    .nonempty("សូមបញ្ចូលលេខទូរសព្ទ!")
    .regex(/^((?:\+?855)[1-9]\d{7,9}|0[1-9]\d{7,9})$/, {
      message: "សូមបញ្ចូលលេខទូរសព្ទដែលត្រឹមត្រូវ!",
    }),
  status_id: selectOption,
  payroll_id: z.coerce
    .string()
    .nonempty("សូមបញ្ចូលអត្តលេខមន្ត្រី!")
    .regex(/^[0-9]{10}$/, {
      message: "សូមបញ្ចូលអត្តលេខមន្ត្រីដែលត្រឹមត្រូវ! (10 ខ្ទង់)",
    }),
  staff_account_number: z.coerce
    .string()
    .nonempty("សូមបញ្ចូលលេខគណនីបៀវត្ស!")
    .regex(/^[0-9]{14}$/, {
      message: "សូមបញ្ចូលលេខគណនីបៀវត្សដែលត្រឹមត្រូវ! (14 ខ្ទង់)",
    }),

  // second top section
  start_qualification_id: selectOption,
  start_qualification_date: dateFieldOption("សូមបញ្ចូលថ្ងៃ ខែ ឆ្នាំបញ្ចប់!"),
  start_qualification_institution_id: selectOption,

  current_qualification_id: optionalSelectOption,
  current_qualification_date: dateFieldOption("សូមបញ្ចូលថ្ងៃ ខែ ឆ្នាំបញ្ចប់!")
    .nullable()
    .optional(),
  current_qualification_subject_id: optionalSelectOption,
  current_qualification_institution_id: optionalSelectOption,

  // bottom section
  start_professional_id: selectOption,
  start_professional_type_id: selectOption,
  start_professional_date: dateFieldOption("សូមបញ្ចូលថ្ងៃ ខែ ឆ្នាំចាប់ផ្ដើម!"),
  start_professional_subject_id_1: selectOption,
  start_professional_subject_id_2: optionalSelectOption,
  start_professional_institution_id: selectOption,

  current_professional_id: selectOption,
  current_professional_type_id: selectOption,
  current_professional_date: dateFieldOption(
    "សូមបញ្ចូលថ្ងៃ ខែ ឆ្នាំចាប់ផ្ដើម!"
  ),
  current_professional_subject_id_1: selectOption,
  current_professional_subject_id_2: optionalSelectOption,
  current_professional_institution_id: selectOption,

  // second bottom section
  start_salary_level_id: selectOption,
  start_salary_degree: z.object(selectOption.shape, {
    required_error: "សូមជ្រើសរើសកម្រិតថ្នាក់!",
  }),
  start_salary_date: dateFieldOption("សូមបញ្ចូលថ្ងៃ ខែ ឆ្នាំទទួលបាន!"),

  current_salary_level_id: selectOption,
  current_salary_degree: z.object(selectOption.shape, {
    required_error: "សូមជ្រើសរើសកម្រិតថ្នាក់!",
  }),
  current_salary_date: dateFieldOption("សូមបញ្ចូលថ្ងៃ ខែ ឆ្នាំទទួលបាន!"),
});

const staffCreateFormFull = staffCreateForm.extend({
  created_by: z.number(),
  updated_by: z.number(),
  staff_active: z.number(),
  location_code: z.coerce
    .string()
    .nonempty("សូមបញ្ចូលលេខកូដអង្គភាព!")
    .regex(/^[0-9]{11}$/, {
      message: "សូមបញ្ចូលលេខកូដអង្គភាពដែលត្រឹមត្រូវ! (11 ខ្ទង់)",
    }),
});

export const staffCreateREQ = staffCreateFormFull.extend({
  position_id: zId,
  staff_gender: zId,
  status_id: zId,
  location_code: zId,
  start_qualification_id: zId,
  start_qualification_institution_id: zId,
  current_qualification_id: optionalZId,
  current_qualification_subject_id: optionalZId,
  current_qualification_institution_id: optionalZId,
  start_professional_id: zId,
  start_professional_type_id: zId,
  start_professional_subject_id_1: zId,
  start_professional_subject_id_2: optionalZId,
  start_professional_institution_id: zId,
  current_professional_id: zId,
  current_professional_type_id: zId,
  current_professional_subject_id_1: zId,
  current_professional_subject_id_2: optionalZId,
  current_professional_institution_id: zId,
  start_salary_level_id: zId,
  start_salary_degree: zId,
  current_salary_level_id: zId,
  current_salary_degree: zId,
});

export type StaffCreateForm = z.infer<typeof staffCreateForm>;
export type StaffCreateFormFull = z.infer<typeof staffCreateFormFull>;
export type StaffCreateREQ = FlattenSelectOption<StaffCreateFormFull>;
export type StaffCreateRES = {
  data: StaffCreateREQ & {
    staff_id: number;
    created_at: string;
    updated_at: string;
  };
};

// UPDATE
export const staffUpdateForm = staffCreateForm;
const staffUpdateFormFull = staffUpdateForm.extend({
  staff_id: z.number(),
  created_by: z.number(),
  updated_by: z.number(),
  staff_active: z.number(),
});
export const staffUpdateREQ = staffCreateREQ
  .omit({ location_code: true })
  .extend({ staff_id: z.number() });

export type StaffUpdateForm = z.infer<typeof staffUpdateForm>;
export type StaffUpdateFormFull = z.infer<typeof staffUpdateFormFull>;
export type StaffUpdateREQ = FlattenSelectOption<StaffUpdateFormFull>;
export type StaffUpdateRES = StaffCreateRES;

// SEARCH
export const staffSearchForm = z.object({
  staff_name: z.string().nonempty("សូមបញ្ចូលឈ្មោះដើម្បីស្វែងរក!"),
});
export const staffSearchFormFull = staffSearchForm.extend({
  page: z.coerce.number().int().positive().optional().nullable(),
});
export type StaffSearchForm = z.infer<typeof staffSearchForm>;
export type StaffSearchFormFull = z.infer<typeof staffSearchFormFull>;
export interface StaffSearchResponse {
  data: StaffCreateRES["data"][];
  links: {
    first: string;
    last: string;
    prev: null;
    next: null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: null | string;
      label: string;
      page: number | null;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
export interface StaffSearchRES {
  data: StaffEachSearchRES[];
  links: StaffSearchResponse["links"];
  meta: StaffSearchResponse["meta"];
}
export type StaffEachSearchRES = {
  staff_id: StaffCreateRES["data"]["staff_id"];
  payroll_id: StaffCreateRES["data"]["payroll_id"];
  staff_name: StaffCreateRES["data"]["staff_name"];
  staff_dob: StaffCreateRES["data"]["staff_dob"];
  staff_phone: StaffCreateRES["data"]["staff_phone"];
};

// SHOW - SINGLE
export type StaffShowResponse = StaffCreateRES;
export type StaffShowRES = {
  data: StaffUpdateFormFull;
  options: {
    genders: { id: number; value: string }[] | null;
    statuses: StaffStatusIndexResponse["data"] | null;
    subjects: StaffSubjectIndexResponse["data"] | null;
    positions: StaffPositionIndexResponse["data"] | null;
    qualificationsBacii: StaffQualificationIndexResponse["data"] | null;
    qualifications: StaffQualificationIndexResponse["data"] | null;
    professionals: StaffProfessionalIndexResponse["data"] | null;
    professionalTypes: StaffProfessionalTypeIndexResponse["data"] | null;
    institutions: StaffInstitutionIndexResponse["data"] | null;
    salaryLevels: StaffSalaryLevelIndexResponse["data"] | null;
    salaryLevelGradesStart: { id: number; value: string }[] | null;
    salaryLevelGradesCurrent: { id: number; value: string }[] | null;
  };
};
