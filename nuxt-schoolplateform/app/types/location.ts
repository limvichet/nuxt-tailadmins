interface KV {
  id: number | string;
  value: string;
}

export interface LocationTypeResponse {
  data: Array<{ id: number; value: string }>;
  code: number;
  message: string;
}
export interface LocationProvinceResponse {
  data: Array<{ id: string; value: string }>;
  code: number;
  message: string;
}
export interface LocationDistrictResponse extends LocationProvinceResponse {}
export interface LocationCommuneResponse extends LocationProvinceResponse {}
export interface LocationVillageResponse extends LocationProvinceResponse {}
export interface LocationLocationResponse extends LocationProvinceResponse {}
export interface LocationRegionResponse extends LocationProvinceResponse {}
export interface LocationLevelResponse extends LocationTypeResponse {}

export interface LocationStoreBody {
  edu_level_id: number;
  location_type_id: number;
  pro_code: string;
  dis_code: string;
  com_code: string;
  vil_code: string;
  location_code: string;
  temporary_code: number;
  emis_code?: string;
  location_kh: string;
  schoolclaster?: string;
  school_annex?: number;
  main_school?: string;
  region_id?: number;
  multi_level_edu?: number;
  disadvantage?: number;
  location_history?: string;
  created_by: number;
  updated_by: number;
  active: number;
}

export interface LocationStoreResponseData {
  location_type_id: number;
  pro_code: string;
  dis_code: string;
  com_code: string;
  vil_code: string;
  location_code: string;
  temporary_code: number;
  emis_code: string | null;
  location_kh: string;
  schoolclaster: string | null;
  school_annex: number;
  main_school: string | null;
  region_id: number | null;
  multi_level_edu: number | null;
  edu_level_id: number;
  disadvantage: number;
  location_history: string | null;
  created_by: number;
  updated_by: number;
  active: number;
  created_at: string;
  updated_at: string;
}

type LocationShowResponseForm = Omit<
  LocationStoreResponseData,
  | "location_type_id"
  | "pro_code"
  | "dis_code"
  | "com_code"
  | "vil_code"
  | "schoolclaster"
  | "main_school"
  | "region_id"
  | "multi_level_edu"
  | "edu_level_id"
> & {
  location_type_id: KV;
  pro_code: KV;
  dis_code: KV;
  com_code: KV;
  vil_code: KV;
  schoolclaster: KV | null;
  main_school: KV | null;
  region_id: KV | null;
  multi_level_edu: KV | null;
  edu_level_id: KV;
};

export interface LocationStoreResponse {
  data: LocationStoreResponseData;
}

export interface LocationSearchResponse {
  data: Array<LocationStoreBody & { created_at: string; updated_at: string }>;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface AllLocationsResponse {
  data: Array<{
    location_type_id: number;
    location_code: string;
    location_kh: string;
  }>;
  links: LocationSearchResponse["links"];
  meta: LocationSearchResponse["meta"];
}

export interface LocationUpdateBody extends LocationStoreBody {}
export interface LocationUpdateResponse extends LocationStoreResponse {}

export interface LocationShowResponse {
  data: LocationShowResponseForm;
  options: {
    location_type: LocationTypeResponse["data"] | null;
    provinces: LocationProvinceResponse["data"] | null;
    districts: LocationDistrictResponse["data"] | null;
    communes: LocationCommuneResponse["data"] | null;
    villages: LocationVillageResponse["data"] | null;
    locations: LocationLocationResponse["data"] | null;
    regions: LocationRegionResponse["data"] | null;
    levels: LocationLevelResponse["data"] | null;
  };
}
