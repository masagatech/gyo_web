import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class DriverInfoService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getDriverInfoGrid(req: any) {
        return this._dataserver.post("getDriverInfoGrid", req)
    }

    getDriverInfoDetails(req: any) {
        return this._dataserver.post("getDriverInfoDetails", req)
    }

    saveDriverInfo(req: any) {
        return this._dataserver.post("saveDriverInfo", req)
    }
}