import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class FeesService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    saveClassFees(req: any) {
        return this._dataserver.post(Globals.erproute + "saveClassFees", req)
    }

    getClassFees(req: any) {
        return this._dataserver.post(Globals.erproute + "getClassFees", req)
    }

    saveStudentFees(req: any) {
        return this._dataserver.post(Globals.erproute + "saveStudentFees", req)
    }

    getStudentFees(req: any) {
        return this._dataserver.post(Globals.erproute + "getStudentFees", req)
    }
}