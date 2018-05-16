import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class AttendanceReportsService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAttendanceReports(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getAttendanceReports", req)
    }
}