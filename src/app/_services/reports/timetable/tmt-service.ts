import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class TimeTableReportService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getClassTimeTableMonthly(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getClassTimeTableMonthly", req)
    }

    getClassTimeTableWeekly(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getClassTimeTableWeekly", req)
    }

    getClassTimeTablePeriod(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getClassTimeTablePeriod", req)
    }
}