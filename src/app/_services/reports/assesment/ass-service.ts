import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class AssesmentReportService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Assesment Result

    getAssesmentResultReports(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getAssesmentResultReports", req)
    }
}