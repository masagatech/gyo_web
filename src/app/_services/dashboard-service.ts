import { Injectable } from '@angular/core';
import { DataService } from './dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class DashboardService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getDashboard(req: any) {
        return this._dataserver.post("getdashboard", req)
    }

}