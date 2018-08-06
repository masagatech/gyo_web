import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';
import { Globals } from '@globals';

@Injectable()
export class DashboardService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getMarketingDB(req: any) {
        return this._dataserver.post("getMarketingDB", req)
    }

    getDashboard(req: any) {
        return this._dataserver.post("getDashboard", req)
    }

    getHelpDesk(req: any) {
        return this._dataserver.post("getHelpDesk", req)
    }

    getScheduleReports(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getScheduleReports", req)
    }

    getERPDashboard(req: any) {
        return this._dataserver.post(Globals.erproute + "getERPDashboard", req)
    }

    getStudentDashboard(req: any) {
        return this._dataserver.post(Globals.erproute + "getStudentDashboard", req)
    }
}