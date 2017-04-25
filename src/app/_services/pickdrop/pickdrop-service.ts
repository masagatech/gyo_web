import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class PickDropService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getPickDropDetails(req: any) {
        return this._dataserver.post("getPickDropDetails", req)
    }

    savePickDropInfo(req: any) {
        return this._dataserver.post("savePickDropInfo", req)
    }
}