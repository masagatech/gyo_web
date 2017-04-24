import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class DriverService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getDriverGrid(req: any) {
        return this._dataserver.post("getDriverGrid", req)
    }

    getDriverDetails(req: any) {
        return this._dataserver.post("getDriverDetails", req)
    }

    saveDriverInfo(req: any) {
        return this._dataserver.post("saveDriverInfo", req)
    }
}