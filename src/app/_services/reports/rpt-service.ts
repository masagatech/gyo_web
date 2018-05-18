import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';
import { Globals } from '@globals';

@Injectable()
export class ReportsService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Attendance

    getAttendanceReports(req: any) {
        return this._dataserver.post("getAttendanceReports", req)
    }

    // Route Wise Passenger

    getRouteWisePassengerReports(req: any) {
        return this._dataserver.post("getRouteWisePassengerReports", req)
    }

    // Passenger Trip

    getPassengerTripReports(req: any) {
        return this._dataserver.post("getPassengerTripReports", req)
    }

    // Speed And Milege Reports

    getReports(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getReports", req)
    }

    postReports(req: any) {
        return this._dataserver.rawpost(Globals.reporturl + "postReports", req)
    }
}