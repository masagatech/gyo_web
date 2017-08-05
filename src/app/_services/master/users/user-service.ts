import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getUserDetails(req: any) {
        return this._dataserver.post("getUserDetails", req)
    }

    saveUserInfo(req: any) {
        return this._dataserver.post("saveUserInfo", req)
    }

    getUserRights(req: any) {
        return this._dataserver.post("getUserRights", req)
    }

    saveUserRights(req: any) {
        return this._dataserver.post("SaveUserRights", req)
    }

    getUserLoginLog(req: any) {
        return this._dataserver.post("getUserLoginLog", req)
    }
}