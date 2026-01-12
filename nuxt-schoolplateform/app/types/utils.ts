import type { SelectOption } from "~/lib/schema";

type WithId = { id: string | number; [key: string]: any };
type UnwrapId<T> = T extends SelectOption ? T["id"] : T;
export type FlattenSelectOption<T> = {
  [K in keyof T]: UnwrapId<T[K]>;
};
