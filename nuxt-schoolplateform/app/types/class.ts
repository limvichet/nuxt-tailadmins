import type { SelectOption } from "~/lib/schema";

type EndpointRES = {
  data: Array<SelectOption>;
  code: number;
  message: string;
};

export interface ClassAcademicIndexRES extends EndpointRES {}
export interface ClassGradeIndexRES extends EndpointRES {}
export interface ClassGradeTypeIndexRES extends EndpointRES {}
export interface ClassStaffIndexRES extends EndpointRES {}
