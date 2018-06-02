import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class ExamService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Exam Grade

    saveExamGrade(req: any) {
        return this._dataserver.post(Globals.erproute + "saveExamGrade", req)
    }

    getExamGrade(req: any) {
        return this._dataserver.post(Globals.erproute + "getExamGrade", req)
    }

    // Exam Bench

    saveExamInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveExamInfo", req)
    }

    getExamDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getExamDetails", req)
    }

    // Exam Result

    saveExamResult(req: any) {
        return this._dataserver.post(Globals.erproute + "saveExamResult", req)
    }

    getExamResult(req: any) {
        return this._dataserver.post(Globals.erproute + "getExamResult", req)
    }
}