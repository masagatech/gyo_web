import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class FeesReportsService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getFeesReports(req: any) {
        return this._dataserver.post(Globals.reporturl + "getFeesReports", req)
    }
}