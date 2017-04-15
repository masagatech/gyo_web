import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class DriverInfoService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getDriverInfoGrid(req: any) {
        return this._dataserver.post("getdriverinfogrid", req)
    }

     getDriverInfoDetail(req: any) {
        return this._dataserver.post("getdriverinfodetail", req)
    }

}