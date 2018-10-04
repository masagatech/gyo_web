import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { LoginUserModel } from '../../_model/user_model';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class LoginService {
    private loginUser: LoginUserModel;

    constructor(private _dataserver: DataService, private _router: Router) { }

    getUser() {
        if (this.loginUser === undefined) {
            let usr = Cookie.get("_schsession_");

            if (usr) {
                //this._router.navigate(['login']);
                return null;
            } else {
                //this._router.navigate(['login']);
                return null;
            }
        } else {
            return this.loginUser;
        }
    }

    savePassword(req: any) {
        return this._dataserver.post("savePassword", req);
    }

    getLogOut(req: any) {
        return this._dataserver.post("getLogout", req);
    }

    setUsers(userDetails): LoginUserModel {
        this.loginUser = userDetails;

        if (userDetails == null) {
            Cookie.delete('_schsession_');
            sessionStorage.clear();
        }
        else {
            this.loginUser.login = this.loginUser.uid.toString() + ":" + this.loginUser.ucode;
            Cookie.delete('_schsession_');
            Cookie.set("_schsession_", this.loginUser.sessiondetails.sessionid.toString());
        }

        return this.loginUser;
    }

    getUserDetails(req: any) {
        return this._dataserver.post("getUserDetails", req)
    }

    saveUser(req: any) {
        return this._dataserver.post("saveUserInfo", req)
    }
}