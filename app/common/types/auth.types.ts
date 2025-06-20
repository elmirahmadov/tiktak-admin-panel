// import { IResponse } from "./api.types";
// import { IProfile, ITokenResponse } from "./profile.types";

// export interface ILogin {
//   email: string;
//   password: string;
// }

// export interface ISingup {
//   phone: string;
//   password: string;
//   name: string;
//   surname: string;
//   email: string;
// }

// export interface IOtp {
//   email: string;
//   code: number;
// }

// export interface IResetPassword {
//   phone: string;
//   password: string;
//   confirm_password: string;
// }

// export interface ISingupResponse extends IResponse<{ otp: number } | null> {}
// export interface ILoginResponse
//   extends IResponse<{ otp: string; message: string } | null> {}
// export interface IResetPasswordResponse extends IResponse<null> {}
// export interface IOtpResponse
//   extends IResponse<{
//     data: {
//       tokens: ITokenResponse;
//       profile: IProfile;
//     };
//   } | null> {}
