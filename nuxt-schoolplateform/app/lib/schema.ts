import { z } from "zod";
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";

export const zId = z.union([z.string(), z.number()]);
export const optionalZId = z
  .union([z.string(), z.number()])
  .optional()
  .nullable();

export const selectOption = z.object(
  { id: zId, value: z.string() },
  { required_error: "សូមជ្រើសរើសតម្លៃណាមួយ!" }
);
export const optionalSelectOption = z
  .object({ id: zId, value: z.string() })
  .optional()
  .nullable();

export type SelectOption = z.infer<typeof selectOption>;
export type OptionalSelectOption = z.infer<typeof optionalSelectOption>;

export const MIN_DATE = parseDate("1900-01-01");
export const MAX_DATE = today(getLocalTimeZone());

export const dateFieldOption = (
  required_err: string = "សូមបញ្ចូលកាលបរិច្ឆេទ!",
  invalid_err: string = "សូមបញ្ចូលកាលបរិច្ឆេទដែលត្រឹមត្រូវ! (dd/mm/yyyy)",
  check_max_date: boolean = true
) => {
  return z
    .string({ message: required_err })
    .date(invalid_err)
    .refine(
      (date: string) => {
        const dateCalendarDate = parseDate(date);
        return dateCalendarDate.compare(MIN_DATE) >= 0;
      },
      { message: "កាលបរិច្ឆេទដំបូងបំផុតចាប់ពី 01/01/1900!" }
    )
    .refine(
      (date: string) => {
        const dateCalendarDate = parseDate(date);
        return check_max_date ? dateCalendarDate.compare(MAX_DATE) < 0 : true;
      },
      { message: "កាលបរិច្ឆេទមិនអាចលើសថ្ងៃបច្ចុប្បន្ន!" }
    );
};
