import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class AdmissionService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    saveAdmissionInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveAdmissionInfo", req)
    }

    savePassengerInfo(req: any) {
        return this._dataserver.post("saveStudentInfo", req)
    }

    getPassengerDetails(req: any) {
        return this._dataserver.post("getStudentDetails", req)
    }
}