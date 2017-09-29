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
  utypename: string;
  ctype: string;
  ctypename: string;
  email: string;
  dispname: string;
  fullname: string;
  uphoto: string;
  enttid: number;
  enttname: string;
  schlogo: string;
  wsautoid: number;
  wscode: string;
  wsname: string;
  schenttmaxno: number;
  cmpenttmaxno: number;
  psngrtype: string;
  smpsngrtype: string;
  wslogo: string;
  lgcode: string;
  login: string,
  status: boolean,
  issysadmin: boolean,
  isemp: boolean,
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