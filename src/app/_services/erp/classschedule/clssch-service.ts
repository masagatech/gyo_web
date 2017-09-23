import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ClassScheduleService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    saveClassSchedule(req: any) {
        return this._dataserver.post(Globals.erproute + "saveClassSchedule", req)
    }

    getClassSchedule(req: any) {
        return this._dataserver.post(Globals.erproute + "getClassSchedule", req)
    }

    saveTimeTable(req: any) {
        return this._dataserver.post(Globals.erproute + "saveTimeTable", req)
    }
}