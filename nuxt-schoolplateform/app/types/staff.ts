export interface StaffStatusIndexResponse {
  data: Array<{ id: number; value: string }>;
  code: number;
  message: string;
}
export interface StaffQualificationIndexResponse
  extends StaffStatusIndexResponse {}
export interface StaffProfessionalIndexResponse
  extends StaffStatusIndexResponse {}
export interface StaffProfessionalTypeIndexResponse
  extends StaffStatusIndexResponse {}
export interface StaffSubjectIndexResponse extends StaffStatusIndexResponse {}
export interface StaffLocationIndexResponse {
  data: Array<{ id: string; value: string }>;
  code: number;
  message: string;
}
export interface StaffPositionIndexResponse extends StaffStatusIndexResponse {}
export interface StaffInstitutionIndexResponse
  extends StaffStatusIndexResponse {}

export interface StaffSalaryLevelIndexResponse
  extends StaffStatusIndexResponse {}
