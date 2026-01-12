import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import type { BaseFieldProps, FormOptions } from "vee-validate";
import type { Ref } from "vue";
import type z from "zod";
import { ZodEffects } from "zod";

type FieldContext<TValue = any> = {
  model: Ref<TValue>;
  props: Ref<BaseFieldProps>;
};

type FormFields<T extends z.ZodRawShape> = {
  [K in keyof T]: FieldContext<z.infer<T[K]>>;
};

interface CustomFieldsOptions<T extends z.ZodRawShape>
  extends Omit<FormOptions<z.infer<z.ZodObject<T>>>, "validationSchema"> {
  validationSchema:
    | z.ZodObject<T>
    | z.ZodEffects<z.ZodObject<T>>
    | z.ZodEffects<z.ZodEffects<z.ZodObject<T>>>;
}

export function useCustomFields<T extends z.ZodRawShape>(
  options: CustomFieldsOptions<T>
) {
  const typedSchema = toTypedSchema(options.validationSchema);

  const form = useForm<z.infer<z.ZodObject<T>>>({
    ...options,
    validationSchema: typedSchema,
  });

  const fields: any = {};

  let sourceSchema: any = options.validationSchema;

  while (sourceSchema instanceof ZodEffects) {
    sourceSchema = sourceSchema._def.schema;
  }

  const keys = Object.keys((sourceSchema as z.ZodObject<T>).shape);

  keys.forEach((key) => {
    const [model, props] = form.defineField(key as any);
    fields[key] = { model, props };
  });

  return {
    ...form,
    fields: fields as FormFields<T>,
  };
}
