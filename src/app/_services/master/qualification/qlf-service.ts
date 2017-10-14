import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class QualificationService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getQualificationDetails(req: any) {
        return this._dataserver.post("getQualificationDetails", req)
    }

    saveQualificationInfo(req: any) {
        return this._dataserver.post("saveQualificationInfo", req)
    }
}