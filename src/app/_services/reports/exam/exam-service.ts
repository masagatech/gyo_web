import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ExamReportService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Exam Result

    getExamResultReports(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getExamResultReports", req)
    }

    downloadExamResult(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "downloadExamResult", req)
    }
}