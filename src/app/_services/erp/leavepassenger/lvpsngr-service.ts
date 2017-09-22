import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class PassengerLeaveService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getPassengerLeave(req: any) {
        return this._dataserver.post("getPassengerLeave", req)
    }

    savePassengerLeave(req: any) {
        return this._dataserver.post("savePassengerLeave", req)
    }

    savePassengerLeaveApproval(req: any) {
        return this._dataserver.post("savePassengerLeaveApproval", req)
    }

    getTeacherLeave(req: any) {
        return this._dataserver.post(Globals.erproute + "getTeacherLeave", req)
    }
}