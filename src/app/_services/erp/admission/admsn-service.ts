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

    saveStudentInfo(req: any) {
        return this._dataserver.post("saveStudentInfo", req)
    }

    saveStudentRollover(req: any) {
        return this._dataserver.post("saveStudentRollover", req)
    }

    getStudentDetails(req: any) {
        return this._dataserver.post("getStudentDetails", req)
    }

    viewStudentDetails(req: any) {
        return this._dataserver.post("viewStudentDetails", req)
    }
    
    saveStudentVehicleMap(req: any) {
        return this._dataserver.post("saveStudentVehicleMap", req)
    }
}