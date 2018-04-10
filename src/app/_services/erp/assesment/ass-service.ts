import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class AssesmentService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Assesment Bench

    saveAssesmentInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveAssesmentInfo", req)
    }

    getAssesmentDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getAssesmentDetails", req)
    }

    // Assesment Result

    saveAssesmentResult(req: any) {
        return this._dataserver.post(Globals.erproute + "saveAssesmentResult", req)
    }

    getAssesmentResult(req: any) {
        return this._dataserver.post(Globals.erproute + "getAssesmentResult", req)
    }

    getAssesmentResultReports(req: any) {
        return this._dataserver.post(Globals.erproute + "getAssesmentResultReports", req)
    }
}