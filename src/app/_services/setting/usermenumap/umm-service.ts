import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class UserMenuMapService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getUserRights(req: any) {
        return this._dataserver.post("getUserRights", req)
    }

    saveUserRights(req: any) {
        return this._dataserver.post("SaveUserRights", req)
    }
}