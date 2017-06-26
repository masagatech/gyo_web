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
  dispname: string;
  fullname: string;
  utypename: string;
  uphoto: string;
  wsautoid: number;
  wscode: string;
  wsname: string;
  wslogo: string;
  lgcode: string;
  login: string,
  status: boolean,
  issysadmin: boolean,
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