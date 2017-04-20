import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class PickDropService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    savePickDropInfo(req: any) {
        return this._dataserver.post("savePickDropInfo", req)
    }

    getPickDropGrid(req: any) {
        return this._dataserver.post("getPickDropGrid", req)
    }

    getPickDropDetail(req: any) {
        return this._dataserver.post("getPickDropDetail", req)
    }
}