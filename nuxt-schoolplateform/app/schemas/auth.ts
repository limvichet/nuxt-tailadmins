import z from "zod";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  active: number;
  status: string;
  location_code: string | null;
  created_at: string;
  updated_at: string;
}

const loginForm = z.object({
  email: z
    .string()
    .nonempty("សូមបញ្ចូល E-mail!")
    .email("សូមបញ្ចូល E-mail ដែលត្រឹមត្រូវ!"),
  password: z.string().nonempty("សូមបញ្ចូលលេខសម្ងាត់!"),
});
export const loginFormFull = loginForm;
export type LoginREQ = z.infer<typeof loginFormFull>;
export type LoginRES = {
  user: User;
  token: string;
  message: string;
  code: number;
};

const registerForm = z
  .object({
    name: z.string().nonempty("សូមបញ្ចូលឈ្មោះជាភាសាអង់គ្លេស!"),
    email: z
      .string()
      .nonempty("សូមបញ្ចូល E-mail!")
      .email("សូមបញ្ចូល E-mail ដែលត្រឹមត្រូវ!"),
    password: z.string().nonempty("សូមបញ្ចូលលេខសម្ងាត់!"),
    password_confirmation: z.string().nonempty("សូមបញ្ចូលលេខសម្ងាត់ម្ដងទៀត!"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "លេខសម្ងាត់ទាំងពីរ ត្រូវតែដូចគ្នា!",
    path: ["password_confirmation"],
  });

export const registerFormFull = registerForm;
export type RegisterREQ = z.infer<typeof registerFormFull>;
export type RegisterRES = {
  user: Omit<User, "email_verified_at">;
  token: string;
};

export const chPWSchema = z
  .object({
    current_password: z.string().min(1, "សូមបំពេញលេខសម្ងាត់ចាស់!"),
    new_password: z.string().min(8, "លេខសម្ងាត់ថ្មីយ៉ាងហោចត្រូវមាន 8 តួអក្សរ!"),
    new_password_confirmation: z
      .string()
      .min(8, "បញ្ជាក់លេខសម្ងាត់ថ្មី ក៏ត្រូវមានយ៉ាងហោច 8 តួអក្សរ!"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "លេខសម្ងាត់ថ្មី និងបញ្ជាក់លេខសម្ងាត់ថ្មី ត្រូវតែដូចគ្នា!",
    path: ["new_password_confirmation"],
  });

export type chPWForm = z.infer<typeof chPWSchema>;
