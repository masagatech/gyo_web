import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class ReportsService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAttendanceReports(req: any) {
        return this._dataserver.post("getAttendanceReports", req)
    }

    getRouteWisePassengerReports(req: any) {
        return this._dataserver.post("getRouteWisePassengerReports", req)
    }

    getSpeedViolationReports(req: any) {
        return this._dataserver.post("getSpeedVialationReports", req)
    }

    getPassengerTripReports(req: any) {
        return this._dataserver.post("getPassengerTripReports", req)
    }
}