import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class SubjectService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getSubjectDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getSubjectDetails", req)
    }

    saveSubjectInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveSubjectInfo", req)
    }
}