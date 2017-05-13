import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class DashboardService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getMarketingDB(req: any) {
        return this._dataserver.post("getMarketingDB", req)
    }
}