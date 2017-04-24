import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class PickDropService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getPickDropDetail(req: any) {
        return this._dataserver.post("getPickDropDetail", req)
    }

    savePickDropInfo(req: any) {
        return this._dataserver.post("savePickDropInfo", req)
    }
}