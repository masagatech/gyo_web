import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class SchoolService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getSchoolDetails(req: any) {
        return this._dataserver.post("getSchoolDetails", req)
    }

    saveSchoolInfo(req: any) {
        return this._dataserver.post("saveSchoolInfo", req)
    }
}