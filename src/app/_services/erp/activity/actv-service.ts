import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ActivityService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getActivityDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getActivityDetails", req)
    }

    saveActivityInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveActivityInfo", req)
    }
}