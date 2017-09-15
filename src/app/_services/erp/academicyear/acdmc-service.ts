import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class AcademicYearService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAcademicYear(req: any) {
        return this._dataserver.post(Globals.erproute + "getAcademicYear", req)
    }

    saveAcademicYear(req: any) {
        return this._dataserver.post(Globals.erproute + "saveAcademicYear", req)
    }
}