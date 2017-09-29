import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class AttendanceService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAttendance(req: any) {
        return this._dataserver.post(Globals.erproute + "getAttendance", req)
    }

    saveAttendance(req: any) {
        return this._dataserver.post(Globals.erproute + "saveAttendance", req)
    }
}