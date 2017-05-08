export class UserReq {
  constructor(
    public email: string,
    public pwd: string) { }
}

export class LoginUser {
  UserData: any;
}

export interface LoginUserModel {
  loginid: number;
  uid: number;
  ucode: string;
  utype: string;
  email: string;
  fullname: string;
  uphoto: string;
  login: string,
  status: boolean,
  errcode: string,
  errmsg: string,
  sessiondetails: any;
  globsettings: GlobalSettings;
}

export interface GlobalSettings {
  dateformat: string,
  numberforamt: string,
  language: string
}