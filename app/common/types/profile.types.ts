// import { IPages, IResponse } from "./api.types";

// export enum Gender {
//   MALE = "MALE",
//   FEMALE = "FEMALE",
//   OTHER = "OTHER",
// }

// export enum ProfileRole {
//   EMPLOYEE = "STAFF_EMPLOYEE",
//   MANAGER = "STAFF_MANAGER",
//   ADMIN = "STAFF_ADMIN",
// }

// export enum StatusRegister {
//   INACTIVE = 0,
//   ACTIVE = 1,
// }

// export interface ITokenResponse {
//   access_token: string;
//   refresh_token: string;
// }

// export interface IProfile {
//   id: number;
//   name: string;
//   surname: string;
//   img_url?: string | null;
//   phone: string;
//   email: string;
//   gender: Gender | null;
//   job_title?: string | null;
//   status: StatusRegister;
//   role: ProfileRole;
//   password?: string;
//   // register_at: boolean;
//   // register_status: StatusRegister;
//   created_at: Date;
//   updated_at?: string;
//   access_pages?: IPages[] | number[] | null;
// }
// export interface IProfileUpdate {
//   name: string;
//   surname: string;
//   img_url?: string | null;
//   job_title?: string | null;
//   phone: string;
//   email: string;
//   access_pages?: IPages[] | number[] | null;
//   status?: StatusRegister;
// }
// export interface IProfileResponse {
//   data: IProfile;
// }

// export interface IFullResponse<T>
//   extends IResponse<{
//     data: T;
//   }> {}

// export enum ApplyUserStatus {
//   PENDING = "PENDING",
//   DENIED = "DENIED",
//   ACCEPTED = "ACCEPTED",
// }

// export interface BusinessType {
//   id: number;
//   name: string;
//   slug: string;
// }

// export interface ApplyUser {
//   id: number;
//   full_name: string;
//   phone: string;
//   reason: null | string;
//   status: ApplyUserStatus;
//   updated_at: Date;
//   created_at: Date;
//   business_type: BusinessType;
// }

// export interface ApplyUpdateStatusPayload {
//   reason?: string | null;
//   status: ApplyUserStatus;
// }

// export interface DeviceUser {
//   id: number;
//   version: string;
//   platform: "ios" | "android" | "web";
//   language: "en" | "ru" | "az";
//   created_at: string;
//   updated_at: string;
//   user: {
//     name: string;
//     surname: string;
//     phone: string;
//     gender: "MALE" | "FEMALE";
//   };
// }

// export type METHOD = "POST" | "GET" | "PUT" | "DELETE";
// export interface ErrorLogsType {
//   id: number;
//   user_id: number;
//   message: string;
//   payload: string;
//   agent: string;
//   method: METHOD;
//   url: string;
//   ip: string;
//   phone: string;
//   status: number;
//   account: string;
//   branch_id: null | number;
//   full_name: string;
//   created_at: string;
// }

// export interface VersionType {
//   id: number;
//   version_android: string;
//   version_ios: string;
//   system_android: boolean;
//   system_ios: boolean;
// }
