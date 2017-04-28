import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class MenuService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getMenuHead(req: any) {
        return this._dataserver.post("getMenuHead", req)
    }

    getMenuDetails(req: any) {
        return this._dataserver.post("getMenuDetails", req);
    }

    getUserRights(req: any) {
        return this._dataserver.post("getUserRights", req)
    }

    saveUserRights(req: any) {
        return this._dataserver.post("SaveUserRights", req)
    }
}