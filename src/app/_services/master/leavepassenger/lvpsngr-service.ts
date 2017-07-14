import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class LeavePassengerService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getLeavePassenger(req: any) {
        return this._dataserver.post("getLeavePassenger", req)
    }

    saveLeavePassenger(req: any) {
        return this._dataserver.post("saveLeavePassenger", req)
    }
}